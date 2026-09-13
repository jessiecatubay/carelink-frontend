import { StyleSheet, View } from "react-native";
import QuickPrompt from "./QuickPrompt";

type QuickPromptsProps = {
  prompts: string[];
  activePrompt?: string | null;
  onSelectPrompt: (prompt: string) => void;
};

export default function QuickPrompts({
  prompts,
  activePrompt,
  onSelectPrompt,
}: QuickPromptsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.wrapRow}>
        {prompts.map((prompt, index) => (
          <QuickPrompt
            key={index}
            label={prompt}
            selected={activePrompt === prompt}
            onPress={onSelectPrompt}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 2,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  wrapRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
