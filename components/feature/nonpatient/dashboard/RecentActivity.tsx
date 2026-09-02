import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface RecentActivityProps {
  emptyText?: string;
}

export default function RecentActivity({
  emptyText = "No recent activity today",
}: RecentActivityProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.recentActivityTitle}>Recent Activity</Text>
      <View style={styles.emptyActivityCard}>
        <Ionicons name="chatbox-ellipses-outline" size={32} color="#A0AEC0" />
        <Text style={styles.emptyActivityText}>{emptyText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  recentActivityTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A202C",
    marginBottom: 12,
  },
  emptyActivityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EDF2F7",
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyActivityText: {
    marginTop: 8,
    fontSize: 14,
    color: "#A0AEC0",
    fontWeight: "500",
  },
});
