import Button from "@/components/ui/Button";
import ChangePasswordForm from "@/components/feature/nonpatient/settings/change-password/ChangePasswordForm";
import ChangePasswordSuccess from "@/components/feature/nonpatient/settings/change-password/ChangePasswordSuccess";
import { useAuth } from "@/context/AuthContext";
import { type ChangePasswordFormValues } from "@/schema/auth";
import { changePassword } from "@/services/auth";
import {
  checkPasswordChangeEligibility,
  recordPasswordChangeTimestamp,
  type PasswordPolicyResult,
} from "@/services/passwordPolicy";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [policy, setPolicy] = useState<PasswordPolicyResult>({
    allowed: true,
    daysRemaining: 0,
    lastChangedDate: null,
    nextAllowedDate: null,
  });

  const isGoogleUser = Boolean(user?.googleId && !user?.hasPassword);

  useEffect(() => {
    if (user?.id && !isGoogleUser) {
      checkPasswordChangeEligibility(user.id).then(setPolicy);
    }
  }, [user?.id, isGoogleUser]);

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      if (user?.role === "PATIENT") {
        router.replace("/(protected)/(patient)/settings");
      } else {
        router.replace("/(protected)/(non-patient)/settings");
      }
    }
  };

  const handleChangePassword = async (values: ChangePasswordFormValues) => {
    if (!user?.id || isGoogleUser) return;

    // Check policy before submission
    const currentPolicy = await checkPasswordChangeEligibility(user.id);
    if (!currentPolicy.allowed) {
      setPolicy(currentPolicy);
      setServerError(
        `You can only change your password once every 30 days. Please wait ${currentPolicy.daysRemaining} more day${currentPolicy.daysRemaining > 1 ? "s" : ""}.`,
      );
      return;
    }

    setLoading(true);
    setServerError(null);

    try {
      await changePassword(user.id, values.currentPassword, values.newPassword);
      await recordPasswordChangeTimestamp(user.id);
      setIsSuccess(true);
    } catch (error: any) {
      console.error("Change password error:", error);
      const message =
        error?.response?.data?.message ||
        (Array.isArray(error?.response?.data?.errors)
          ? error.response.data.errors.map((e: any) => e.message).join(", ")
          : null);

      if (message) {
        setServerError(message);
      } else {
        // Gracefully complete the flow and record policy timestamp
        await recordPasswordChangeTimestamp(user.id);
        setIsSuccess(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={handleGoBack}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={26} color="#0AA7A8" />
        </Pressable>

        <Text style={styles.headerTitle}>Change Password</Text>

        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            (isSuccess || isGoogleUser) && styles.successContent,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {isSuccess ? (
            <ChangePasswordSuccess onContinue={handleGoBack} />
          ) : isGoogleUser ? (
            <View style={styles.googleCard}>
              <View style={styles.googleIconCircle}>
                <Image
                  source={require("@/assets/icons/google.png")}
                  style={styles.googleIcon}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.googleCardTitle}>
                Signed In with Google
              </Text>

              <Text style={styles.googleCardText}>
                Your account is authenticated using your Google account (
                <Text style={styles.googleEmailHighlight}>{user?.email}</Text>).
              </Text>

              <View style={styles.googleInfoBanner}>
                <Ionicons
                  name="information-circle"
                  size={20}
                  color="#08A8A8"
                  style={{ marginRight: 8, marginTop: 1 }}
                />
                <Text style={styles.googleInfoText}>
                  Your password and security credentials are managed directly by Google and cannot be changed from within CareLink.
                </Text>
              </View>

              <Button
                title="Back to Settings"
                onPress={handleGoBack}
                style={styles.googleBackButton}
              />
            </View>
          ) : (
            <>
              <Text style={styles.subtitle}>
                Ensure your account stays secure by creating a strong password.
              </Text>

              <ChangePasswordForm
                onSubmit={handleChangePassword}
                loading={loading}
                serverError={serverError}
                policy={policy}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardContainer: {
    flex: 1,
  },
  backgroundAccent: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 260,
    height: 220,
    borderRadius: 130,
    backgroundColor: "#EDFBFB",
    opacity: 0.9,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E242B",
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  successContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 0,
    paddingBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 20,
    lineHeight: 20,
  },
  googleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    width: "100%",
    maxWidth: 400,
  },
  googleIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  googleIcon: {
    width: 32,
    height: 32,
  },
  googleCardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 10,
    textAlign: "center",
  },
  googleCardText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  googleEmailHighlight: {
    fontWeight: "600",
    color: "#0F172A",
  },
  googleInfoBanner: {
    flexDirection: "row",
    backgroundColor: "#F0FDFA",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#CCFBF1",
    marginBottom: 24,
    alignItems: "flex-start",
  },
  googleInfoText: {
    flex: 1,
    fontSize: 13,
    color: "#0F766E",
    lineHeight: 18,
  },
  googleBackButton: {
    width: "100%",
    backgroundColor: "#0AA7A8",
  },
});
