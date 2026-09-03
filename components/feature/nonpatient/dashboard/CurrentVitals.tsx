import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CurrentVitals() {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Current Vitals</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A202C",
  },
});
