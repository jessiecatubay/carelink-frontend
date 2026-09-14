import Checkbox from "@/components/ui/Checkbox";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export type RememberMeProps = {
  checked: boolean;
  onToggle: () => void;
};

export default function RememberMe({ checked, onToggle }: RememberMeProps) {
  return (
    <Pressable style={styles.container} onPress={onToggle}>
      <Checkbox checked={checked} onPress={onToggle} />
      <Text style={styles.text}>Remember me</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "#666",
    fontSize: 14,
    marginLeft: 8,
  },
});
