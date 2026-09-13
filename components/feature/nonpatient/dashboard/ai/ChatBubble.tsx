import { StyleSheet, Text, View } from "react-native";

type ChatBubbleProps = {
  text: string;
  isUser: boolean;
};

export default function ChatBubble({ text, isUser }: ChatBubbleProps) {
  return (
    <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
      <Text style={[styles.text, isUser ? styles.userText : styles.aiText]}>
        {text}
      </Text>
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
  },
  userText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  aiText: {
    color: "#1F2937",
    fontWeight: "400",
  },
});
