import axiosInstance from "@/lib/axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    const formData = new FormData();

    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("password", password);

    try {
      const result = await axiosInstance.post(
        "/api/user/v1/signup",
        formData
      );

      console.log(result.data);

      router.replace("/(auth)/login");
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
        <Image
          source={require("@/assets/images/logo.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Create Account</Text>

        <Text style={styles.subtitle}>
          Set up your CareLink account
        </Text>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#888"
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#888"
          value={lastName}
          onChangeText={setLastName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignUp}
        >
          <Text style={styles.buttonText}>
            Register
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.footer}>
            Already have an account?
            <Text style={styles.login}> Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const PRIMARY = "#F16A66";
const TEAL = "#14A3A5";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },

  content: {
    paddingHorizontal: 24,
  },

  logo: {
    width: 240,
    height: 110,
    alignSelf: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 38,
    fontWeight: "700",
    color: TEAL,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 17,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 28,
  },

  input: {
    height: 55,
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D7D7D7",
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

  button: {
    height: 55,
    backgroundColor: PRIMARY,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,

    shadowColor: PRIMARY,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },

  footer: {
    marginTop: 22,
    textAlign: "center",
    color: "#666",
    fontSize: 16,
  },

  login: {
    color: PRIMARY,
    fontWeight: "600",
  },
});