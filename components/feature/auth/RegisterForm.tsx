import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import { useOnboarding } from "@/context/OnboardingContext";
import { registerSchema, type RegisterFormValues } from "@/schema/auth";
import { register } from "@/services/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function RegisterForm() {
  const router = useRouter();
  const { setData } = useOnboarding();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterFormValues, string>>
  >({});

  const handleRegister = async () => {
    setGeneralError(null);
    const parsed = registerSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.issues.reduce<
        Partial<Record<keyof RegisterFormValues, string>>
      >((errors, issue) => {
        const field = issue.path[0];

        if (
          typeof field === "string" &&
          field in
            {
              firstName: true,
              lastName: true,
              email: true,
              password: true,
              confirmPassword: true,
            } &&
          !errors[field as keyof RegisterFormValues]
        ) {
          errors[field as keyof RegisterFormValues] = issue.message;
        }

        return errors;
      }, {});

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

      router.replace("/login");
    } catch (error: any) {
      console.log(error);
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

  return (
    <>
      {generalError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{generalError}</Text>
        </View>
      ) : null}

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
          if (generalError) {
            setGeneralError(null);
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
        icon={require("@/assets/icons/email.png")}
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

      <Button title="Register" loading={loading} onPress={handleRegister} />

      <Pressable onPress={() => router.push("/login")}>
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
