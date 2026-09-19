import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type PasswordRequirementsProps = {
  password: string;
  confirmPassword?: string;
};

export default function PasswordRequirements({
  password,
  confirmPassword,
}: PasswordRequirementsProps) {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isMatching =
    confirmPassword !== undefined &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const requirements = [
    { label: "At least 8 characters long", met: hasMinLength },
    { label: "At least one uppercase letter (A-Z)", met: hasUppercase },
    { label: "At least one number (0-9)", met: hasNumber },
  ];

  if (confirmPassword !== undefined && confirmPassword.length > 0) {
    requirements.push({
      label: "Passwords match",
      met: isMatching,
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password Requirements</Text>
      <View style={styles.list}>
        {requirements.map((req, index) => (
          <View key={index} style={styles.item}>
            <Ionicons
              name={req.met ? "checkmark-circle" : "ellipse-outline"}
              size={16}
              color={req.met ? "#0AA7A8" : "#9CA3AF"}
              style={styles.icon}
            />
            <Text style={[styles.text, req.met && styles.textMet]}>
              {req.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  list: {
    gap: 6,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 13,
    color: "#64748B",
  },
  textMet: {
    color: "#0F766E",
    fontWeight: "600",
  },
});
