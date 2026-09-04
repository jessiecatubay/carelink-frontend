import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface LastUpdatedCardProps {
  lastUpdated: string;
}

export default function LastUpdatedCard({ lastUpdated }: LastUpdatedCardProps) {
  return (
    <View style={styles.syncRow}>
      <View style={styles.syncCol}>
        <Image
          source={require("@/assets/icons/belt.png")}
          style={styles.beltIcon}
          resizeMode="contain"
        />
        <Text style={styles.syncText}>Last updated: {lastUpdated}</Text>
      </View>
      <View style={styles.syncDivider} />
      <View style={styles.syncCol}>
        <Image
          source={require("@/assets/icons/belt.png")}
          style={styles.beltIcon}
          resizeMode="contain"
        />
        <Text style={styles.syncText}>From CareLink Wrist</Text>
      </View>
      <View style={styles.signalContainer}>
        <View style={[styles.signalBar, { height: 5 }]} />
        <View style={[styles.signalBar, { height: 9 }]} />
        <View style={[styles.signalBar, { height: 13 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  syncRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#EDF2F7",
  },
  syncCol: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  beltIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    tintColor: "#718096",
  },
  syncText: {
    fontSize: 11,
    color: "#718096",
    fontWeight: "500",
  },
  syncDivider: {
    width: 1,
    height: 14,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 12,
  },
  signalContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginLeft: 8,
  },
  signalBar: {
    width: 2.5,
    backgroundColor: "#48BB78",
    marginHorizontal: 0.75,
    borderRadius: 0.5,
  },
});
