import { resendEmailVerification, verifyEmail } from "@/services/auth";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

export default function VerifyEmailScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    email?: string;
  }>();

  const email = typeof params.email === "string" ? params.email : "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [resendCountdown, setResendCountdown] = useState(30);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (resendCountdown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendCountdown((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCountdown]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleCodeChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");

    setCode(numericValue);

    if (error) {
      setError(null);
    }

    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  const handleVerify = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!email) {
      setError("Email address is missing. Please register again.");
      return;
    }

    if (code.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    if (timeLeft <= 0) {
      setError(
        "Your verification code has expired. Please request a new code.",
      );
      return;
    }

    setLoading(true);

    try {
      await verifyEmail(email, code);

      setSuccessMessage("Email verified successfully.");

      setTimeout(() => {
        router.replace("/login");
      }, 1000);
    } catch (error: any) {
      console.log("Verify email error:", error);

      const serverMessage =
        error.response?.data?.message ||
        "Unable to verify your email. Please try again.";

      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Email address is missing. Please register again.");
      return;
    }

    if (resendCountdown > 0 || resending) {
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setResending(true);

    try {
      await resendEmailVerification(email);

      setCode("");
      setTimeLeft(15 * 60);
      setResendCountdown(30);

      setSuccessMessage(
        "A new verification code has been sent to your email.",
      );
    } catch (error: any) {
      console.log("Resend verification error:", error);

      const serverMessage =
        error.response?.data?.message ||
        "Unable to resend the verification code.";

      setError(serverMessage);
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#222"
            />
          </TouchableOpacity>

          <View style={styles.container}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="mail-outline"
                size={42}
                color="#0AA7A8"
              />
            </View>

            <Text style={styles.title}>Verify your email</Text>

            <Text style={styles.description}>
              We've sent a 6-digit verification code to
            </Text>

            <Text style={styles.email}>{email}</Text>

            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {successMessage ? (
              <View style={styles.successBanner}>
                <Text style={styles.successText}>
                  {successMessage}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => inputRef.current?.focus()}
              style={styles.codeContainer}
            >
              <TextInput
                ref={inputRef}
                value={code}
                onChangeText={handleCodeChange}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
                style={styles.hiddenInput}
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
              />

              {Array.from({ length: 6 }).map((_, index) => {
                const digit = code[index];
                const isActive = index === code.length;

                return (
                  <View
                    key={index}
                    style={[
                      styles.codeBox,
                      isActive && styles.codeBoxActive,
                    ]}
                  >
                    <Text style={styles.codeText}>
                      {digit || ""}
                    </Text>
                  </View>
                );
              })}
            </TouchableOpacity>

            <Text style={styles.expiryText}>
              {timeLeft > 0
                ? `Code expires in ${formatTime(timeLeft)}`
                : "Verification code expired"}
            </Text>

            <TouchableOpacity
              style={[
                styles.verifyButton,
                (loading || code.length !== 6) &&
                  styles.verifyButtonDisabled,
              ]}
              onPress={handleVerify}
              disabled={loading || code.length !== 6}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.verifyButtonText}>
                  Verify Email
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              <Text style={styles.resendLabel}>
                Didn't receive the code?
              </Text>

              <TouchableOpacity
                onPress={handleResend}
                disabled={resendCountdown > 0 || resending}
              >
                {resending ? (
                  <ActivityIndicator
                    size="small"
                    color="#0AA7A8"
                  />
                ) : (
                  <Text
                    style={[
                      styles.resendText,
                      resendCountdown > 0 &&
                        styles.resendTextDisabled,
                    ]}
                  >
                    {resendCountdown > 0
                      ? `Resend Code (${resendCountdown}s)`
                      : "Resend Code"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 8,
  },

  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
  },

  iconContainer: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#EAF9F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },

  email: {
    fontSize: 15,
    color: "#0AA7A8",
    fontWeight: "700",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 24,
  },

  errorBanner: {
    width: "100%",
    backgroundColor: "#FEE2E2",
    borderColor: "#FCA5A5",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  errorText: {
    color: "#DC2626",
    fontSize: 14,
    textAlign: "center",
  },

  successBanner: {
    width: "100%",
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  successText: {
    color: "#059669",
    fontSize: 14,
    textAlign: "center",
  },

  codeContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },

  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },

  codeBox: {
    width: 46,
    height: 56,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  codeBoxActive: {
    borderColor: "#0AA7A8",
    borderWidth: 2,
  },

  codeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
  },

  expiryText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 16,
    marginBottom: 24,
  },

  verifyButton: {
    width: "100%",
    height: 52,
    backgroundColor: "#0AA7A8",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  verifyButtonDisabled: {
    opacity: 0.5,
  },

  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  resendContainer: {
    alignItems: "center",
    marginTop: 24,
  },

  resendLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },

  resendText: {
    fontSize: 14,
    color: "#0AA7A8",
    fontWeight: "700",
  },

  resendTextDisabled: {
    color: "#9CA3AF",
  },
});