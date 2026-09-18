import Button from "@/components/ui/Button";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/schema/auth";
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
  onSubmit: (values: ChangePasswordFormValues) => Promise<void> | void;
  loading?: boolean;
  serverError?: string | null;
};

export default function ChangePasswordForm({
  onSubmit,
  loading = false,
  serverError = null,
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
    await onSubmit({
      currentPassword,
      newPassword,
      confirmPassword,
    });
  };

  const activeError = serverError || formError;

  return (
    <View style={styles.container}>
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

      <View style={styles.card}>
        {/* Current Password Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Current Password</Text>
          <View
            style={[
              styles.inputRow,
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
              onChangeText={(text) => {
                setCurrentPassword(text);
                if (errors.currentPassword) {
                  setErrors((prev) => ({ ...prev, currentPassword: undefined }));
                }
                if (formError) setFormError(null);
              }}
            />
            <Pressable
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
            <Text style={styles.fieldErrorText}>{errors.currentPassword}</Text>
          ) : null}
        </View>

        {/* New Password Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>New Password</Text>
          <View
            style={[
              styles.inputRow,
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
              onChangeText={(text) => {
                setNewPassword(text);
                if (errors.newPassword) {
                  setErrors((prev) => ({ ...prev, newPassword: undefined }));
                }
                if (formError) setFormError(null);
              }}
            />
            <Pressable
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
            <Text style={styles.fieldErrorText}>{errors.newPassword}</Text>
          ) : null}
        </View>

        {/* Confirm New Password Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Confirm New Password</Text>
          <View
            style={[
              styles.inputRow,
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
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) {
                  setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }
                if (formError) setFormError(null);
              }}
            />
            <Pressable
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
            <Text style={styles.fieldErrorText}>{errors.confirmPassword}</Text>
          ) : null}
        </View>

        {/* Password Requirements Checklist */}
        <PasswordRequirements
          password={newPassword}
          confirmPassword={confirmPassword}
        />

        {/* 6-Month Cooldown Note */}
        <View style={styles.securityNote}>
          <Ionicons
            name="information-circle"
            size={18}
            color="#0AA7A8"
            style={styles.noteIcon}
          />
          <Text style={styles.noteText}>
            <Text style={styles.noteBold}>Important Note: </Text>
            Once you change your password, you will need to wait 6 months before you can change it again.
          </Text>
        </View>
      </View>

      <Button
        title="Update Password"
        onPress={handleSubmit}
        loading={loading}
        style={styles.submitButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 2,
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
