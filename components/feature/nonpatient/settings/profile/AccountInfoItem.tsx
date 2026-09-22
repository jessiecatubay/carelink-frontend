import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export type AccountInfoItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  trailing?: React.ReactNode;
  showChevron?: boolean;
  showDivider?: boolean;
  onPress?: () => void;
  editable?: boolean;
  onChangeText?: (value: string) => void;
};

export default function AccountInfoItem({
  icon,
  label,
  value = "",
  trailing,
  showChevron = true,
  showDivider = false,
  onPress,
  editable = false,
  onChangeText,
}: AccountInfoItemProps) {
  const content = (
    <View style={[styles.container, showDivider && styles.divider]}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={22} color="#0AA7A8" />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>

        {editable ? (
          <TextInput
            value={value}
            onChangeText={onChangeText}
            editable
            style={styles.input}
            placeholder={`Enter ${label.toLowerCase()}`}
            placeholderTextColor="#A0A5A8"
            autoCapitalize="words"
          />
        ) : (
          <Text
            style={[
              styles.value,
              !value && styles.emptyValue,
            ]}
            numberOfLines={1}
          >
            {value || "Not provided"}
          </Text>
        )}
      </View>

      <View style={styles.trailingContainer}>
        {trailing ??
          (showChevron && !editable ? (
            <Ionicons
              name="chevron-forward"
              size={18}
              color="#9CA3AF"
            />
          ) : null)}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F5",
  },
  iconContainer: {
    width: 32,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E242B",
    marginBottom: 2,
  },
  value: {
    fontSize: 13,
    color: "#707477",
    fontWeight: "400",
  },
  emptyValue: {
    color: "#A0A5A8",
  },
  input: {
    fontSize: 13,
    color: "#707477",
    fontWeight: "400",
    padding: 0,
    margin: 0,
    minHeight: 20,
  },
  trailingContainer: {
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: "#F9FAFB",
  },
});