import { extractPhilippineMobileDigits, formatPhilippinePhoneNumber } from "@/utils/phone";
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
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad" | "number-pad" | "decimal-pad";
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
  keyboardType,
  onChangeText,
}: AccountInfoItemProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const isPhone = label.toLowerCase().includes("phone");

  const getPhoneDisplayValue = () => {
    const raw = extractPhilippineMobileDigits(value);
    if (!raw) return "";
    let formatted = raw.slice(0, 3);
    if (raw.length > 3) formatted += " " + raw.slice(3, 6);
    if (raw.length > 6) formatted += " " + raw.slice(6, 10);
    return formatted;
  };

  const content = (
    <View style={[styles.container, showDivider && styles.divider]}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={22} color={isFocused ? "#12A5B5" : "#0AA7A8"} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>

        {editable ? (
          isPhone ? (
            <View style={[styles.phoneEditRow, isFocused && styles.editBoxFocused]}>
              <View style={styles.phonePrefixBadge}>
                <Text style={styles.phonePrefixText}>+63</Text>
              </View>
              <TextInput
                value={getPhoneDisplayValue()}
                onChangeText={(text) => {
                  const digits = extractPhilippineMobileDigits(text);
                  onChangeText?.(digits ? formatPhilippinePhoneNumber(digits) : "");
                }}
                editable
                keyboardType="phone-pad"
                style={styles.phoneInput}
                placeholder="900 000 0000"
                placeholderTextColor="#A0A5A8"
                maxLength={12}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </View>
          ) : (
            <TextInput
              value={value}
              onChangeText={onChangeText}
              editable
              keyboardType={keyboardType || "default"}
              style={[styles.input, isFocused && styles.inputFocused]}
              placeholder={`Enter ${label.toLowerCase()}`}
              placeholderTextColor="#A0A5A8"
              autoCapitalize={label.toLowerCase().includes("email") ? "none" : "words"}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          )
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
    fontSize: 14,
    color: "#1E242B",
    fontWeight: "500",
    paddingVertical: 6,
    paddingHorizontal: 10,
    margin: 0,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    marginTop: 2,
  },
  inputFocused: {
    borderColor: "#12A5B5",
    backgroundColor: "#FFFFFF",
    shadowColor: "#12A5B5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  phoneEditRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  editBoxFocused: {
    borderColor: "#12A5B5",
    backgroundColor: "#FFFFFF",
    shadowColor: "#12A5B5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  phonePrefixBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    gap: 4,
  },
  phonePrefixText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E293B",
  },
  phoneInput: {
    flex: 1,
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "500",
    padding: 0,
    margin: 0,
    minHeight: 22,
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