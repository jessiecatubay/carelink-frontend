import { triggerAppHaptic } from "@/context/HapticsContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

interface PatientCardProps {
  name?: string;
  internetStatus?: "CONNECTED" | "DISCONNECTED";
  onPress?: () => void;
}

export default function PatientCard({
  name,
  onPress,
  internetStatus,
}: PatientCardProps) {
  const isConnected = internetStatus === "CONNECTED";

  const handlePress = () => {
    triggerAppHaptic("light");
    onPress?.();
  };

  const getInitials = (fullName?: string) => {
    if (!fullName) return "PT";
    const parts = fullName.trim().split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (fullName.slice(0, 2) || "PT").toUpperCase();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="View connected patients"
      onPress={handlePress}
      style={({ pressed }) => [
        styles.patientCard,
        pressed && styles.patientCardPressed,
      ]}
    >
      <View style={styles.patientCardLeft}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(name)}</Text>
        </View>

        <View style={styles.patientInfo}>
          <Text style={styles.patientLabel}>ACTIVE PATIENT</Text>
          <Text style={styles.patientName} numberOfLines={1}>
            {name || "No Patient Connected"}
          </Text>

          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusBadge,
                isConnected ? styles.connectedBadge : styles.disconnectedBadge,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  isConnected ? styles.connectedDot : styles.disconnectedDot,
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  isConnected ? styles.connectedText : styles.disconnectedText,
                ]}
              >
                {isConnected ? "Live Connected" : "Device Offline"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.chevronButton}>
        <Ionicons name="chevron-forward" size={18} color="#0AA7A8" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  patientCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    ...Platform.select({
      ios: {
        shadowColor: "#0AA7A8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  patientCardPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.95,
  },
  patientCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0AA7A8",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0AA7A8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  patientInfo: {
    marginLeft: 14,
    flex: 1,
  },
  patientLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#0AA7A8",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  connectedBadge: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  disconnectedBadge: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  connectedDot: {
    backgroundColor: "#10B981",
  },
  disconnectedDot: {
    backgroundColor: "#EF4444",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  connectedText: {
    color: "#059669",
  },
  disconnectedText: {
    color: "#DC2626",
  },
  chevronButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EDFBFB",
    alignItems: "center",
    justifyContent: "center",
  },
});