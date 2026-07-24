import Input from "@/components/Input";
import Logo from "@/components/Logo";
import PasswordInput from "@/components/PasswordInput";
import Button from "@/components/ui/Button";
import { registerSchema, type RegisterFormValues } from "@/schema/auth";
import { register } from "@/services/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
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
    console.log("ENV:", process.env.EXPO_PUBLIC_BACKEND_URL);
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <Logo />

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Set up your CareLink account</Text>

        <Input
          placeholder="First Name"
          value={firstName}
          onChangeText={(text) => {
            setFirstName(text);
            if (errors.firstName) {
              setErrors((prev) => ({ ...prev, firstName: undefined }));
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
              setErrors((prev) => ({ ...prev, lastName: undefined }));
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
              setErrors((prev) => ({ ...prev, email: undefined }));
            }
          }}
          error={errors.email}
        />
        <View style={styles.space} />
        <PasswordInput
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) {
              setErrors((prev) => ({ ...prev, password: undefined }));
            }
          }}
          error={errors.password}
        />
        <View style={styles.space} />
        <PasswordInput
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (errors.confirmPassword) {
              setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }
          }}
          error={errors.confirmPassword}
        />
        <View style={styles.space} />

        <Button title="Register" onPress={handleRegister} />

        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.footer}>
            Already have an account?
            <Text style={styles.link}> Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  space: {
    height: 12,
  },
  footer: {
    marginTop: 16,
    textAlign: "center",
    color: "#666",
  },
  link: {
    color: "#F16A66",
    fontWeight: "600",
  },
});
