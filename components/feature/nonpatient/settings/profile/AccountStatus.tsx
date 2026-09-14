import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AccountInfoItem from "./AccountInfoItem";

export type AccountStatusProps = {
  isEmailVerified?: boolean;
  emailVerificationText?: string;
  accountStatusText?: string;
  isActive?: boolean;
  onEmailVerificationPress?: () => void;
  onAccountStatusPress?: () => void;
};

export default function AccountStatus({
  isEmailVerified = true,
  emailVerificationText = "Verified",
  accountStatusText = "Active",
  isActive = true,
  onEmailVerificationPress,
  onAccountStatusPress,
}: AccountStatusProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>ACCOUNT STATUS</Text>
      <View style={styles.card}>
        <AccountInfoItem
          icon="shield-checkmark"
          label="Email Verification"
          value={emailVerificationText}
          showDivider
          onPress={onEmailVerificationPress}
          trailing={
            <Ionicons
              name={isEmailVerified ? "checkmark-circle" : "close-circle"}
              size={22}
              color={isEmailVerified ? "#0AA7A8" : "#9CA3AF"}
            />
          }
        />
        <AccountInfoItem
          icon="ellipse"
          label="Account Status"
          value={accountStatusText}
          onPress={onAccountStatusPress}
          trailing={
            <View
              style={[
                styles.statusDot,
                isActive ? styles.statusDotActive : styles.statusDotInactive,
              ]}
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#707477",
    letterSpacing: 0.5,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusDotActive: {
    backgroundColor: "#0AA7A8",
  },
  statusDotInactive: {
    backgroundColor: "#9CA3AF",
  },
});
