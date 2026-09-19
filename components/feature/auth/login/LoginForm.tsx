import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import { useAuth } from "@/context/AuthContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { loginSchema, type LoginFormValues } from "@/schema/auth";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ForgotPasswordLink from "./ForgotPasswordLink";
import GoogleSignInButton from "./GoogleSignInButton";
import LoginFooter from "./LoginFooter";
import RememberMe from "./RememberMe";

export default function LoginForm() {
  const { signIn } = useAuth();
  const { setData } = useOnboarding();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormValues, string>>
  >({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleLogin = async () => {
    setGeneralError(null);
    const parsed = loginSchema.safeParse({
      email,
      password,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.issues.reduce<
        Partial<Record<keyof LoginFormValues, string>>
      >((errs, issue) => {
        const field = issue.path[0];
        if ((field === "email" || field === "password") && !errs[field]) {
          errs[field] = issue.message;
        }
        return errs;
      }, {});

      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await signIn({ email, password, rememberMe });
      setData((prev) => ({
        ...prev,
        email,
      }));
    } catch (error: any) {
      console.log(error);
      const serverMessage =
        error.response?.data?.message ||
        (Array.isArray(error.response?.data?.errors)
          ? error.response.data.errors.map((e: any) => e.message).join(", ")
          : null) ||
        "Invalid email or password. Please check your credentials.";
      setGeneralError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {generalError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{generalError}</Text>
        </View>
      ) : null}

      <Input
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (errors.email) {
            setErrors((prev) => ({ ...prev, email: undefined }));
          }
          if (generalError) {
            setGeneralError(null);
          }
        }}
        error={errors.email}
      />

      <View style={styles.spacing} />

      <PasswordInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errors.password) {
            setErrors((prev) => ({ ...prev, password: undefined }));
          }
          if (generalError) {
            setGeneralError(null);
          }
        }}
        error={errors.password}
      />

      <View style={styles.rowBetween}>
        <RememberMe
          checked={rememberMe}
          onToggle={() => setRememberMe(!rememberMe)}
        />
        <ForgotPasswordLink />
      </View>

      <View style={styles.spacing} />

      <Button title="Login" loading={loading} onPress={handleLogin} />

      <Divider text="Or" />

      <GoogleSignInButton />

      <LoginFooter />
    </>
  );
}

const styles = StyleSheet.create({
  spacing: {
    height: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
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
    fontFamily: "Inter-Medium",
    textAlign: "center",
  },
});
