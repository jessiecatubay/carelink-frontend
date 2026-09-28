import Button from "@/components/ui/Button";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/schema/auth";
import { type PasswordPolicyResult } from "@/services/passwordPolicy";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
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

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

      <View style={[styles.card, isLocked && styles.cardDisabled]}>
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, isLocked && styles.labelDisabled]}>
            Current Password
          </Text>

          <View
            style={[
              styles.inputRow,
              isLocked && styles.inputRowDisabled,
              errors.currentPassword ? styles.inputRowError : null,
            ]}
          >
            <Image
              source={require("@/assets/icons/padlock.png")}
              style={styles.padlockIcon}
              resizeMode="contain"
            />

            <TextInput
              style={styles.textInput}
              placeholder="Enter current password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showCurrentPassword}
              value={currentPassword}
              editable={!isLocked}
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

            <Pressable
              disabled={isLocked}
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              hitSlop={10}
            >
              <Image
                source={
                  showCurrentPassword
                    ? require("@/assets/icons/view.png")
                    : require("@/assets/icons/hide.png")
                }
                style={styles.eyeIcon}
                resizeMode="contain"
              />
            </Pressable>
          </View>

          {errors.currentPassword ? (
            <Text style={styles.fieldErrorText}>
              {errors.currentPassword}
            </Text>
          ) : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, isLocked && styles.labelDisabled]}>
            New Password
          </Text>

          <View
            style={[
              styles.inputRow,
              isLocked && styles.inputRowDisabled,
              errors.newPassword ? styles.inputRowError : null,
            ]}
          >
            <Image
              source={require("@/assets/icons/padlock.png")}
              style={styles.padlockIcon}
              resizeMode="contain"
            />

            <TextInput
              style={styles.textInput}
              placeholder="Enter new password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showNewPassword}
              value={newPassword}
              editable={!isLocked}
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

            <Pressable
              disabled={isLocked}
              onPress={() => setShowNewPassword(!showNewPassword)}
              hitSlop={10}
            >
              <Image
                source={
                  showNewPassword
                    ? require("@/assets/icons/view.png")
                    : require("@/assets/icons/hide.png")
                }
                style={styles.eyeIcon}
                resizeMode="contain"
              />
            </Pressable>
          </View>

          {errors.newPassword ? (
            <Text style={styles.fieldErrorText}>
              {errors.newPassword}
            </Text>
          ) : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, isLocked && styles.labelDisabled]}>
            Confirm New Password
          </Text>

          <View
            style={[
              styles.inputRow,
              isLocked && styles.inputRowDisabled,
              errors.confirmPassword ? styles.inputRowError : null,
            ]}
          >
            <Image
              source={require("@/assets/icons/padlock.png")}
              style={styles.padlockIcon}
              resizeMode="contain"
            />

            <TextInput
              style={styles.textInput}
              placeholder="Re-enter new password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              editable={!isLocked}
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

            <Pressable
              disabled={isLocked}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              hitSlop={10}
            >
              <Image
                source={
                  showConfirmPassword
                    ? require("@/assets/icons/view.png")
                    : require("@/assets/icons/hide.png")
                }
                style={styles.eyeIcon}
                resizeMode="contain"
              />
            </Pressable>
          </View>

          {errors.confirmPassword ? (
            <Text style={styles.fieldErrorText}>
              {errors.confirmPassword}
            </Text>
          ) : null}
        </View>

        <PasswordRequirements
          password={newPassword}
          confirmPassword={confirmPassword}
        />
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

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 18,
    marginBottom: 20,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  cardDisabled: {
    backgroundColor: "#F9FAFB",
    opacity: 0.85,
  },

  fieldGroup: {
    gap: 6,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 2,
  },

  labelDisabled: {
    color: "#9CA3AF",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
  },

  inputRowDisabled: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },

  inputRowError: {
    borderColor: "#F16A66",
  },

  padlockIcon: {
    width: 18,
    height: 18,
    tintColor: "#9CA3AF",
    marginRight: 10,
  },

  eyeIcon: {
    width: 20,
    height: 20,
    tintColor: "#9CA3AF",
    marginLeft: 10,
  },

  textInput: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
    height: "100%",
  },

  fieldErrorText: {
    color: "#F16A66",
    fontSize: 12,
    marginLeft: 4,
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