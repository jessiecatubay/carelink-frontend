import { triggerAppHaptic } from "@/context/HapticsContext";
import React from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface QuickActionsProps {
  onNotificationPress?: () => void;
  onAiHelpPress?: () => void;
}

export default function QuickActions({
  onNotificationPress,
  onAiHelpPress,
}: QuickActionsProps) {
  const handleNotification = () => {
    triggerAppHaptic("light");
    onNotificationPress?.();
  };

  const handleAiHelp = () => {
    triggerAppHaptic("light");
    onAiHelpPress?.();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.actionsTitle}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.notificationButton]}
          activeOpacity={0.8}
          onPress={handleNotification}
        >
          <View style={styles.iconCircleTeal}>
            <Image
              source={require("@/assets/icons/bell.png")}
              style={[styles.actionIcon, { tintColor: "#0D9488" }]}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.notificationButtonText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.aiButton]}
          activeOpacity={0.8}
          onPress={handleAiHelp}
        >
          <View style={styles.iconCirclePurple}>
            <Image
              source={require("@/assets/icons/ai.png")}
              style={[styles.actionIcon, { tintColor: "#7C3AED" }]}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.aiButtonText}>AI Care Help</Text>
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
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderWidth: 1.5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  notificationButton: {
    backgroundColor: "#F0FDFA",
    borderColor: "#99F6E4",
  },
  aiButton: {
    backgroundColor: "#FAF5FF",
    borderColor: "#DDD6FE",
  },
  iconCircleTeal: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#CCFBF1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  iconCirclePurple: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  actionIcon: {
    width: 18,
    height: 18,
  },
  notificationButtonText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F766E",
  },
  aiButtonText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#6D28D9",
  },
});
