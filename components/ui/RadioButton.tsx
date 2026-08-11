import React from "react";
import { StyleSheet, View } from "react-native";

type RadioButtonProps = {
  selected: boolean;
  selectedColor?: string;
  size?: number;
};

export default function RadioButton({
  selected,
  selectedColor = "#12A5B5",
  size = 16,
}: RadioButtonProps) {
  return (
    <View
      style={[
        styles.outer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: selected ? selectedColor : "#CCCCCC",
          backgroundColor: selected ? selectedColor : "#FFFFFF",
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  outer: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
