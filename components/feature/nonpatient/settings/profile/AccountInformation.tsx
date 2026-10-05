import { extractPhilippineMobileDigits, formatPhilippinePhoneNumber } from "@/utils/phone";
import { capitalizeWords } from "@/utils/string";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import PhoneInput from "@/components/ui/PhoneInput";
import AccountInfoItem from "./AccountInfoItem";

export type AccountInformationProps = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  editable?: boolean;
  onFirstNameChange?: (value: string) => void;
  onLastNameChange?: (value: string) => void;
  onPhoneNumberChange?: (value: string) => void;
};

export default function AccountInformation({
  firstName = "",
  lastName = "",
  email = "",
  phoneNumber = "",
  editable = false,
  onFirstNameChange,
  onLastNameChange,
  onPhoneNumberChange,
}: AccountInformationProps) {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  if (editable) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>ACCOUNT INFORMATION</Text>

        <View style={styles.editCard}>
          {/* First Name */}
          <Text style={styles.inputLabel}>First Name</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === "firstName" && styles.inputFocused,
            ]}
            placeholder="Enter first name"
            placeholderTextColor="#94A3B8"
            value={firstName}
            onChangeText={onFirstNameChange}
            onFocus={() => setFocusedField("firstName")}
            onBlur={() => setFocusedField(null)}
            autoCapitalize="words"
          />

          {/* Last Name */}
          <Text style={styles.inputLabel}>Last Name</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === "lastName" && styles.inputFocused,
            ]}
            placeholder="Enter last name"
            placeholderTextColor="#94A3B8"
            value={lastName}
            onChangeText={onLastNameChange}
            onFocus={() => setFocusedField("lastName")}
            onBlur={() => setFocusedField(null)}
            autoCapitalize="words"
          />

          {/* Email Address */}
          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={[styles.input, styles.inputDisabled]}>
            <Ionicons
              name="lock-closed"
              size={16}
              color="#94A3B8"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.disabledText}>{email}</Text>
          </View>

          {/* Phone Number */}
          <Text style={styles.inputLabel}>Phone Number</Text>
          <PhoneInput
            placeholder="900 000 0000"
            value={phoneNumber}
            onChangeText={onPhoneNumberChange}
            style={{ marginBottom: 4 }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>ACCOUNT INFORMATION</Text>

      <View style={styles.card}>
        <AccountInfoItem
          icon="person"
          label="First Name"
          value={capitalizeWords(firstName)}
          editable={false}
          showChevron={false}
          showDivider
        />

        <AccountInfoItem
          icon="person"
          label="Last Name"
          value={capitalizeWords(lastName)}
          editable={false}
          showChevron={false}
          showDivider
        />

        <AccountInfoItem
          icon="mail"
          label="Email Address"
          value={email}
          editable={false}
          showChevron={false}
          showDivider
        />

        <AccountInfoItem
          icon="call"
          label="Phone Number"
          value={phoneNumber}
          editable={false}
          showChevron={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#707477",
    letterSpacing: 0.5,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  editCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    height: 50,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#1E293B",
  },
  inputFocused: {
    borderColor: "#12A5B5",
    backgroundColor: "#FFFFFF",
    shadowColor: "#12A5B5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  inputDisabled: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
  },
  disabledText: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "500",
  },
});