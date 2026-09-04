import React from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";

interface PatientCurrentStatusProps {
  title?: string;
  subtitle?: string;
}

export default function PatientCurrentStatus({
  title = "Patient Current Status",
  subtitle = "No Patients Need",
}: PatientCurrentStatusProps) {
  return (
    <View style={styles.patientStatusCard}>
      <View style={styles.patientStatusLeft}>
        <View style={styles.statusIconContainer}>
          <Image
            source={require("@/assets/icons/no-entry.png")}
            style={styles.statusIcon}
            resizeMode="contain"
          />
        </View>
        <View style={styles.statusTextContainer}>
          <Text style={styles.statusTitle}>{title}</Text>
          <Text style={styles.statusSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.patientStatusRight}>
        <Image
          source={require("@/assets/icons/family.png")}
          style={styles.familyIcon}
          resizeMode="contain"
        />
        <View style={styles.checkBadge}>
          <Image
            source={require("@/assets/icons/check.png")}
            style={styles.checkIcon}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  patientStatusCard: {
    backgroundColor: "#EBF8FA",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#A0AEC0",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  patientStatusLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statusIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#A0AEC0",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  statusIcon: {
    width: 26,
    height: 26,
  },
  statusTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#12A5B5",
  },
  statusSubtitle: {
    fontSize: 14,
    color: "#718096",
    marginTop: 2,
  },
  patientStatusRight: {
    position: "relative",
    width: 60,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  familyIcon: {
    width: 50,
    height: 35,
    opacity: 0.3,
  },
  checkBadge: {
    position: "absolute",
    bottom: -2,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#12A5B5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#EBF8FA",
  },
  checkIcon: {
    width: 9,
    height: 9,
    tintColor: "#FFFFFF",
  },
});
