import { useLocalSearchParams, useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CheckEmailCard from "@/components/feature/auth/forgot-password/CheckEmailCard";
import ForgotPasswordHeader from "@/components/feature/auth/forgot-password/ForgotPasswordHeader";
import { resendVerification } from "@/services/auth";

export default function CheckEmailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email || "escartinjameboy@gmail.com";

  const handleResend = async () => {
    try {
      await resendVerification();
    } catch (err) {
      console.error("Resend verification error:", err);
    }
  };

  const handleProceedToReset = () => {
    router.push({
      pathname: "/(auth)/forgot-password/new-password",
      params: { email },
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ForgotPasswordHeader
            title="Check Your Email"
            icon={require("@/assets/icons/mail-sent.png")}
          />
          <CheckEmailCard
            email={email}
            onResend={handleResend}
            onProceedToReset={handleProceedToReset}
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
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
    justifyContent: "center",
  },
});
