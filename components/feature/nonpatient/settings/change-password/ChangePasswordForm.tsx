import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/schema/auth";
import { type PasswordPolicyResult } from "@/services/passwordPolicy";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import PasswordRequirements from "./PasswordRequirements";

type ChangePasswordFormProps = {
  onSubmit?: (values: ChangePasswordFormValues) => Promise<void> | void;
  loading?: boolean;
  serverError?: string | null;
  policy?: PasswordPolicyResult;
};

export default function ChangePasswordForm({
  onSubmit,
  loading = false,
  serverError = null,
  policy,
}: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<
    Partial<Record<keyof ChangePasswordFormValues, string>>
  >({});
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setFormError(null);

    const parsed = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!parsed.success) {
      const fieldErrors: Partial<
        Record<keyof ChangePasswordFormValues, string>
      > = {};

      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ChangePasswordFormValues;

        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      if (onSubmit) {
        await onSubmit({
          currentPassword,
          newPassword,
          confirmPassword,
        });
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to change password. Please try again.";

      setFormError(message);
    }
  };

  const isLocked = policy && !policy.allowed;
  const activeError = serverError || formError;

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      {/* 30-Day Cooldown / Policy Locked Banner */}
      {isLocked ? (
        <View style={styles.policyLockedBanner}>
          <View style={styles.policyIconCircle}>
            <Ionicons name="lock-closed" size={20} color="#D97706" />
          </View>
          <View style={styles.policyContent}>
            <Text style={styles.policyTitle}>
              Password Change Locked (30-Day Policy)
            </Text>
            <Text style={styles.policyText}>
              You recently changed your password on{" "}
              <Text style={styles.policyBold}>
                {formatDate(policy.lastChangedDate)}
              </Text>
              . For your account security, you can change your password again on{" "}
              <Text style={styles.policyBold}>
                {formatDate(policy.nextAllowedDate)}
              </Text>{" "}
              (in <Text style={styles.policyBold}>{policy.daysRemaining} day{policy.daysRemaining > 1 ? "s" : ""}</Text>).
            </Text>
          </View>
        </View>
      ) : null}

      {activeError ? (
        <View style={styles.errorBanner}>
          <Ionicons
            name="alert-circle"
            size={18}
            color="#DC2626"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.errorBannerText}>{activeError}</Text>
        </View>
      ) : null}

      <View style={styles.fieldsContainer}>
        {/* Current Password Field */}
        <Text style={[styles.inputLabel, isLocked && styles.labelDisabled]}>
          Current Password
        </Text>
        <PasswordInput
          placeholder="Enter current password"
          value={currentPassword}
          editable={!isLocked}
          error={errors.currentPassword}
          onChangeText={(text) => {
            setCurrentPassword(text);
            if (errors.currentPassword) {
              setErrors((prev) => ({
                ...prev,
                currentPassword: undefined,
              }));
            }
            if (formError) {
              setFormError(null);
            }
          }}
        />

        {/* New Password Field */}
        <Text style={[styles.inputLabel, isLocked && styles.labelDisabled]}>
          New Password
        </Text>
        <PasswordInput
          placeholder="Enter new password"
          value={newPassword}
          editable={!isLocked}
          error={errors.newPassword}
          onChangeText={(text) => {
            setNewPassword(text);
            if (errors.newPassword) {
              setErrors((prev) => ({
                ...prev,
                newPassword: undefined,
              }));
            }
            if (formError) {
              setFormError(null);
            }
          }}
        />

        {/* Confirm New Password Field */}
        <Text style={[styles.inputLabel, isLocked && styles.labelDisabled]}>
          Confirm New Password
        </Text>
        <PasswordInput
          placeholder="Re-enter new password"
          value={confirmPassword}
          editable={!isLocked}
          error={errors.confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (errors.confirmPassword) {
              setErrors((prev) => ({
                ...prev,
                confirmPassword: undefined,
              }));
            }
            if (formError) {
              setFormError(null);
            }
          }}
        />

        <View style={styles.requirementsWrapper}>
          <PasswordRequirements
            password={newPassword}
            confirmPassword={confirmPassword}
          />
        </View>
      </View>

      <Button
        title={isLocked ? `Locked (${policy?.daysRemaining}d remaining)` : "Update Password"}
        onPress={handleSubmit}
        loading={loading}
        disabled={Boolean(isLocked) || loading}
        style={[styles.submitButton, isLocked && styles.submitButtonDisabled]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  policyLockedBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    gap: 12,
  },

  policyIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },

  policyContent: {
    flex: 1,
  },

  policyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 4,
  },

  policyText: {
    fontSize: 13,
    color: "#B45309",
    lineHeight: 18,
  },

  policyBold: {
    fontWeight: "700",
    color: "#78350F",
  },

  fieldsContainer: {
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 6,
    marginTop: 10,
  },

  labelDisabled: {
    color: "#9CA3AF",
  },

  requirementsWrapper: {
    marginTop: 16,
  },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    borderColor: "#FCA5A5",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },

  errorBannerText: {
    flex: 1,
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "500",
  },

  submitButton: {
    width: "100%",
    backgroundColor: "#0AA7A8",
  },

  submitButtonDisabled: {
    backgroundColor: "#94A3B8",
    opacity: 0.7,
  },

  securityNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F0FDFA",
    borderColor: "#CCFBF1",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },

  noteIcon: {
    marginRight: 8,
    marginTop: 1,
  },

  noteText: {
    flex: 1,
    fontSize: 12,
    color: "#0F766E",
    lineHeight: 18,
  },

  noteBold: {
    fontWeight: "700",
    color: "#115E59",
  },
});