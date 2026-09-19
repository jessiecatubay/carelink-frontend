import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type ProfileHeaderProps = {
  name?: string;
  roleTitle?: string;
};

export default function ProfileHeader({
  name = "Zayn Malik",
  roleTitle = "Family / Caregiver",
}: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.roleTitle}>{roleTitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    marginBottom: 16,
  },
  name: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1E242B",
    letterSpacing: -0.3,
  },
  roleTitle: {
    fontSize: 15,
    color: "#707477",
    marginTop: 4,
    fontWeight: "400",
  },
});
