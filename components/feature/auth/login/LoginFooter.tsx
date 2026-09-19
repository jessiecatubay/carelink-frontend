import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export type LoginFooterProps = {
  onRegisterPress?: () => void;
};

export default function LoginFooter({ onRegisterPress }: LoginFooterProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onRegisterPress) {
      onRegisterPress();
    } else {
      router.push("/register" as any);
    }
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Text style={styles.footerText}>
        Don&apos;t have an account? <Text style={styles.linkText}>Register</Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  },
  linkText: {
    color: "#F16A66",
    fontWeight: "600",
    fontSize: 14,
  },
});
