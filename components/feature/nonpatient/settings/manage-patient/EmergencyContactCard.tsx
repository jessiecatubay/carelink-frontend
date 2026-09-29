import SlideToCall911 from "@/components/ui/SlideToCall911";
import { triggerAppHaptic } from "@/context/HapticsContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Linking, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type EmergencyContactCardProps = {
  contactName?: string | null;
  phoneNumber?: string | null;
  relationship?: string | null;
  onCallPress?: () => void;
  onManagePress?: () => void;
};

export default function EmergencyContactCard({
  contactName,
  phoneNumber,
  relationship = "Primary Contact",
  onCallPress,
  onManagePress,
}: EmergencyContactCardProps) {
  const router = useRouter();

  const handleCall = () => {
    triggerAppHaptic("light");
    if (onCallPress) {
      onCallPress();
      return;
    }

    if (phoneNumber) {
      const cleanPhone = phoneNumber.replace(/[^0-9+]/g, "");
      Linking.openURL(`tel:${cleanPhone}`).catch((err) =>
        console.error("Failed to make phone call:", err),
      );
    }
  };

  const handleManage = () => {
    if (onManagePress) {
      onManagePress();
    } else {
      router.push("/(protected)/emergency-contacts");
    }
  };

  const displayName = contactName || "Emergency Contact";
  const displayPhone = phoneNumber || "Not provided";

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>EMERGENCY SERVICES</Text>

      {/* Slide to Call 911 */}
      <SlideToCall911 />

      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>
          PRIMARY EMERGENCY CONTACT
        </Text>
        <TouchableOpacity onPress={handleManage} activeOpacity={0.7}>
          <Text style={styles.manageLinkText}>Manage All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.left}>
          <View style={styles.iconCircle}>
            <Ionicons name="call" size={18} color="#FF615D" />
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.relationship}>{relationship}</Text>
            <Text style={styles.phone}>{displayPhone}</Text>
          </View>
        </View>

        {phoneNumber ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Call emergency contact"
            onPress={handleCall}
            style={({ pressed }) => [
              styles.callButton,
              pressed && styles.callButtonPressed,
            ]}
          >
            <Ionicons name="call" size={18} color="#FFFFFF" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 8,
  },
  manageLinkText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0AA7A8",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#707477",
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E242B",
  },
  relationship: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 1,
  },
  phone: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "600",
    marginTop: 3,
  },
  callButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#0AA7A8",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    shadowColor: "#0AA7A8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  callButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
});
