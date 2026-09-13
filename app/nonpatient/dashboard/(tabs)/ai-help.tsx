import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/lib/axios";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AIHeader from "@/components/feature/nonpatient/dashboard/ai/AIHeader";
import ChatInput from "@/components/feature/nonpatient/dashboard/ai/ChatInput";
import ChatMessage, {
  Message,
} from "@/components/feature/nonpatient/dashboard/ai/ChatMessage";
import QuickPrompts from "@/components/feature/nonpatient/dashboard/ai/QuickPrompts";

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
    sender: "user",
    text: "What should I do?",
  },
  {
    id: "2",
    sender: "ai",
    text: "If the patient needs help, stay calm and assess the situation first. Check their vital signs, ensure they are safe, and follow the recommended steps.",
  },
  {
    id: "3",
    sender: "user",
    text: "Check patient condition",
  },
  {
    id: "4",
    sender: "ai",
    text: "Here is the latest patient condition:\n🖤 Heart Rate: 82 bpm (Normal)\n🫁 Oxygen Level: 96% (Normal)\n🌡️ Temperature: 36.7°C (Normal)\n🫡 Mood: Satisfied",
  },
];

export default function AiHelpScreen() {
  const { user } = useAuth();
  const [patientName, setPatientName] = useState<string>("Kathryn Bernardo");
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [activePrompt, setActivePrompt] = useState<string | null>(
    "What should I do?",
  );
  const scrollViewRef = useRef<ScrollView>(null);

  // Fetch current patient name
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
              const name = `${conn.patient.firstName || ""} ${conn.patient.lastName || ""}`.trim();
              if (name) setPatientName(name);
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

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const getAIResponse = (query: string): string => {
    const q = query.toLowerCase().trim();
    if (q.includes("condition") || q.includes("vitals") || q.includes("status")) {
      return "Here is the latest patient condition:\n🖤 Heart Rate: 82 bpm (Normal)\n🫁 Oxygen Level: 96% (Normal)\n🌡️ Temperature: 36.7°C (Normal)\n🫡 Mood: Satisfied";
    }
    if (q.includes("what should i do") || q.includes("help")) {
      return "If the patient needs help, stay calm and assess the situation first. Check their vital signs, ensure they are safe, and follow the recommended steps.";
    }
    if (q.includes("emergency")) {
      return "Current readings indicate the patient's vitals are stable. If the patient is unresponsive, complaining of acute chest pain, or having severe trouble breathing, press the red Emergency button or contact emergency services immediately.";
    }
    if (q.includes("stroke")) {
      return "Remember the FAST protocol for suspected stroke:\n• Face: Has their face fallen on one side?\n• Arms: Can they raise both arms and keep them there?\n• Speech: Is their speech slurred?\n• Time: Call emergency services immediately if you observe any of these.";
    }
    if (q.includes("what does this mean")) {
      return "Telemetry readings indicate all current biometrics are within safe baseline ranges. Regular monitoring ensures sudden spikes or dips will trigger immediate alerts.";
    }
    return `I am here to assist you with ${patientName}'s care. You can ask me to analyze recent vitals, verify symptoms, or provide step-by-step emergency care guidelines.`;
  };

  const handleSend = (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setActivePrompt(text);
    scrollToBottom();

    // Simulate AI response
    setTimeout(() => {
      const aiReply: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: getAIResponse(text),
      };
      setMessages((prev) => [...prev, aiReply]);
      scrollToBottom();
    }, 450);
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
            <ChatMessage key={msg.id} message={msg} />
          ))}
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
});
