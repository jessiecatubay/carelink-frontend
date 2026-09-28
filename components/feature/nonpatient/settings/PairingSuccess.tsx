import AnimatedCheckmark from "@/components/ui/AnimatedCheckmark";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

type PairingSuccessProps = {
  onContinue: () => void;
  title?: string;
  message?: string;
};

export default function PairingSuccess({
  onContinue,
  title = "Pairing Successful!",
  message = "Patient device has been linked to your account.",
}: PairingSuccessProps) {
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

      <Text style={styles.congratsTitle}>{title}</Text>
      <Text style={styles.congratsText}>{message}</Text>

      <Text style={styles.redirectText}>Redirecting to dashboard...</Text>
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
    backgroundColor: "#FFFFFF",
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
