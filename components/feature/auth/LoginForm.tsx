import { useAuth } from "@/context/AuthContext";
import { loginSchema, type LoginFormValues } from "@/schema/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import { useOnboarding } from "@/context/OnboardingContext";

export default function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormValues, string>>
  >({});
  const { setData } = useOnboarding();

  const handleLogin = async () => {
    const parsed = loginSchema.safeParse({
      email,
      password,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.issues.reduce<
        Partial<Record<keyof LoginFormValues, string>>
      >((errors, issue) => {
        const field = issue.path[0];

        if ((field === "email" || field === "password") && !errors[field]) {
          errors[field] = issue.message;
        }

        return errors;
      }, {});

      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      await signIn({ email, password, rememberMe });
      setData((prev) => ({
        ...prev,
        email,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Input
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (errors.email) {
            setErrors((prev) => ({ ...prev, email: undefined }));
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
        }}
        error={errors.password}
      />

      <View style={styles.rowBetween}>
        <Pressable
          style={styles.checkboxRow}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View
            style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
          />

          <Text style={styles.checkboxText}>Remember me</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/(auth)/forgot-password" as any)}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </Pressable>
      </View>

      <View style={styles.spacing} />

      <Button title="Login" onPress={handleLogin} />

      <Divider text="Or" />

      <Button
        title="Sign In with Google"
        icon={
          <Image
            source={require("@/assets/icons/google.png")}
            style={styles.googleIcon}
            resizeMode="contain"
          />
        }
        style={styles.googleButton}
        textStyle={styles.googleButtonText}
      />

      <Pressable onPress={() => router.push("/register")}>
        <Text style={styles.footerText}>
          Don&apos;t have an account?{" "}
          <Text style={styles.linkText}>Register</Text>
        </Text>
      </Pressable>
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

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#F16A66",
    borderRadius: 3,
    marginRight: 8,
  },

  checkboxChecked: {
    backgroundColor: "#F16A66",
  },

  checkboxText: {
    color: "#666",
    fontSize: 14,
  },

  linkText: {
    color: "#F16A66",
    fontWeight: "600",
    fontSize: 14,
  },

  googleButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },

  googleButtonText: {
    color: "#374151",
    fontWeight: "600",
  },

  footerText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
    fontSize: 14,
  },
});
