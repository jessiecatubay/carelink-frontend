import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Platform,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

export type SettingsToggleProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  customIcon?: ImageSourcePropType;
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (nextValue: boolean) => void;
  disabled?: boolean;
};

export default function SettingsToggle({
  icon,
  customIcon,
  title,
  subtitle,
  value,
  onValueChange,
  disabled = false,
}: SettingsToggleProps) {
  return (
    <View style={styles.row}>
      {customIcon ? (
        <Image
          source={customIcon}
          style={styles.customRowIcon}
          resizeMode="contain"
        />
      ) : icon ? (
        <Ionicons
          name={icon}
          size={21}
          color="#0AA7A8"
          style={styles.rowIcon}
        />
      ) : null}

      <View style={styles.rowCopy}>
        <Text style={[styles.rowTitle, disabled && styles.disabledText]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.rowSubtitle, disabled && styles.disabledText]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <Switch
        accessibilityRole="switch"
        accessibilityLabel={title}
        disabled={disabled}
        ios_backgroundColor="#D7DDDE"
        onValueChange={onValueChange}
        thumbColor={Platform.OS === "android" ? (value ? "#0AA7A8" : "#FFFFFF") : "#FFFFFF"}
        trackColor={{ false: "#D7DDDE", true: "#0AA7A8" }}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    borderBottomColor: "#E2E8F0",
    borderBottomWidth: 1,
    flexDirection: "row",
    minHeight: 52,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  rowIcon: {
    marginRight: 14,
    textAlign: "center",
    width: 24,
  },
  customRowIcon: {
    width: 22,
    height: 22,
    marginRight: 14,
    tintColor: "#0AA7A8",
  },
  rowCopy: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 10,
    marginRight: 12,
  },
  rowTitle: {
    color: "#1E293B",
    fontSize: 15,
    fontWeight: "500",
  },
  rowSubtitle: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  disabledText: {
    color: "#94A3B8",
  },
});
