import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function WelcomeActions() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        activeOpacity={0.85}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Register Button */}
      <TouchableOpacity
        style={styles.registerButton}
        activeOpacity={0.85}
        onPress={() => router.push("/register")}
      >
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>

      {/* Version Text */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  loginButton: {
    backgroundColor: "#F16A66",
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#F16A66",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  registerButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#F16A66",
    borderWidth: 1.5,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  registerButtonText: {
    color: "#F16A66",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  versionContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 2,
  },
  versionText: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
});
