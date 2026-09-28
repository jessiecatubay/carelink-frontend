import AnimatedCheckmark from "@/components/ui/AnimatedCheckmark";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

type PasswordSuccessProps = {
  onBackToLogin?: () => void;
};

export default function PasswordSuccess({ onBackToLogin }: PasswordSuccessProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onBackToLogin) {
        onBackToLogin();
      } else {
        router.replace("/login");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onBackToLogin, router]);

  return (
    <View style={styles.container}>
      <AnimatedCheckmark
        size={140}
        circleColor="#F16A66"
        checkColor="#FFFFFF"
        showRipple
        style={{ marginBottom: 28 }}
      />

      <Text style={styles.title}>Congratulations!</Text>

      <Text style={styles.subtitle}>
        Your password has been{"\n"}successfully changed
      </Text>

      <Text style={styles.redirectText}>Redirecting to login...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 16,
  },
  redirectText: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    fontWeight: "500",
  },
});
