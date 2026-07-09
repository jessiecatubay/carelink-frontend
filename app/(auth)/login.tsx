import axiosInstance from "@/lib/axios";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  const handleLogin = async () => {
    try {
      const formData = new FormData();

      formData.append("email", email);
      formData.append("password", password);

      await axiosInstance.post("/api/user/v1/login", formData);

      router.replace("/(protected)/(tabs)/explore");
    } catch (err) {
      console.log(err);
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

        {/* Email */}

        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={20}
            color="#999"
            style={styles.icon}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password */}

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="lock-outline"
            size={20}
            color="#999"
            style={styles.icon}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={hidePassword}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            onPress={() => setHidePassword(!hidePassword)}
          >
            <Ionicons
              name={hidePassword ? "eye-outline" : "eye-off-outline"}
              size={22}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.forgotContainer}
        >
          <Text style={styles.forgot}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Remember */}

        <View style={styles.rememberRow}>
          <Ionicons
            name="checkbox"
            size={22}
            color="#F16A66"
          />

          <Text style={styles.remember}>
            Remember me
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Login */}

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginText}>
            Login
          </Text>
        </TouchableOpacity>

        {/* Divider */}

        <View style={styles.orRow}>
          <View style={styles.line} />
          <Text style={styles.or}>Or</Text>
          <View style={styles.line} />
        </View>

        {/* Google */}

        <TouchableOpacity style={styles.googleButton}>
          <Ionicons
            name="logo-google"
            size={20}
            color="#EA4335"
          />

          <Text style={styles.googleText}>
            Sign In with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.register}>
            Don't have an account?
            <Text style={{ color: "#F16A66" }}>
              {" "}Register
            </Text>
          </Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

const PRIMARY = "#F16A66";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },

  content: {
    paddingHorizontal: 30,
  },

  logo: {
    width: 240,
    height: 120,
    alignSelf: "center",
    marginBottom: 30,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 18,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

  icon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    height: 55,
    fontSize: 16,
  },

  forgotContainer: {
    alignItems: "flex-end",
    marginBottom: 18,
  },

  forgot: {
    color: PRIMARY,
    fontSize: 15,
  },

  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  remember: {
    marginLeft: 8,
    color: "#666",
    fontSize: 15,
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    marginBottom: 30,
  },

  loginButton: {
    backgroundColor: PRIMARY,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 25,

    shadowColor: PRIMARY,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  loginText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 18,
  },

  orRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#DDD",
  },

  or: {
    marginHorizontal: 12,
    color: "#999",
    fontSize: 15,
  },

  googleButton: {
    height: 54,
    backgroundColor: PRIMARY,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 25,
  },

  googleText: {
    color: "#FFF",
    fontWeight: "600",
    marginLeft: 10,
    fontSize: 16,
  },

  register: {
    textAlign: "center",
    color: "#666",
    fontSize: 15,
  },
});