import { Image, StyleSheet, Text, View } from "react-native";

interface LastUpdatedCardProps {
  lastUpdated: string;
  batteryLevel: number | null;
}

export default function LastUpdatedCard({
  lastUpdated,
  batteryLevel,
}: LastUpdatedCardProps) {
  return (
    <View style={styles.syncRow}>
      <View style={styles.syncCol}>
        <Image
          source={require("@/assets/icons/belt.png")}
          style={styles.beltIcon}
          resizeMode="contain"
        />
        <Text style={styles.syncText}>
          {lastUpdated
            ? `Last updated: ${lastUpdated}`
            : "No vitals recorded yet"}
        </Text>
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

      <View style={styles.batteryContainer}>
        <Text style={styles.batteryText}>
          {batteryLevel !== null ? `${batteryLevel}%` : "--"}
        </Text>
        <View style={styles.batteryBody}>
          <View
            style={[
              styles.batteryFill,
              {
                width: `${Math.max(0, Math.min(100, batteryLevel ?? 0))}%`,
              },
            ]}
          />
        </View>
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
  batteryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    marginRight: 8,
  },
  batteryText: {
    fontSize: 10,
    color: "#718096",
    fontWeight: "600",
    marginRight: 5,
  },
  batteryBody: {
    width: 20,
    height: 10,
    borderWidth: 1.5,
    borderColor: "#718096",
    borderRadius: 2,
    padding: 1,
    justifyContent: "center",
  },
  batteryFill: {
    height: 6,
    backgroundColor: "#48BB78",
    borderRadius: 1,
  },
  signalContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginLeft: 4,
  },
  signalBar: {
    width: 2.5,
    backgroundColor: "#48BB78",
    marginHorizontal: 0.75,
    borderRadius: 0.5,
  },
});
