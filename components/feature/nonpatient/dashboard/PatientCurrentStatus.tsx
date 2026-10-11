import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/lib/axios";
import { CommandData } from "@/hooks/lib/CommandData";
import { initSocket, onPatientAlert } from "@/hooks/lib/socket";
import React, { useEffect, useState } from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";

export default function PatientCurrentStatus(patientId: {
  patientId?: string;
}) {
  const [latestCommand, setLatestCommand] = useState<string | null>(
    "SATISFIED",
  );
  const commandDetails = latestCommand
    ? CommandData[latestCommand as keyof typeof CommandData]
    : undefined;
  const { user } = useAuth();

  useEffect(() => {
    if (!patientId.patientId) return;

    initSocket();

    const off = onPatientAlert((payload: any) => {
      const command = payload?.command ?? payload?.alertType;
      if (typeof command !== "string") return;

      const normalizedCommand = command.toUpperCase();
      setLatestCommand(normalizedCommand);
    });

    const getLatestCommand = async () => {
      if (!patientId.patientId || !user?.id) return;

      try {
        const result = await axiosInstance.post(
          "/api/command/v1/get-latest-command",
          { nonPatientId: user.id, patientId: patientId.patientId },
        );

        const command = result.data.data;
        if (!command || command.status === "Satisfied") {
          setLatestCommand("SATISFIED");
        } else {
          setLatestCommand(command.command);
        }
      } catch (error) {
        console.error("Failed to get latest command:", error);
      }
    };
    getLatestCommand();

    return () => {
      off?.();
    };
  }, [patientId.patientId, user?.id]);

  const getTheme = () => {
    switch (latestCommand) {
      case "FOOD":
        return {
          bg: "#FF6D2E",
          border: "rgba(255, 255, 255, 0.2)",
          titleColor: "#FFFFFF",
          subtitleColor: "rgba(255, 255, 255, 0.92)",
          iconBg: "#FFFFFF",
          iconTint: undefined,
        };
      case "WATER":
        return {
          bg: "#0284C7",
          border: "rgba(255, 255, 255, 0.2)",
          titleColor: "#FFFFFF",
          subtitleColor: "rgba(255, 255, 255, 0.92)",
          iconBg: "#FFFFFF",
          iconTint: undefined,
        };
      case "ASSISTANCE":
        return {
          bg: "#E68A00",
          border: "rgba(255, 255, 255, 0.2)",
          titleColor: "#FFFFFF",
          subtitleColor: "rgba(255, 255, 255, 0.92)",
          iconBg: "#FFFFFF",
          iconTint: undefined,
        };
      case "EMERGENCY":
        return {
          bg: "#F16A66",
          border: "rgba(255, 255, 255, 0.2)",
          titleColor: "#FFFFFF",
          subtitleColor: "rgba(255, 255, 255, 0.92)",
          iconBg: "#FFFFFF",
          iconTint: "#F16A66",
        };
      case "SATISFIED":
      default:
        return {
          bg: "#10B981",
          border: "rgba(255, 255, 255, 0.2)",
          titleColor: "#FFFFFF",
          subtitleColor: "rgba(255, 255, 255, 0.92)",
          iconBg: "#FFFFFF",
          iconTint: "#10B981",
        };
    }
  };

  const theme = getTheme();

  return (
    <View
      style={[
        styles.patientStatusCard,
        { backgroundColor: theme.bg, borderColor: theme.border },
      ]}
    >
      <View style={styles.patientStatusLeft}>
        <View
          style={[
            styles.statusIconContainer,
            { backgroundColor: theme.iconBg },
          ]}
        >
          <Image
            source={
              commandDetails?.icon || require("@/assets/icons/satisfied.png")
            }
            style={[
              styles.statusIcon,
              theme.iconTint ? { tintColor: theme.iconTint } : null,
            ]}
            resizeMode="contain"
          />
        </View>
        <View style={styles.statusTextContainer}>
          <Text style={[styles.statusTitle, { color: theme.titleColor }]}>
            {patientId.patientId
              ? commandDetails?.title
              : "No patient data yet"}
          </Text>
          <Text style={[styles.statusSubtitle, { color: theme.subtitleColor }]}>
            {patientId.patientId
              ? commandDetails?.description
              : "Connect a patient to view their latest request."}
          </Text>
        </View>
      </View>

      <View style={styles.patientStatusRight}>
        <Image
          source={require("@/assets/icons/family.png")}
          style={[styles.familyIcon, { tintColor: "#FFFFFF" }]}
          resizeMode="contain"
        />
        <View style={styles.checkBadge}>
          <Image
            source={require("@/assets/icons/check.png")}
            style={[styles.checkIcon, { tintColor: theme.bg }]}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  patientStatusCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
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
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
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
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  statusSubtitle: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  patientStatusRight: {
    position: "relative",
    width: 54,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  familyIcon: {
    width: 44,
    height: 32,
    opacity: 0.75,
  },
  checkBadge: {
    position: "absolute",
    bottom: -2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  checkIcon: {
    width: 10,
    height: 10,
  },
});
