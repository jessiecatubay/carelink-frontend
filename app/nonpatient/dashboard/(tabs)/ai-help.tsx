import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/lib/axios";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  KeyboardEvent,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import AIHeader from "@/components/feature/nonpatient/dashboard/ai/AIHeader";
import ChatInput from "@/components/feature/nonpatient/dashboard/ai/ChatInput";
import ChatMessage, {
  Message,
} from "@/components/feature/nonpatient/dashboard/ai/ChatMessage";
import QuickPrompts from "@/components/feature/nonpatient/dashboard/ai/QuickPrompts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChatBubble from "@/components/feature/nonpatient/dashboard/ai/ChatBubble";
import AIIcon from "@/components/feature/nonpatient/dashboard/ai/AIIcon";

const DEFAULT_PROMPTS = [
  "What medication to take today?",
  "Check medication schedule",
  "Is this an emergency?",
  "What should I do?",
  "Check patient condition",
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "ai",
    text: "Hello! I'm Carelink. I can assist you with your patient's scheduled medications & pill reminders, first-aid guidance, and emergency response. Ask me what medication to take today or how I can help!",
  },
];

const CHAT_HISTORY_KEY = "carelink_ai_chat_history";

export default function AiHelpScreen() {
  const { user } = useAuth();
  const [patientName, setPatientName] = useState<string>(
    "Connect to a patient first",
  );
  const [patientId, setPatientId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [activePrompt, setActivePrompt] = useState<string | null>(
    "What medication to take today?",
  );
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const [isAIResponding, setIsAIResponding] = useState(false);

  // Tab bar height for exact iOS keyboard clearance above bottom tabs
  const rawTabBarHeight = useBottomTabBarHeight();
  const tabBarHeight =
    typeof rawTabBarHeight === "number" && !isNaN(rawTabBarHeight)
      ? rawTabBarHeight
      : Platform.OS === "ios"
        ? 88
        : 68;

  // Reactive bottom padding animation
  const keyboardOffset = useRef(new Animated.Value(0)).current;
  const isKeyboardOpenRef = useRef(false);
  const currentKeyboardHeightRef = useRef(0);
  const initialContainerHeightRef = useRef(0);
  const currentContainerHeightRef = useRef(0);

  const calculateTargetOffset = useCallback(
    (keyboardHeight: number) => {
      if (keyboardHeight <= 0) return 0;

      if (Platform.OS === "ios") {
        // On iOS, the tab bar remains visible under the keyboard.
        // The view ends at the top of the tab bar, so the keyboard overlaps
        // the view only by the extent it exceeds the tab bar height.
        return Math.max(0, keyboardHeight - tabBarHeight);
      }

      // On Android:
      // Check if Android OS / WindowInsets has already resized the container layout.
      const initialHeight = initialContainerHeightRef.current;
      const currentHeight = currentContainerHeightRef.current;
      const layoutShrinkage =
        initialHeight > 0 && currentHeight > 0
          ? Math.max(0, initialHeight - currentHeight)
          : 0;

      // If the container already shrank by keyboard height (e.g. adjustResize mode),
      // no extra padding is required.
      // If the container did NOT shrink (edge-to-edge / bottom tabs), layoutShrinkage is 0,
      // so targetOffset equals keyboardHeight.
      return Math.max(0, keyboardHeight - layoutShrinkage);
    },
    [tabBarHeight]
  );

  const animateKeyboardOffset = useCallback(
    (toValue: number, duration: number = 250) => {
      Animated.timing(keyboardOffset, {
        toValue,
        duration: Platform.OS === "ios" ? duration : 150,
        useNativeDriver: false,
      }).start();
    },
    [keyboardOffset]
  );

  const scrollToBottom = useCallback((animated = true) => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated });
    });
    const t1 = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated });
    }, 100);
    const t2 = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated });
    }, 280);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const handleKeyboardShow = (e: KeyboardEvent) => {
      isKeyboardOpenRef.current = true;
      const kh = e.endCoordinates.height;
      currentKeyboardHeightRef.current = kh;
      const target = calculateTargetOffset(kh);
      animateKeyboardOffset(target, e.duration || 250);
      scrollToBottom();
    };

    const handleKeyboardHide = (e?: KeyboardEvent) => {
      isKeyboardOpenRef.current = false;
      currentKeyboardHeightRef.current = 0;
      animateKeyboardOffset(0, e?.duration || 200);
    };

    const subs = [
      Keyboard.addListener(
        Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
        handleKeyboardShow
      ),
      Keyboard.addListener(
        Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
        handleKeyboardHide
      ),
    ];

    if (Platform.OS === "android") {
      try {
        subs.push(
          Keyboard.addListener("keyboardWillShow", handleKeyboardShow),
          Keyboard.addListener("keyboardWillHide", handleKeyboardHide)
        );
      } catch {}
    }

    return () => {
      subs.forEach((sub) => sub.remove());
    };
  }, [animateKeyboardOffset, calculateTargetOffset, scrollToBottom]);

  const handleContainerLayout = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;
    if (height <= 0) return;

    if (!isKeyboardOpenRef.current) {
      if (!initialContainerHeightRef.current || height > initialContainerHeightRef.current) {
        initialContainerHeightRef.current = height;
      }
    }
    currentContainerHeightRef.current = height;

    if (isKeyboardOpenRef.current && Platform.OS === "android") {
      const target = calculateTargetOffset(currentKeyboardHeightRef.current);
      animateKeyboardOffset(target, 100);
      scrollToBottom();
    }
  };

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

              setPatientId(conn.patientId || conn.patient?.id || null);

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
        ...(patientId ? { patientId } : {}),
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

      <Animated.View
        style={[styles.container, { paddingBottom: keyboardOffset }]}
        onLayout={handleContainerLayout}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatScrollView}
          contentContainerStyle={styles.chatScroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onContentSizeChange={() => scrollToBottom()}
        >
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} isCopyable={true} />
          ))}

          {isAIResponding && (
            <View style={[styles.row, styles.aiRow]}>
              <View style={styles.avatarWrap}>
                <AIIcon size={44} />
              </View>
              <ChatBubble
                text="CareLink is thinking..."
                isUser={false}
                isCopyable={false}
              />
            </View>
          )}
        </ScrollView>

        <QuickPrompts
          prompts={DEFAULT_PROMPTS}
          activePrompt={activePrompt}
          onSelectPrompt={handleSend}
        />

        <ChatInput onSend={handleSend} onFocus={scrollToBottom} />
      </Animated.View>
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
  chatScrollView: {
    flex: 1,
  },
  chatScroll: {
    paddingVertical: 18,
    flexGrow: 1,
    width: "100%",
  },
  avatarWrap: {
    width: 44,
    height: 44,
    marginRight: 10,
    marginBottom: 2,
    flexShrink: 0,
  },
  row: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-end",
    paddingHorizontal: 16,
    width: "100%",
  },
  aiRow: {
    justifyContent: "flex-start",
  },
});
