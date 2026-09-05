import React from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PatientCardProps {
  name?: string;
  status?: string;
  avatar?: any;
}

export default function PatientCard({
  name,
  status,
  avatar,
}: PatientCardProps) {
  return (
    <View style={styles.patientCard}>
      <View style={styles.patientCardLeft}>
        <Image
          source={avatar}
          style={styles.avatar}
        />
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>Patient: {name}</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status:</Text>
            <Text style={styles.statusValue}>{status}</Text>
            <View style={styles.statusDot} />
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#718096" />
    </View>
  );
}

const styles = StyleSheet.create({
  patientCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#A0AEC0",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  patientCardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E2E8F0",
  },
  patientInfo: {
    marginLeft: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A202C",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statusLabel: {
    fontSize: 14,
    color: "#718096",
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#48BB78",
    marginLeft: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#48BB78",
    marginLeft: 6,
  },
});
