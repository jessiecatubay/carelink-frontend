import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface LastUpdatedCardProps {
  lastUpdated: string;
  batteryLevel: number | null;
  isWristActive?: boolean;
}

export default function LastUpdatedCard({
  lastUpdated,
  batteryLevel,
  isWristActive = true,
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
          style={[
            styles.beltIcon,
            !isWristActive && { tintColor: "#94A3B8" },
          ]}
          resizeMode="contain"
        />
        <Text
          style={[
            styles.syncText,
            !isWristActive && styles.syncTextInactive,
          ]}
          numberOfLines={1}
        >
          {isWristActive && lastUpdated
            ? `Synced: ${lastUpdated}`
            : lastUpdated
            ? `Last active: ${lastUpdated}`
            : "No vitals recorded yet"}
        </Text>
      </View>

      <View style={styles.syncDivider} />

      <View style={styles.deviceRightCol}>
        {/* Battery - removed when wrist is inactive or batteryLevel is null */}
        {isWristActive && batteryLevel !== null ? (
          <View style={styles.batteryContainer}>
            <Text style={[styles.batteryText, { color: batteryColor }]}>
              {`${batteryLevel}%`}
            </Text>
            <View style={[styles.batteryBody, { borderColor: batteryColor }]}>
              <View
                style={[
                  styles.batteryFill,
                  {
                    backgroundColor: batteryColor,
                    width: `${Math.max(4, Math.min(100, batteryLevel))}%`,
                  },
                ]}
              />
            </View>
          </View>
        ) : (
          <View style={styles.inactiveBadge}>
            <View style={styles.inactiveDot} />
            <Text style={styles.inactiveBadgeText}>Inactive</Text>
          </View>
        )}

        {/* Signal */}
        <View style={styles.signalContainer}>
          <View
            style={[
              styles.signalBar,
              {
                height: 5,
                backgroundColor: isWristActive ? "#10B981" : "#CBD5E1",
              },
            ]}
          />
          <View
            style={[
              styles.signalBar,
              {
                height: 8,
                backgroundColor: isWristActive ? "#10B981" : "#CBD5E1",
              },
            ]}
          />
          <View
            style={[
              styles.signalBar,
              {
                height: 12,
                backgroundColor: isWristActive ? "#10B981" : "#CBD5E1",
              },
            ]}
          />
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
  syncTextInactive: {
    color: "#64748B",
    fontWeight: "600",
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
  inactiveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
    gap: 4,
  },
  inactiveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#94A3B8",
  },
  inactiveBadgeText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#64748B",
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
