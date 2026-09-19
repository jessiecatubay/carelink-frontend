import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ManagePatientHeaderProps = {
  title?: string;
  onBack: () => void;
  rightAction?: React.ReactNode;
};

export default function ManagePatientHeader({
  title = "Manage Patient",
  onBack,
  rightAction,
}: ManagePatientHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={12}
        onPress={onBack}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={26} color="#0AA7A8" />
      </Pressable>

      <Text style={styles.headerTitle}>{title}</Text>

      <View style={styles.rightContainer}>{rightAction ?? <View style={styles.spacer} />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E242B",
    textAlign: "center",
  },
  rightContainer: {
    width: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  spacer: {
    width: 40,
  },
});
