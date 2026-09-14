import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export type ForgotPasswordLinkProps = {
  onPress?: () => void;
};

export default function ForgotPasswordLink({ onPress }: ForgotPasswordLinkProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push("/(auth)/forgot-password" as any);
    }
  };

  return (
    <Pressable onPress={handlePress} hitSlop={8}>
      <Text style={styles.linkText}>Forgot Password?</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  linkText: {
    color: "#F16A66",
    fontWeight: "600",
    fontSize: 14,
  },
});
