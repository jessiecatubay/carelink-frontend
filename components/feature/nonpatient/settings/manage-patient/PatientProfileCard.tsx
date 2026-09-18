import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type PatientProfileCardProps = {
  name: string;
  age?: number | string | null;
  gender?: string | null;
  connectionStatus?: "CONNECTED" | "DISCONNECTED" | string;
  connectionCode?: string | null;
};

export default function PatientProfileCard({
  name,
  age,
  gender,
  connectionStatus = "CONNECTED",
  connectionCode,
}: PatientProfileCardProps) {
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PT";

  const isConnected = connectionStatus === "CONNECTED";

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.chipRow}>
            {age ? (
              <View style={styles.chip}>
                <Text style={styles.chipText}>{age} yrs old</Text>
              </View>
            ) : null}
            {gender ? (
              <View style={styles.chip}>
                <Text style={styles.chipText}>{gender}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <View style={styles.statusBadge}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isConnected ? "#10B981" : "#EF4444" },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              { color: isConnected ? "#065F46" : "#991B1B" },
            ]}
          >
            {isConnected ? "Connected & Monitored" : "Disconnected"}
          </Text>
        </View>

        {connectionCode ? (
          <View style={styles.codeContainer}>
            <Ionicons name="qr-code-outline" size={14} color="#64748B" />
            <Text style={styles.codeText}>{connectionCode}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E6F7F7",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#0AA7A8",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0AA7A8",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E242B",
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  chipText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 14,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  codeText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
