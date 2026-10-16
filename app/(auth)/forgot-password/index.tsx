import ForgotPasswordForm from "@/components/feature/auth/forgot-password/ForgotPasswordForm";
import ForgotPasswordHeader from "@/components/feature/auth/forgot-password/ForgotPasswordHeader";
import { forgotPassword } from "@/services/auth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import KeyboardAwareScrollView from "@/components/common/KeyboardAwareScrollView";
import {
  KeyboardAvoidingView,
  Platform,
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
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
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

        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          extraScrollHeight={65}
        >
          <ForgotPasswordHeader
            title="Forgot Password"
            icon={require("@/assets/icons/forgot-password.png")}
          />
          <ForgotPasswordForm
            onSubmit={handleSendResetLink}
            loading={loading}
          />
        </KeyboardAwareScrollView>
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
    paddingBottom: 80,
  },
});
