import React from "react";
import {
  ActivityIndicator,
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

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
    <TouchableOpacity
      style={[styles.googleButton, style, loading && styles.disabledButton]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={loading}
    >
      {loading ? (
        <View style={styles.content}>
          <ActivityIndicator
            size="small"
            color="#12A5B5"
            style={styles.spinner}
          />
          <Text style={styles.googleButtonText}>Connecting to Google...</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <Image
            source={require("@/assets/icons/google.png")}
            style={styles.googleIcon}
            resizeMode="contain"
          />
          <Text style={styles.googleButtonText}>Sign In with Google</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.2,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  disabledButton: {
    opacity: 0.8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    marginRight: 10,
  },
  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  googleButtonText: {
    color: "#374151",
    fontSize: 15,
    fontWeight: "600",
  },
});
