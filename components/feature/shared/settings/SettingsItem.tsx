import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export type SettingsItemProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  customIcon?: ImageSourcePropType;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
  destructive?: boolean;
  disabled?: boolean;
};

export default function SettingsItem({
  icon,
  customIcon,
  title,
  subtitle,
  onPress,
  trailing,
  destructive = false,
  disabled = false,
}: SettingsItemProps) {
  const isPressable = Boolean(onPress) && !disabled;

  return (
    <Pressable
      accessibilityRole={isPressable ? "button" : undefined}
      disabled={!isPressable}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && isPressable && styles.rowPressed,
      ]}
    >
      {customIcon ? (
        <Image
          source={customIcon}
          style={[styles.customRowIcon, destructive && { tintColor: "#FF615D" }]}
          resizeMode="contain"
        />
      ) : icon ? (
        <Ionicons
          name={icon}
          size={21}
          color={destructive ? "#FF615D" : "#0AA7A8"}
          style={styles.rowIcon}
        />
      ) : null}

      <View style={styles.rowCopy}>
        <Text
          style={[
            styles.rowTitle,
            destructive && styles.destructiveText,
            disabled && styles.disabledText,
          ]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.rowSubtitle, disabled && styles.disabledText]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {trailing ?? (
        <Ionicons name="chevron-forward" size={19} color="#94A3B8" />
      )}
    </Pressable>
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
  rowPressed: {
    backgroundColor: "#F8FAFC",
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
  destructiveText: {
    color: "#FF615D",
    fontWeight: "600",
  },
  disabledText: {
    color: "#94A3B8",
  },
});
