import { Pressable, StyleSheet, Text } from "react-native";

type QuickPromptProps = {
  label: string;
  selected?: boolean;
  onPress: (label: string) => void;
};

export default function QuickPrompt({
  label,
  selected = false,
  onPress,
}: QuickPromptProps) {
  return (
    <Pressable
      onPress={() => onPress(label)}
      style={[
        styles.pill,
        selected ? styles.selectedPill : styles.defaultPill,
      ]}
    >
      <Text
        style={[
          styles.text,
          selected ? styles.selectedText : styles.defaultText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  defaultPill: {
    backgroundColor: "#DFFBFA",
    borderColor: "#B7F4F1",
  },
  selectedPill: {
    backgroundColor: "#08A8A8",
    borderColor: "#08A8A8",
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
  },
  defaultText: {
    color: "#08A8A8",
  },
  selectedText: {
    color: "#FFFFFF",
  },
});
