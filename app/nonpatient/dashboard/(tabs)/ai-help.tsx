import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/lib/axios";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AIHeader from "@/components/feature/nonpatient/dashboard/ai/AIHeader";
import ChatInput from "@/components/feature/nonpatient/dashboard/ai/ChatInput";
import ChatMessage, {
  Message,
} from "@/components/feature/nonpatient/dashboard/ai/ChatMessage";
import QuickPrompts from "@/components/feature/nonpatient/dashboard/ai/QuickPrompts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChatBubble from "@/components/feature/nonpatient/dashboard/ai/ChatBubble";
import { View } from "react-native";
import AIIcon from "@/components/feature/nonpatient/dashboard/ai/AIIcon";

const DEFAULT_PROMPTS = [
  "What should I do?",
  "Is this an emergency?",
  "Check patient condition",
  "What does this mean?",
  "What to do for stroke?",
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "ai",
    text: "Hello! I'm Carelink. I can help you with basic first-aid guidance, emergency-response information, and general elderly-care questions. How can I help?",
  },
];

const CHAT_HISTORY_KEY = "carelink_ai_chat_history";

export default function AiHelpScreen() {
  const { user } = useAuth();
  const [patientName, setPatientName] = useState<string>(
    "Connect to a patient first",
  );
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [activePrompt, setActivePrompt] = useState<string | null>(
    "What should I do?",
  );
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const [isAIResponding, setIsAIResponding] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const fetchPatient = async () => {
      try {
        const result = await axiosInstance.post("/api/user/v1/get-user-by-id", {
          id: user.id,
        });

        const connections = result.data.data?.nonPatientConnections;

        if (Array.isArray(connections)) {
          for (const conn of connections) {
            if (conn.currentPatient && conn.patient) {
              const name =
                `${conn.patient.firstName || ""} ${conn.patient.lastName || ""}`.trim();

              if (name) {
                setPatientName(name);
              }

              break;
            }
          }
        }
      } catch {
        // Fallback to default name
      }
    };

    fetchPatient();
  }, [user?.id]);

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem(CHAT_HISTORY_KEY);

        if (storedHistory) {
          const parsedHistory: Message[] = JSON.parse(storedHistory);

          if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
            setMessages(parsedHistory);
          }
        }
      } catch (error) {
        console.error("Failed to load Carelink chat history:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, []);

  useEffect(() => {
    if (isLoadingHistory) return;

    const saveChatHistory = async () => {
      try {
        await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error("Failed to save Carelink chat history:", error);
      }
    };

    saveChatHistory();
  }, [messages, isLoadingHistory]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSend = async (text: string) => {
    const trimmedText = text.trim();

    if (!trimmedText || isAIResponding) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: trimmedText,
    };

    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setActivePrompt(trimmedText);
    setIsAIResponding(true);
    scrollToBottom();

    try {
      const response = await axiosInstance.post("/api/ai/v1/chat", {
        messages: updatedMessages.map((message) => ({
          role: message.sender === "user" ? "user" : "model",
          text: message.text,
        })),
      });

      const aiText = response.data?.data?.response;

      if (!aiText) {
        throw new Error("Empty AI response");
      }

      const aiReply: Message = {
        id: `${Date.now()}-ai`,
        sender: "ai",
        text: aiText,
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (error) {
      console.error("Carelink AI request failed:", error);

      const errorMessage: Message = {
        id: `${Date.now()}-error`,
        sender: "ai",
        text: "I'm sorry, but I couldn't connect to Carelink right now. Please try again.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAIResponding(false);
    }

    scrollToBottom();
  };
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <AIHeader patientName={patientName} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.chatScroll}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
        >
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} isCopyable={true} />
          ))}

          {isAIResponding && (
            <View
                  style={[
                    styles.row,
                    styles.aiRow,
                  ]}
                >
            <View style={styles.avatarWrap}>
                      <AIIcon size={44} />
                    </View>
            <ChatBubble text="CareLink is thinking..." isUser={false} isCopyable={false} />
            </View>
          )}
        </ScrollView>

        <QuickPrompts
          prompts={DEFAULT_PROMPTS}
          activePrompt={activePrompt}
          onSelectPrompt={handleSend}
        />

        <ChatInput onSend={handleSend} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  chatScroll: {
    paddingVertical: 18,
    flexGrow: 1,
  },
  avatarWrap: {
    marginRight: 10,
    marginBottom: 2,
  },
  row: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "flex-end",
    paddingHorizontal: 16,
  },
  aiRow: {
    justifyContent: "flex-start",
  },
});
