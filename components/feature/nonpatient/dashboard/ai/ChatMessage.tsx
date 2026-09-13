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
};

export default function ChatMessage({ message }: ChatMessageProps) {
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
      <ChatBubble text={message.text} isUser={isUser} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "flex-end",
    paddingHorizontal: 16,
  },
  userRow: {
    justifyContent: "flex-end",
  },
  aiRow: {
    justifyContent: "flex-start",
  },
  avatarWrap: {
    marginRight: 10,
    marginBottom: 2,
  },
});
