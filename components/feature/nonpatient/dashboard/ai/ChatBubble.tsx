import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ChatBubbleProps = {
  text: string;
  isUser: boolean;
  isCopyable: boolean;
};

export default function ChatBubble({
  text,
  isUser,
  isCopyable
}: ChatBubbleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(text);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  const renderBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
      if (
        part.startsWith("**") &&
        part.endsWith("**") &&
        part.length >= 4
      ) {
        return (
          <Text key={index} style={styles.boldText}>
            {part.slice(2, -2)}
          </Text>
        );
      }

      return <Text key={index}>{part}</Text>;
    });
  };

  const renderFormattedText = () => {
    const lines = text.split("\n");

    return lines.map((line, index) => {
      const trimmedLine = line.trim();

      if (!trimmedLine) {
        return <View key={index} style={styles.lineBreak} />;
      }

      // ### Heading
      if (trimmedLine.startsWith("### ")) {
        return (
          <Text key={index} style={styles.heading3}>
            {renderBoldText(trimmedLine.substring(4))}
          </Text>
        );
      }

      // ## Heading
      if (trimmedLine.startsWith("## ")) {
        return (
          <Text key={index} style={styles.heading2}>
            {renderBoldText(trimmedLine.substring(3))}
          </Text>
        );
      }

      // # Heading
      if (trimmedLine.startsWith("# ")) {
        return (
          <Text key={index} style={styles.heading1}>
            {renderBoldText(trimmedLine.substring(2))}
          </Text>
        );
      }

      // Bullet list
      if (
        trimmedLine.startsWith("- ") ||
        trimmedLine.startsWith("* ")
      ) {
        return (
          <View key={index} style={styles.listRow}>
            <Text style={styles.bullet}>•</Text>

            <Text style={styles.text}>
              {renderBoldText(trimmedLine.substring(2))}
            </Text>
          </View>
        );
      }

      // Numbered list
      const numberedMatch = trimmedLine.match(/^(\d+)\.\s+(.*)$/);

      if (numberedMatch) {
        return (
          <View key={index} style={styles.listRow}>
            <Text style={styles.number}>
              {numberedMatch[1]}.
            </Text>

            <Text style={styles.text}>
              {renderBoldText(numberedMatch[2])}
            </Text>
          </View>
        );
      }

      // Normal paragraph
      return (
        <Text key={index} style={styles.text}>
          {renderBoldText(trimmedLine)}
        </Text>
      );
    });
  };

  return (
    <View>
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        {isUser ? (
          <Text style={[styles.text, styles.userText]}>
            {text}
          </Text>
        ) : (
          <View>
            {renderFormattedText()}
          </View>
        )}
      </View>

      {!isUser && isCopyable && (
        <Pressable
          onPress={handleCopy}
          style={({ pressed }) => [
            styles.copyButton,
            pressed && styles.copyButtonPressed,
          ]}
        >
          <Ionicons
            name={copied ? "checkmark" : "copy-outline"}
            size={15}
            color="#6B7280"
          />

          <Text style={styles.copyText}>
            {copied ? "Copied" : "Copy"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 18,
  },

  userBubble: {
    backgroundColor: "#08A8A8",
    borderBottomRightRadius: 4,
  },

  aiBubble: {
    backgroundColor: "#EBECEE",
    borderTopLeftRadius: 4,
  },

  text: {
    fontSize: 14.5,
    lineHeight: 21,
    color: "#1F2937",
  },

  userText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },

  boldText: {
    fontWeight: "700",
  },

  heading1: {
    fontSize: 20,
    lineHeight: 27,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },

  heading2: {
    fontSize: 18,
    lineHeight: 25,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 5,
  },

  heading3: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },

  lineBreak: {
    height: 7,
  },

  listRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },

  bullet: {
    width: 18,
    fontSize: 14.5,
    lineHeight: 21,
    color: "#1F2937",
  },

  number: {
    width: 24,
    fontSize: 14.5,
    lineHeight: 21,
    color: "#1F2937",
  },

  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 5,
    marginTop: 5,
    marginLeft: 4,
    paddingVertical: 3,
    paddingHorizontal: 4,
  },

  copyButtonPressed: {
    opacity: 0.5,
  },

  copyText: {
    fontSize: 12,
    color: "#6B7280",
  },
});
