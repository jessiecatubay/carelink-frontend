import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AccountInfoItem from "./AccountInfoItem";

export type AccountInformationProps = {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  onFullNamePress?: () => void;
  onEmailPress?: () => void;
  onPhonePress?: () => void;
};

export default function AccountInformation({
  fullName = "Zayn Malik",
  email = "zaynmalik@gmail.com",
  phoneNumber = "+63 936 936 938 171",
  onFullNamePress,
  onEmailPress,
  onPhonePress,
}: AccountInformationProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>ACCOUNT INFORMATION</Text>
      <View style={styles.card}>
        <AccountInfoItem
          icon="person"
          label="Full Name"
          value={fullName}
          showDivider
          onPress={onFullNamePress}
        />
        <AccountInfoItem
          icon="mail"
          label="Email Address"
          value={email}
          showDivider
          onPress={onEmailPress}
        />
        <AccountInfoItem
          icon="call"
          label="Phone Number"
          value={phoneNumber}
          onPress={onPhonePress}
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
});
