import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type PatientInformationProps = {
  fullName: string;
  age?: number | string | null;
  gender?: string | null;
  email?: string | null;
  relationship?: string | null;
  onEditField?: (field: string) => void;
};

type InfoRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  showDivider?: boolean;
  onPress?: () => void;
};

function InfoRow({
  icon,
  label,
  value,
  showDivider = false,
  onPress,
}: InfoRowProps) {
  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        showDivider && styles.rowDivider,
        pressed && styles.rowPressed,
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={18} color="#0AA7A8" />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>

      {onPress ? (
        <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
      ) : null}
    </Pressable>
  );
}

export default function PatientInformation({
  fullName,
  age,
  gender,
  email,
  relationship,
  onEditField,
}: PatientInformationProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>PATIENT INFORMATION</Text>
      <View style={styles.card}>
        <InfoRow
          icon="person-outline"
          label="Full Name"
          value={fullName}
          showDivider
          onPress={onEditField ? () => onEditField("name") : undefined}
        />
        <InfoRow
          icon="calendar-outline"
          label="Age"
          value={age ? `${age} years old` : "Not specified"}
          showDivider
          onPress={onEditField ? () => onEditField("age") : undefined}
        />
        <InfoRow
          icon="male-female-outline"
          label="Gender"
          value={gender || "Not specified"}
          showDivider
          onPress={onEditField ? () => onEditField("gender") : undefined}
        />
        <InfoRow
          icon="mail-outline"
          label="Email Address"
          value={email || "No email provided"}
          showDivider
          onPress={onEditField ? () => onEditField("email") : undefined}
        />
        <InfoRow
          icon="heart-outline"
          label="Relationship"
          value={relationship || "Family Member"}
          onPress={onEditField ? () => onEditField("relationship") : undefined}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#707477",
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  rowPressed: {
    backgroundColor: "#F9FAFB",
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#E6F7F7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "500",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
});
