import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AccountInfoItem from "./AccountInfoItem";

export type RoleInformationProps = {
  accountType?: string;
  onPress?: () => void;
};

export default function RoleInformation({
  accountType = "Family / Caregiver",
  onPress,
}: RoleInformationProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>ROLE</Text>
      <View style={styles.card}>
        <AccountInfoItem
          icon="people"
          label="Account Type"
          value={accountType}
          onPress={onPress}
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
