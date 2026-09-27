import AnimatedCheckmark from "@/components/ui/AnimatedCheckmark";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

type ChangePasswordSuccessProps = {
  onContinue: () => void;
};

export default function ChangePasswordSuccess({
  onContinue,
}: ChangePasswordSuccessProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <View style={styles.container}>
      <AnimatedCheckmark
        size={140}
        circleColor="#F16A66"
        checkColor="#FFFFFF"
        showRipple
        style={{ marginBottom: 28 }}
      />

      <Text style={styles.congratsTitle}>Congratulations!</Text>
      <Text style={styles.congratsText}>
        Your password has been{"\n"}successfully updated.
      </Text>

      <Text style={styles.redirectText}>Redirecting to settings...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
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

