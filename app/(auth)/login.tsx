import Input from "@/components/Input";
import Logo from "@/components/Logo";
import PasswordInput from "@/components/PasswordInput";
import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";
import axiosInstance from "@/lib/axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const result = await axiosInstance.post("/api/user/v1/login", formData);
      
      console.log(result.data);

      router.replace("/(protected)/(tabs)/explore");
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

        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <View style={styles.spacing} />

        <PasswordInput value={password} onChangeText={setPassword} />

        <View style={styles.rowBetween}>
          <Pressable style={styles.checkboxRow}>
            <View style={styles.checkbox} />
            <Text style={styles.checkboxText}>Remember me</Text>
          </Pressable>

          <Text style={styles.linkText}>Forgot Password?</Text>
        </View>

        <View style={styles.spacing} />

        <Button title="Login" onPress={handleLogin} />

        <Divider text="Or" />

        <Button title="Sign In with Google" />

        <Pressable onPress={() => router.push("/(auth)/signup")}>
          <Text style={styles.footerText}>
            Don&apos;t have an account? <Text style={styles.linkText}>Register</Text>
          </Text>
        </Pressable>
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
  checkboxText: {
    color: "#666",
    fontSize: 14,
  },
  linkText: {
    color: "#F16A66",
    fontSize: 14,
    fontWeight: "600",
  },
  footerText: {
    marginTop: 16,
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },
});