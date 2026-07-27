import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import { registerSchema, type RegisterFormValues } from "@/schema/auth";
import { register } from "@/services/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function RegisterForm() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterFormValues, string>>
  >({});

  const handleRegister = async () => {
    const parsed = registerSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      setErrors({
        firstName: fieldErrors.firstName?.[0],
        lastName: fieldErrors.lastName?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });

      return;
    }

    setErrors({});

    try {
      await register(firstName, lastName, email, password);

      router.replace("/(auth)/verify-email");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Input
        placeholder="First Name"
        value={firstName}
        onChangeText={(text) => {
          setFirstName(text);

          if (errors.firstName) {
            setErrors((prev) => ({
              ...prev,
              firstName: undefined,
            }));
          }
        }}
        error={errors.firstName}
      />

      <View style={styles.space} />

      <Input
        placeholder="Last Name"
        value={lastName}
        onChangeText={(text) => {
          setLastName(text);

          if (errors.lastName) {
            setErrors((prev) => ({
              ...prev,
              lastName: undefined,
            }));
          }
        }}
        error={errors.lastName}
      />

      <View style={styles.space} />

      <Input
        placeholder="Email"
        keyboardType="email-address"
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
        error={errors.email}
      />

      <View style={styles.space} />

      <PasswordInput
        placeholder="Password"
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
        }}
        error={errors.confirmPassword}
      />

      <View style={styles.space} />

      <Button
        title="Register"
        onPress={handleRegister}
      />

      <Pressable
        onPress={() => router.push("/(auth)/login")}
      >
        <Text style={styles.footer}>
          Already have an account?
          <Text style={styles.link}> Login</Text>
        </Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  space: {
    height: 12,
  },

  footer: {
    marginTop: 20,
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },

  link: {
    color: "#F16A66",
    fontWeight: "600",
  },
});