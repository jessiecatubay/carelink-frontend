import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface LastUpdatedCardProps {
  lastUpdated: string;
  batteryLevel: number | null;
}

export default function LastUpdatedCard({
  lastUpdated,
  batteryLevel,
}: LastUpdatedCardProps) {
  const getBatteryColor = (level: number | null) => {
    if (level === null) return "#94A3B8";
    if (level <= 20) return "#EF4444";
    if (level <= 40) return "#F59E0B";
    return "#10B981";
  };

  const batteryColor = getBatteryColor(batteryLevel);

  return (
    <View style={styles.syncRow}>
      <View style={styles.syncCol}>
        <Image
          source={require("@/assets/icons/belt.png")}
          style={styles.beltIcon}
          resizeMode="contain"
        />
        <Text style={styles.syncText} numberOfLines={1}>
          {lastUpdated
            ? `Synced: ${lastUpdated}`
            : "No vitals recorded yet"}
        </Text>
      </View>

      <View style={styles.syncDivider} />

      <View style={styles.deviceRightCol}>
        {/* Battery */}
        <View style={styles.batteryContainer}>
          <Text style={[styles.batteryText, { color: batteryColor }]}>
            {batteryLevel !== null ? `${batteryLevel}%` : "--"}
          </Text>
          <View style={[styles.batteryBody, { borderColor: batteryColor }]}>
            <View
              style={[
                styles.batteryFill,
                {
                  backgroundColor: batteryColor,
                  width: `${Math.max(4, Math.min(100, batteryLevel ?? 0))}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Signal */}
        <View style={styles.signalContainer}>
          <View style={[styles.signalBar, { height: 5 }]} />
          <View style={[styles.signalBar, { height: 8 }]} />
          <View style={[styles.signalBar, { height: 12 }]} />
        </View>
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
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  syncCol: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  beltIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
    tintColor: "#0AA7A8",
  },
  syncText: {
    fontSize: 12,
    color: "#334155",
    fontWeight: "700",
  },
  syncDivider: {
    width: 1,
    height: 16,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 8,
  },
  deviceRightCol: {
    flexDirection: "row",
    alignItems: "center",
  },
  batteryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  batteryText: {
    fontSize: 11,
    fontWeight: "800",
    marginRight: 4,
  },
  batteryBody: {
    width: 22,
    height: 11,
    borderWidth: 1.5,
    borderRadius: 3,
    padding: 1,
    justifyContent: "center",
  },
  batteryFill: {
    height: 6,
    borderRadius: 1,
  },
  signalContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginLeft: 2,
  },
  signalBar: {
    width: 3,
    backgroundColor: "#10B981",
    marginHorizontal: 0.75,
    borderRadius: 1,
  },
});
