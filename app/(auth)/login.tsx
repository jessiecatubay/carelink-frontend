import Logo from "@/components/common/Logo";
import LoginForm from "@/components/feature/auth/LoginForm";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // already authenticated — redirect based on role
      if (user?.role === "CAREGIVER") {
        router.replace("/nonpatient/dashboard/(tabs)");
        return;
      }

      router.replace("/patient/dashboard/(tabs)");
    }
  }, [isAuthenticated, loading, router, user?.role]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Logo />
          </View>

          <LoginForm />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
  },

  logoContainer: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 5,
  },
});
