import ForgotPasswordForm from "@/components/feature/auth/forgot-password/ForgotPasswordForm";
import ForgotPasswordHeader from "@/components/feature/auth/forgot-password/ForgotPasswordHeader";
import { forgotPassword } from "@/services/auth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordIndexScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSendResetLink = async (email: string) => {
    setLoading(true);
    try {
      await forgotPassword(email);

      router.push({
        pathname: "/(auth)/forgot-password/enter-reset-code-screen",
        params: { email },
      });
    } catch (err) {
      console.error("Forgot password API error:", err);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
        style={styles.container}
      >
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/login");
              }
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets={true}
        >
          <ForgotPasswordHeader
            title="Forgot Password"
            icon={require("@/assets/icons/forgot-password.png")}
          />
          <ForgotPasswordForm
            onSubmit={handleSendResetLink}
            loading={loading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  headerBar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 48,
  },
});
