import AnimatedCheckmark from "@/components/ui/AnimatedCheckmark";
import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import { useAuth } from "@/context/AuthContext";
import { useOnboarding } from "@/context/OnboardingContext";
import {
  codeStepSchema,
  emailStepSchema,
  nameStepSchema,
  passwordStepSchema,
} from "@/schema/auth";
import {
  register,
  resendEmailVerification,
  verifyEmail,
} from "@/services/auth";
import { capitalizeWords, formatNameInput } from "@/utils/string";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import GoogleSignInButton from "./login/GoogleSignInButton";

type Step = 1 | 2 | 3 | 4 | 5;

type RegisterFormProps = {
  onSuccess?: () => void;
};

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const { setData } = useOnboarding();

  const [step, setStep] = useState<Step>(1);

  // Form inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");

  // Loading & status states
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Field validation errors
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // Timers for Step 4 (Verification Code)
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [resendCountdown, setResendCountdown] = useState(30);

  const codeInputRef = useRef<TextInput>(null);

  // 3-second auto-redirect to login when Step 5 (Success) is reached
  useEffect(() => {
    if (step !== 5) return;

    const timer = setTimeout(() => {
      router.replace("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [step, router]);

  // Expiration timer for Step 4
  useEffect(() => {
    if (step !== 4 || timeLeft <= 0) {
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
  }, [step, timeLeft]);

  // Resend countdown timer for Step 4
  useEffect(() => {
    if (step !== 4 || resendCountdown <= 0) {
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
  }, [step, resendCountdown]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Step 1: Submit Name -> Proceed to Step 2
  const handleStep1Submit = () => {
    setGeneralError(null);
    const formattedFirst = capitalizeWords(firstName);
    const formattedLast = capitalizeWords(lastName);

    setFirstName(formattedFirst);
    setLastName(formattedLast);

    const parsed = nameStepSchema.safeParse({
      firstName: formattedFirst,
      lastName: formattedLast,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === "string" && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setStep(2);
  };

  // Step 2: Submit Email -> Proceed to Step 3
  const handleStep2Submit = () => {
    setGeneralError(null);
    setSuccessMessage(null);

    const parsed = emailStepSchema.safeParse({ email });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === "string" && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setStep(3);
  };

  // Step 3: Submit Password & Create Account -> Backend sends code to Gmail -> Proceed to Step 4
  const handleStep3Submit = async () => {
    setGeneralError(null);
    setSuccessMessage(null);

    const parsed = passwordStepSchema.safeParse({
      password,
      confirmPassword,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === "string" && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await register(firstName, lastName, email, password);

      setData((prev) => ({
        ...prev,
        email,
      }));

      setCode("");
      setTimeLeft(15 * 60);
      setResendCountdown(30);
      setStep(4);
    } catch (error: any) {
      console.log("Registration error:", error);

      const serverMessage =
        error.response?.data?.message ||
        (Array.isArray(error.response?.data?.errors)
          ? error.response.data.errors.map((e: any) => e.message).join(", ")
          : null) ||
        "Registration failed. Please check the provided information.";

      setGeneralError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Resend Code
  const handleResendCode = async () => {
    if (!email || resendCountdown > 0 || resending) {
      return;
    }

    setGeneralError(null);
    setSuccessMessage(null);
    setResending(true);

    try {
      await resendEmailVerification(email);

      setCode("");
      setTimeLeft(15 * 60);
      setResendCountdown(30);
      setSuccessMessage("A new verification code has been sent to your email.");
    } catch (error: any) {
      console.log("Resend code error:", error);
      const serverMessage =
        error.response?.data?.message ||
        "Unable to resend the verification code. Please try again.";
      setGeneralError(serverMessage);
    } finally {
      setResending(false);
    }
  };

  // Step 4: Verify Code & Complete Registration
  const handleStep4Submit = async () => {
    setGeneralError(null);
    setSuccessMessage(null);

    const parsed = codeStepSchema.safeParse({ code });

    if (!parsed.success) {
      setGeneralError(parsed.error.issues[0]?.message || "Please enter the 6-digit code.");
      return;
    }

    if (timeLeft <= 0) {
      setGeneralError("Verification code has expired. Please resend a new code.");
      return;
    }

    setLoading(true);

    try {
      await verifyEmail(email, code);

      onSuccess?.();
      setStep(5);
    } catch (error: any) {
      console.log("Verify email code error:", error);
      const serverMessage =
        error.response?.data?.message ||
        "Invalid or expired verification code. Please try again.";
      setGeneralError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGeneralError(null);
      setGoogleLoading(true);
      await loginWithGoogle();
    } catch (error: any) {
      console.log("Google Sign-In Error:", error);
      const serverMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to sign in with Google. Please try again.";

      if (
        serverMessage.includes("cancelled") ||
        serverMessage.includes("SIGN_IN_CANCELLED")
      ) {
        return;
      }
      setGeneralError(serverMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleCodeChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(numericValue);

    if (generalError) {
      setGeneralError(null);
    }
    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  const stepDescriptions = [
    "Enter your full name",
    "Enter your email address",
    "Create a secure password",
    "Enter the 6-digit code sent to your Gmail",
  ];

  return (
    <View style={styles.formContainer}>
      {/* Step Progress Indicator (only shown for steps 1-4) */}
      {step < 5 ? (
        <View style={styles.progressContainer}>
          {[
            { num: 1, label: "Name" },
            { num: 2, label: "Email" },
            { num: 3, label: "Password" },
            { num: 4, label: "Verify" },
          ].map((item, index) => {
            const isActive = step === item.num;
            const isCompleted = step > item.num;

            return (
              <View key={item.num} style={styles.stepWrapper}>
                <View style={styles.stepNodeRow}>
                  {index > 0 ? (
                    <View
                      style={[
                        styles.stepLine,
                        (isCompleted || isActive) && styles.stepLineActive,
                      ]}
                    />
                  ) : null}

                  <View
                    style={[
                      styles.stepBadge,
                      isActive && styles.stepBadgeActive,
                      isCompleted && styles.stepBadgeCompleted,
                    ]}
                  >
                    {isCompleted ? (
                      <Ionicons name="checkmark" size={14} color="#FFF" />
                    ) : (
                      <Text
                        style={[
                          styles.stepBadgeText,
                          (isActive || isCompleted) && styles.stepBadgeTextActive,
                        ]}
                      >
                        {item.num}
                      </Text>
                    )}
                  </View>

                  {index < 3 ? (
                    <View
                      style={[
                        styles.stepLine,
                        isCompleted && styles.stepLineActive,
                      ]}
                    />
                  ) : null}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    isActive && styles.stepLabelActive,
                    isCompleted && styles.stepLabelCompleted,
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            );
          })}
        </View>
      ) : null}

      {/* Navigation Header */}
      {step < 5 ? (
        <View style={styles.navigationHeader}>
          {step > 1 && step < 4 ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setGeneralError(null);
                setSuccessMessage(null);
                setErrors({});
                setStep((prev) => (prev - 1) as Step);
              }}
            >
              <Ionicons name="arrow-back" size={18} color="#4B5563" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholderBack} />
          )}

          <Text style={styles.stepHelperText}>
            {stepDescriptions[step - 1]}
          </Text>
        </View>
      ) : null}

      {/* Error & Success Messages */}
      {generalError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{generalError}</Text>
        </View>
      ) : null}

      {successMessage ? (
        <View style={styles.successBanner}>
          <Text style={styles.successBannerText}>{successMessage}</Text>
        </View>
      ) : null}

      {/* STEP 1: First Name & Last Name */}
      {step === 1 ? (
        <View>
          <Input
            placeholder="First Name"
            value={firstName}
            autoCapitalize="words"
            onChangeText={(text) => {
              setFirstName(formatNameInput(text));
              if (errors.firstName) {
                setErrors((prev) => ({ ...prev, firstName: undefined }));
              }
              if (generalError) setGeneralError(null);
            }}
            error={errors.firstName}
          />

          <View style={styles.space} />

          <Input
            placeholder="Last Name"
            value={lastName}
            autoCapitalize="words"
            onChangeText={(text) => {
              setLastName(formatNameInput(text));
              if (errors.lastName) {
                setErrors((prev) => ({ ...prev, lastName: undefined }));
              }
              if (generalError) setGeneralError(null);
            }}
            error={errors.lastName}
          />

          <View style={styles.largeSpace} />

          <Button
            title="Continue"
            onPress={handleStep1Submit}
          />

          <Divider text="Or" />

          <GoogleSignInButton
            loading={googleLoading}
            onPress={handleGoogleSignIn}
          />
        </View>
      ) : null}

      {/* STEP 2: Email */}
      {step === 2 ? (
        <View>
          <Input
            placeholder="Email Address"
            keyboardType="email-address"
            icon={require("@/assets/icons/email.png")}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: undefined }));
              }
              if (generalError) setGeneralError(null);
            }}
            error={errors.email}
          />

          <View style={styles.largeSpace} />

          <Button
            title="Continue"
            onPress={handleStep2Submit}
          />
        </View>
      ) : null}

      {/* STEP 3: Password & Confirm Password */}
      {step === 3 ? (
        <View>
          <PasswordInput
            placeholder="Password (min. 8 characters)"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: undefined }));
              }
              if (generalError) setGeneralError(null);
            }}
            error={errors.password}
          />

          <View style={styles.space} />

          <PasswordInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword) {
                setErrors((prev) => ({
                  ...prev,
                  confirmPassword: undefined,
                }));
              }
              if (generalError) setGeneralError(null);
            }}
            error={errors.confirmPassword}
          />

          <View style={styles.largeSpace} />

          <Button
            title="Send Verification Code"
            loading={loading}
            onPress={handleStep3Submit}
          />
        </View>
      ) : null}

      {/* STEP 4: Verification Code (sent through Gmail) */}
      {step === 4 ? (
        <View style={styles.centerStepContent}>
          <Text style={styles.highlightEmail}>{email}</Text>

          {/* Formal Spam / Junk Folder Advisory Notice */}
          <View style={styles.spamNoticeCard}>
            <Ionicons
              name="mail-unread-outline"
              size={18}
              color="#0AA7A8"
              style={styles.spamNoticeIcon}
            />
            <Text style={styles.spamNoticeText}>
              If you cannot locate the verification email in your inbox, please check your{" "}
              <Text style={styles.spamNoticeHighlight}>Spam</Text> or{" "}
              <Text style={styles.spamNoticeHighlight}>Junk</Text> folder.
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => codeInputRef.current?.focus()}
            style={styles.codeContainer}
          >
            <TextInput
              ref={codeInputRef}
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
                    digit ? styles.codeBoxFilled : null,
                  ]}
                >
                  <Text style={styles.codeText}>{digit || ""}</Text>
                </View>
              );
            })}
          </TouchableOpacity>

          <Text style={styles.expiryText}>
            {timeLeft > 0
              ? `Code expires in ${formatTime(timeLeft)}`
              : "Verification code expired"}
          </Text>

          <Button
            title="Verify Email"
            style={styles.verifyButton}
            loading={loading}
            disabled={code.length !== 6}
            onPress={handleStep4Submit}
          />

          <View style={styles.resendContainer}>
            <Text style={styles.resendLabel}>Didn't receive the code?</Text>
            <TouchableOpacity
              onPress={handleResendCode}
              disabled={resendCountdown > 0 || resending}
            >
              {resending ? (
                <ActivityIndicator size="small" color="#F16A66" />
              ) : (
                <Text
                  style={[
                    styles.resendText,
                    resendCountdown > 0 && styles.resendTextDisabled,
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
      ) : null}

      {/* STEP 5: Success Screen with AnimatedCheckmark */}
      {step === 5 ? (
        <View style={styles.successContainer}>
          <AnimatedCheckmark
            size={140}
            circleColor="#F16A66"
            checkColor="#FFFFFF"
            showRipple
            style={{ marginBottom: 28 }}
          />

          <Text style={styles.congratsTitle}>Congratulations!</Text>

          <Text style={styles.congratsSubtitle}>
            Your account has been{"\n"}successfully created
          </Text>

          <Text style={styles.redirectText}>Redirecting to login...</Text>
        </View>
      ) : null}

      {/* Constant Footer (only shown for steps 1-4) */}
      {step < 5 ? (
        <Pressable onPress={() => router.push("/login")}>
          <Text style={styles.footer}>
            Already have an account?
            <Text style={styles.link}> Login</Text>
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
  },

  successContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 20,
  },

  congratsTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },

  congratsSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 16,
  },

  redirectText: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    fontWeight: "500",
  },

  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },

  stepWrapper: {
    flex: 1,
    alignItems: "center",
  },

  stepNodeRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },

  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#E5E7EB",
  },

  stepLineActive: {
    backgroundColor: "#F16A66",
  },

  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },

  stepBadgeActive: {
    backgroundColor: "#F16A66",
    borderColor: "#F16A66",
  },

  stepBadgeCompleted: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },

  stepBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9CA3AF",
  },

  stepBadgeTextActive: {
    color: "#FFF",
  },

  stepLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 4,
    fontWeight: "500",
  },

  stepLabelActive: {
    color: "#F16A66",
    fontWeight: "700",
  },

  stepLabelCompleted: {
    color: "#10B981",
    fontWeight: "600",
  },

  navigationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 32,
    marginBottom: 16,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
  },

  backButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
    marginLeft: 3,
  },

  placeholderBack: {
    width: 50,
  },

  stepHelperText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "right",
    flex: 1,
  },

  highlightEmail: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F16A66",
    marginBottom: 12,
    textAlign: "center",
  },

  centerStepContent: {
    alignItems: "center",
    width: "100%",
  },

  verifyButton: {
    width: "100%",
  },

  space: {
    height: 12,
  },

  largeSpace: {
    height: 16,
  },

  codeContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginVertical: 12,
  },

  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },

  codeBox: {
    width: 44,
    height: 52,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },

  codeBoxActive: {
    borderColor: "#12A5B5",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    shadowColor: "#12A5B5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },

  codeBoxFilled: {
    borderColor: "#111",
  },

  codeText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },

  expiryText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 16,
  },

  resendContainer: {
    alignItems: "center",
    marginTop: 16,
  },

  resendLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },

  resendText: {
    fontSize: 14,
    color: "#F16A66",
    fontWeight: "700",
  },

  resendTextDisabled: {
    color: "#9CA3AF",
  },

  footer: {
    marginTop: 24,
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },

  link: {
    color: "#F16A66",
    fontWeight: "600",
  },

  errorBanner: {
    backgroundColor: "#FEE2E2",
    borderColor: "#FCA5A5",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  errorBannerText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },

  successBanner: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  successBannerText: {
    color: "#059669",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  spamNoticeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDFA",
    borderWidth: 1,
    borderColor: "#CCFBF1",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
    marginBottom: 16,
    width: "100%",
  },
  spamNoticeIcon: {
    marginRight: 8,
  },
  spamNoticeText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
    color: "#0F766E",
    fontWeight: "500",
  },
  spamNoticeHighlight: {
    fontWeight: "700",
    color: "#0E7490",
  },
});