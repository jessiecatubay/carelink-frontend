import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface NoteBoxProps {
  text?: string;
  boldPrefix?: string;
  children?: React.ReactNode;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function NoteBox({
  text,
  boldPrefix,
  children,
  icon = "bulb-outline",
  iconColor = "#D97706",
  style,
  textStyle,
}: NoteBoxProps) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name={icon} size={18} color={iconColor} style={styles.icon} />
      <Text style={[styles.text, textStyle]}>
        {boldPrefix ? <Text style={styles.boldText}>{boldPrefix}</Text> : null}
        {text ? text : children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
    padding: 12,
  },
  icon: {
    marginRight: 8,
    marginTop: 1,
  },
  text: {
    flex: 1,
    fontSize: 12.5,
    color: "#92400E",
    lineHeight: 18,
    fontWeight: "500",
  },
  boldText: {
    fontWeight: "700",
    color: "#92400E",
  },
});
