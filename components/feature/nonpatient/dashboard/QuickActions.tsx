import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface QuickActionsProps {
  onNotificationPress?: () => void;
  onAiHelpPress?: () => void;
}

export default function QuickActions({
  onNotificationPress,
  onAiHelpPress,
}: QuickActionsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.actionsTitle}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={onNotificationPress}
        >
          <Image
            source={require("@/assets/icons/bell.png")}
            style={styles.actionIcon}
            resizeMode="contain"
          />
          <Text style={styles.actionButtonText}>Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={onAiHelpPress}
        >
          <Image
            source={require("@/assets/icons/ai.png")}
            style={styles.actionIcon}
            resizeMode="contain"
          />
          <Text style={styles.actionButtonText}>AI Help</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A202C",
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  actionButton: {
    width: "48%",
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#12A5B5",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  actionIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#12A5B5",
  },
});
