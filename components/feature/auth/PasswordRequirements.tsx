import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type PasswordRequirementsProps = {
  password: string;
  confirmPassword?: string;
  showConfirmMatch?: boolean;
};

export default function PasswordRequirements({
  password,
  confirmPassword,
  showConfirmMatch = true,
}: PasswordRequirementsProps) {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const hasConfirm =
    confirmPassword !== undefined && confirmPassword.length > 0;
  const isMatching = hasConfirm && password === confirmPassword;

  const rules = [
    {
      id: "length",
      label: "At least 8 characters long",
      met: hasMinLength,
    },
    {
      id: "uppercase",
      label: "At least one uppercase letter (A-Z)",
      met: hasUppercase,
    },
    {
      id: "lowercase",
      label: "At least one lowercase letter (a-z)",
      met: hasLowercase,
    },
    {
      id: "number",
      label: "At least one number (0-9)",
      met: hasNumber,
    },
  ];

  if (showConfirmMatch && confirmPassword !== undefined) {
    rules.push({
      id: "match",
      label: hasConfirm
        ? isMatching
          ? "Passwords match"
          : "Passwords do not match"
        : "Passwords match",
      met: isMatching,
    });
  }

  const baseRules = rules.filter((r) => r.id !== "match");
  const metCount = baseRules.filter((r) => r.met).length;
  const totalBase = baseRules.length;
  const allBaseMet = metCount === totalBase;
  const allFullyMet =
    allBaseMet && (confirmPassword === undefined || isMatching);

  // Strength calculation based on met criteria
  const getStrengthMeta = () => {
    if (!password) {
      return { label: "", color: "#E2E8F0", percent: 0 };
    }
    if (metCount <= 1) {
      return { label: "Weak", color: "#EF4444", percent: 25 };
    }
    if (metCount === 2) {
      return { label: "Fair", color: "#F59E0B", percent: 50 };
    }
    if (metCount === 3) {
      return { label: "Good", color: "#0284C7", percent: 75 };
    }
    return { label: "Strong", color: "#0AA7A8", percent: 100 };
  };

  const strength = getStrengthMeta();

  return (
    <View
      style={[
        styles.container,
        allFullyMet ? styles.containerAllMet : null,
      ]}
    >
      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons
            name={allFullyMet ? "shield-checkmark" : "shield-outline"}
            size={16}
            color={allFullyMet ? "#0AA7A8" : "#64748B"}
            style={styles.headerIcon}
          />
          <Text
            style={[
              styles.title,
              allFullyMet ? styles.titleAllMet : null,
            ]}
          >
            Password Requirements
          </Text>
        </View>

        <View
          style={[
            styles.badge,
            allFullyMet ? styles.badgeAllMet : styles.badgeDefault,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              allFullyMet ? styles.badgeTextAllMet : styles.badgeTextDefault,
            ]}
          >
            {allFullyMet ? "All met ✓" : `${metCount}/${totalBase} met`}
          </Text>
        </View>
      </View>

      {/* Real-time Strength Meter Bar */}
      {Boolean(password) && (
        <View style={styles.strengthSection}>
          <View style={styles.strengthBarBackground}>
            <View
              style={[
                styles.strengthBarFill,
                {
                  width: `${strength.percent}%`,
                  backgroundColor: strength.color,
                },
              ]}
            />
          </View>
          <Text style={[styles.strengthLabel, { color: strength.color }]}>
            {strength.label}
          </Text>
        </View>
      )}

      {/* Requirements Checklist */}
      <View style={styles.list}>
        {rules.map((rule) => {
          const isMatchRule = rule.id === "match";
          const isErrorMatch = isMatchRule && hasConfirm && !isMatching;

          return (
            <View key={rule.id} style={styles.item}>
              <Ionicons
                name={
                  rule.met
                    ? "checkmark-circle"
                    : isErrorMatch
                      ? "close-circle"
                      : "ellipse-outline"
                }
                size={16}
                color={
                  rule.met
                    ? "#0AA7A8"
                    : isErrorMatch
                      ? "#EF4444"
                      : "#94A3B8"
                }
                style={styles.icon}
              />
              <Text
                style={[
                  styles.text,
                  rule.met ? styles.textMet : null,
                  isErrorMatch ? styles.textError : null,
                ]}
              >
                {rule.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    marginTop: 6,
  },
  containerAllMet: {
    backgroundColor: "#F0FDFA",
    borderColor: "#99F6E4",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginRight: 6,
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  titleAllMet: {
    color: "#0F766E",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeDefault: {
    backgroundColor: "#E2E8F0",
  },
  badgeAllMet: {
    backgroundColor: "#CCFBF1",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  badgeTextDefault: {
    color: "#475569",
  },
  badgeTextAllMet: {
    color: "#0F766E",
  },
  strengthSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  strengthBarBackground: {
    flex: 1,
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    overflow: "hidden",
  },
  strengthBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: "700",
    minWidth: 42,
    textAlign: "right",
  },
  list: {
    gap: 7,
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
  textError: {
    color: "#DC2626",
    fontWeight: "600",
  },
});
