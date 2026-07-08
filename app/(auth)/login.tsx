import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import axiosInstance from "@/lib/axios";

export default function LoginScreen() {
  const router = useRouter();

  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const textColor = isDark ? "#fff" : "#000";
  const subTextColor = isDark ? "#aaa" : "#555";

  const handleLogin = async () => {
    const formData = new FormData();

    formData.append("email", email); 
    formData.append("password", password); 

    try {
      const result = await axiosInstance.post("/api/user/v1/login", formData);
      console.log(result.data);
    } catch (error) {
      console.error(error)
    }
    // backend login later
    router.push("/(auth)/login");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View>

        <Text style={{ color: textColor }}>
          Welcome Back
        </Text>

        <Text style={{ color: subTextColor }}>
          Login to continue
        </Text>


        <View>

          <TextInput
            placeholder="Email"
            placeholderTextColor={subTextColor}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />


          <TextInput
            placeholder="Password"
            placeholderTextColor={subTextColor}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />


          <TouchableOpacity onPress={handleLogin}>
            <Text style={{ color: textColor }}>
              Login
            </Text>
          </TouchableOpacity>


          <TouchableOpacity
            onPress={() => router.push("/signup")}
          >
            <Text style={{ color: subTextColor }}>
              Don't have an account? Sign Up
            </Text>
          </TouchableOpacity>


        </View>

      </View>
    </KeyboardAvoidingView>
  );
}