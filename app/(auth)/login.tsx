import Logo from "@/components/common/Logo";
import LoginForm from "@/components/feature/auth/LoginForm";

import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";

export default function Login() {
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
    marginTop: 50, // Adjust to your preference (20–40)
    marginBottom: 5,
  },
});