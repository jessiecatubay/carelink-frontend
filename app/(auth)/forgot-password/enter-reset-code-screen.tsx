import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ForgotPasswordHeader from "@/components/feature/auth/forgot-password/ForgotPasswordHeader";
import {
  forgotPassword,
  verifyResetCode,
} from "@/services/auth";

export default function EnterResetCodeScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    email?: string;
  }>();

  const email = params.email || "";

  const [resetCode, setResetCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleCodeChange = (text: string) => {
    const numbersOnly = text.replace(/[^0-9]/g, "");

    setResetCode(numbersOnly.slice(0, 6));

    if (error) {
      setError("");
    }

    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const handleVerifyCode = async () => {
    if (!email) {
      setError("Email is missing. Please start the process again.");
      return;
    }

    if (resetCode.length !== 6) {
      setError("Please enter the 6-digit reset code.");
      return;
    }

    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await verifyResetCode(
        email,
        resetCode
      );

      const resetToken = response.data?.resetToken;

      if (!resetToken) {
        setError("Reset token was not received.");
        return;
      }

      router.push({
        pathname: "/(auth)/forgot-password/new-password",
        params: {
          resetToken,
        },
      });
    } catch (err: any) {
      console.error("Verify reset code error:", err);

      const serverMessage =
        err?.response?.data?.message ||
        "Invalid or expired reset code.";

      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError("Email is missing. Please start the process again.");
      return;
    }

    setError("");
    setSuccessMessage("");
    setResending(true);

    try {
      await forgotPassword(email);

      setResetCode("");

      setSuccessMessage(
        "A new reset code has been sent to your email."
      );
    } catch (err: any) {
      console.error("Resend reset code error:", err);

      const serverMessage =
        err?.response?.data?.message ||
        "Unable to resend the reset code. Please try again.";

      setError(serverMessage);
    } finally {
      setResending(false);
    }
  };

  const isCodeValid = resetCode.length === 6;

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
            title="Enter Reset Code"
            icon={require("@/assets/icons/mail-sent.png")}
          />

          <View style={styles.card}>
            <Text style={styles.title}>
              Enter your reset code
            </Text>

            <Text style={styles.description}>
              We sent a 6-digit password reset code to:
            </Text>

            <Text style={styles.email}>
              {email}
            </Text>

            <TextInput
              value={resetCode}
              onChangeText={handleCodeChange}
              placeholder="000000"
              keyboardType="number-pad"
              maxLength={6}
              textAlign="center"
              editable={!loading && !resending}
              style={[
                styles.codeInput,
                error ? styles.codeInputError : undefined,
              ]}
            />

            {error ? (
              <Text style={styles.errorText}>
                {error}
              </Text>
            ) : null}

            {successMessage ? (
              <Text style={styles.successText}>
                {successMessage}
              </Text>
            ) : null}

            <Text style={styles.expiration}>
              The code expires after 15 minutes.
            </Text>

            <TouchableOpacity
              onPress={handleResendCode}
              disabled={resending || loading}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.resend,
                  (resending || loading) &&
                    styles.disabledText,
                ]}
              >
                {resending
                  ? "Sending..."
                  : "Resend Code"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleVerifyCode}
              disabled={
                !isCodeValid ||
                loading ||
                resending
              }
              activeOpacity={0.8}
              style={[
                styles.continueButton,
                (!isCodeValid ||
                  loading ||
                  resending) &&
                  styles.disabledButton,
              ]}
            >
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <Text style={styles.continueButtonText}>
                  Continue
                </Text>
              )}
            </TouchableOpacity>
          </View>
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

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginTop: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A202C",
    textAlign: "center",
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    lineHeight: 20,
  },

  email: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A202C",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 24,
  },

  codeInput: {
    height: 58,
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 12,
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: 8,
    color: "#1A202C",
  },

  codeInputError: {
    borderColor: "#E53E3E",
  },

  errorText: {
    color: "#E53E3E",
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
  },

  successText: {
    color: "#0AA7A8",
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
  },

  expiration: {
    fontSize: 12,
    color: "#718096",
    textAlign: "center",
    marginTop: 12,
  },

  resend: {
    color: "#0AA7A8",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 20,
  },

  disabledText: {
    opacity: 0.5,
  },

  continueButton: {
    backgroundColor: "#0AA7A8",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  disabledButton: {
    opacity: 0.5,
  },
});