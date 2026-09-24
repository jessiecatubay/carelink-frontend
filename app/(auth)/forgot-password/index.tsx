import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import ForgotPasswordHeader from "@/components/feature/auth/forgot-password/ForgotPasswordHeader";
import ForgotPasswordForm from "@/components/feature/auth/forgot-password/ForgotPasswordForm";
import { forgotPassword } from "@/services/auth";

export default function ForgotPasswordIndexScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSendResetLink = async (email: string) => {
    setLoading(true);
    try {
      await forgotPassword(email);

      router.push({
        pathname: "/(auth)/forgot-password/enter-reset-code-screen",
        params: { email },
      });
    } catch (err) {
      console.error("Forgot password API error:", err);
      // Fallback transition so flow is testable
      return;
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
            title="Forgot Password"
            icon={require("@/assets/icons/mail-lock.png")}
          />
          <ForgotPasswordForm
            onSubmit={handleSendResetLink}
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
