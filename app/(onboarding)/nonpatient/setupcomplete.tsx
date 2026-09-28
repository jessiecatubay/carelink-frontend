import AnimatedCheckmark from "@/components/ui/AnimatedCheckmark";
import { useAuth } from "@/context/AuthContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { userOnboarding } from "@/services/auth";
import { Href, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SetupCompleteScreen() {
  const router = useRouter();
  const { data } = useOnboarding();
  const { user, updateUser } = useAuth();
  const isCompletedRef = useRef(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const finalizeOnboarding = async () => {
      if (isCompletedRef.current) return;
      isCompletedRef.current = true;

      try {
        const payload = {
          ...data,
          userId: user?.id,
        };

        const response = await userOnboarding(payload);
        const updatedUser = response?.data?.data?.user ?? response?.data?.data;

        if (updatedUser) {
          await updateUser(updatedUser);
        } else if (user) {
          await updateUser({
            ...user,
            role: "NON_PATIENT",
            onBoarded: true,
          });
        }
      } catch (error) {
        console.error("Nonpatient SetupComplete onboarding failed:", error);
        if (user) {
          await updateUser({
            ...user,
            role: "NON_PATIENT",
            onBoarded: true,
          });
        }
      } finally {
        timer = setTimeout(() => {
          router.dismissAll();
          router.replace("/nonpatient/dashboard" as Href);
        }, 3000);
      }
    };

    finalizeOnboarding();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        {/* Header Title */}
        <Text style={styles.title}>Setup Complete</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>You{"'"}re all set!</Text>

        {/* Animated Checkmark */}
        <AnimatedCheckmark
          size={140}
          circleColor="#F16A66"
          checkColor="#FFFFFF"
          showRipple
          style={{ marginBottom: 28 }}
        />

        {/* Congratulations Block */}
        <Text style={styles.congratsTitle}>Congratulations!</Text>
        <Text style={styles.congratsText}>
          CareLink is now connected{"\n"}and ready.
        </Text>

        <Text style={styles.redirectText}>Redirecting to dashboard...</Text>
      </View>
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
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#12A5B5",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 22,
    marginBottom: 28,
  },
  congratsTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#F16A66",
    textAlign: "center",
    marginBottom: 10,
  },
  congratsText: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  redirectText: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    fontWeight: "500",
  },
});

