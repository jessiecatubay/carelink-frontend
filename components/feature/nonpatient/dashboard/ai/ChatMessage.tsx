import { StyleSheet, View } from "react-native";
import AIIcon from "./AIIcon";
import ChatBubble from "./ChatBubble";

export type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp?: string;
};

type ChatMessageProps = {
  message: Message;
  isCopyable: boolean;
};

export default function ChatMessage({ message, isCopyable }: ChatMessageProps) {
  const isUser = message.sender === "user";

  return (
    <View
      style={[
        styles.row,
        isUser ? styles.userRow : styles.aiRow,
      ]}
    >
      {!isUser && (
        <View style={styles.avatarWrap}>
          <AIIcon size={44} />
        </View>
      )}
      <ChatBubble text={message.text} isUser={isUser} isCopyable={isCopyable} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginBottom: 16,
    paddingHorizontal: 16,
    width: "100%",
  },
  aiRow: {
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  userRow: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  avatarWrap: {
    width: 44,
    height: 44,
    marginRight: 10,
    marginBottom: 2,
    flexShrink: 0,
  },
});
