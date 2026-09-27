import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

export type EditProfileButtonProps = {
  isEditing?: boolean;
  onPress?: () => void;
  onCancel?: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function EditProfileButton({
  isEditing = false,
  onPress,
  onCancel,
  loading = false,
  disabled = false,
  style,
}: EditProfileButtonProps) {
  return (
    <View style={[styles.container, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isEditing ? "Save Changes" : "Edit Profile"}
        onPress={onPress}
        disabled={disabled || loading}
        style={({ pressed }) => [
          styles.button,
          disabled && styles.disabled,
          pressed && styles.pressed,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <>
            <Ionicons
              name={isEditing ? "checkmark-circle-outline" : "pencil-outline"}
              size={19}
              color="#FFFFFF"
              style={styles.icon}
            />
            <Text style={styles.text}>
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Text>
          </>
        )}
      </Pressable>

      {isEditing && !loading && onCancel && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cancel editing"
          onPress={onCancel}
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && styles.cancelPressed,
          ]}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  button: {
    height: 52,
    backgroundColor: "#0AA7A8",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    shadowColor: "#0AA7A8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  cancelButton: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  cancelPressed: {
    backgroundColor: "#F3F4F6",
  },
  cancelText: {
    color: "#64748B",
    fontSize: 15,
    fontWeight: "600",
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
