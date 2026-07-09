import Input from "@/components/Input";
import Logo from "@/components/Logo";
import PasswordInput from "@/components/PasswordInput";
import Button from "@/components/ui/Button";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RegisterScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    router.replace("/(auth)/verify-email");
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

        <Input placeholder="First Name" value={firstName} onChangeText={setFirstName} />
        <View style={styles.space} />
        <Input placeholder="Last Name" value={lastName} onChangeText={setLastName} />
        <View style={styles.space} />
        <Input placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <View style={styles.space} />
        <PasswordInput value={password} onChangeText={setPassword} />
        <View style={styles.space} />
        <PasswordInput value={confirmPassword} onChangeText={setConfirmPassword} />
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