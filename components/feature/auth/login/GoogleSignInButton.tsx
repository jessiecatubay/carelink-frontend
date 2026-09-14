import Button from "@/components/ui/Button";
import React from "react";
import { Image, StyleProp, StyleSheet, ViewStyle } from "react-native";

export type GoogleSignInButtonProps = {
  onPress?: () => void;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function GoogleSignInButton({
  onPress,
  loading = false,
  style,
}: GoogleSignInButtonProps) {
  return (
    <Button
      title="Sign In with Google"
      loading={loading}
      onPress={onPress}
      icon={
        <Image
          source={require("@/assets/icons/google.png")}
          style={styles.googleIcon}
          resizeMode="contain"
        />
      }
      style={[styles.googleButton, style]}
      textStyle={styles.googleButtonText}
    />
  );
}

const styles = StyleSheet.create({
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  googleButtonText: {
    color: "#374151",
    fontWeight: "600",
  },
});
