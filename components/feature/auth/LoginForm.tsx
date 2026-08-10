import { useAuth } from "@/context/AuthContext";
import { loginSchema, type LoginFormValues } from "@/schema/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
      const fieldErrors = parsed.error.flatten().fieldErrors;

      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });

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
        value={email}
        onChangeText={(text) => {
          setEmail(text);

          if (errors.email) {
            setErrors((prev) => ({
              ...prev,
              email: undefined,
            }));
          }
        }}
        keyboardType="email-address"
        error={errors.email}
      />

      <View style={styles.spacing} />

      <PasswordInput
        value={password}
        onChangeText={(text) => {
          setPassword(text);

          if (errors.password) {
            setErrors((prev) => ({
              ...prev,
              password: undefined,
            }));
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

        <Pressable>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </Pressable>
      </View>

      <View style={styles.spacing} />

      <Button title="Login" onPress={handleLogin} />

      <Divider text="Or" />

      <Button title="Sign In with Google" />

      <Pressable onPress={() => router.push("/signup")}>
        <Text style={styles.footerText}>
          Don't have an account? <Text style={styles.linkText}>Register</Text>
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

  footerText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
    fontSize: 14,
  },
});
