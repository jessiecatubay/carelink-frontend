import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ForgotPasswordHeader from "@/components/feature/auth/forgot-password/ForgotPasswordHeader";
import NewPasswordForm from "@/components/feature/auth/forgot-password/NewPasswordForm";
import { resetPassword } from "@/services/auth";

export default function NewPasswordScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    resetToken?: string;
  }>();

  const resetToken = params.resetToken || "";

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleResetPassword = async (password: string) => {
    if (!resetToken) {
      setErrorMessage("Reset token is missing or expired.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await resetPassword(resetToken, password);

      router.push("/(auth)/forgot-password/success");
    } catch (err: any) {
      console.error("Reset password error:", err);

      const serverMessage =
        err?.response?.data?.message ||
        "Unable to reset your password. Please try again.";

      setErrorMessage(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ForgotPasswordHeader
            title="Create New Password"
            icon={require("@/assets/icons/password-lock.png")}
          />

          <NewPasswordForm
            onSubmit={handleResetPassword}
            loading={loading}
          />
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
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
    justifyContent: "center",
  },
});