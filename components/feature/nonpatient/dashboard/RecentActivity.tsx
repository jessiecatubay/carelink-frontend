import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/lib/axios";
import { CommandData } from "@/hooks/lib/CommandData";
import { initSocket, onPatientAlert } from "@/hooks/lib/socket";
import { Notification, RemoteCommand } from "@/types/command";
import { formatPhilippineDateTime } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";

const MAX_RECENT_ACTIVITIES = 5;

interface RecentActivityProps {
  emptyText?: string;
  patientId?: string;
}

const commandDetails: Record<
  RemoteCommand["command"],
  Omit<Notification, "id" | "time" | "status">
> = CommandData;

const mapRemoteCommand = (command: RemoteCommand): Notification | null => {
  const commandKey = String(
    command.command,
  ).toUpperCase() as RemoteCommand["command"];
  const details = commandDetails[commandKey];

  if (!details) return null;

  return {
    id: command.id,
    ...details,
    status: command.status,
    time: formatPhilippineDateTime(command.recordedAt),
  };
};

export default function RecentActivity({
  emptyText = "No recent activity today",
  patientId,
}: RecentActivityProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    initSocket();

    const off = onPatientAlert(
      (
        payload: Partial<RemoteCommand> & {
          alertType?: string;
          timestamp?: string;
        },
      ) => {
        const command = payload.command ?? payload.alertType;
        if (typeof command !== "string") return;

        const normalizedCommand = command.toUpperCase();

        if (normalizedCommand === "SATISFIED") {
          setNotifications((current) => {
            if (!current.length) return current;

            return current.map((notification, index) =>
              index === 0
                ? { ...notification, status: "Satisfied" }
                : notification,
            );
          });
          return;
        }

        const notification = mapRemoteCommand({
          command: normalizedCommand as RemoteCommand["command"],
          id: payload.id ?? `${command}-${payload.timestamp ?? Date.now()}`,
          recordedAt:
            payload.recordedAt ?? payload.timestamp ?? new Date().toISOString(),
          status: payload.status ?? "Pending",
        });

        if (!notification) return;

        setNotifications((current) =>
          [
            notification,
            ...current.filter((item) => item.id !== notification.id),
          ].slice(0, MAX_RECENT_ACTIVITIES),
        );
      },
    );

    const getAllCommandData = async () => {
      if (!patientId || !user?.id) return;

      try {
        const result = await axiosInstance.post(
          "/api/command/v1/get-recent-commands",
          { nonPatientId: user.id, patientId: patientId },
        );

        const commands = (result.data?.data || []) as RemoteCommand[];
        setNotifications(
          commands
            .map(mapRemoteCommand)
            .filter((notification) => notification !== null)
            .slice(0, MAX_RECENT_ACTIVITIES),
        );
      } catch (error) {
        console.error("Failed to get recent commands:", error);
      }
    };

    getAllCommandData();

    return () => {
      off?.();
    };
  }, [patientId, user?.id]);

  const visibleNotifications = notifications.filter((notification) => {
    return notification.type;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.recentActivityTitle}>Recent Activity</Text>
      {notifications.length === 0 ? (
        <View style={styles.emptyActivityCard}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="chatbox-ellipses-outline" size={28} color="#0AA7A8" />
          </View>
          <Text style={styles.emptyActivityText}>{emptyText}</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {visibleNotifications.map((notification) => {
            const isEmergency = notification.type === "Emergency";
            const isSatisfied =
              notification.status === "Satisfied" ||
              notification.type === "Satisfied";

            return (
              <View
                key={notification.id}
                style={[
                  styles.notificationCard,
                  isEmergency && styles.emergencyCard,
                ]}
              >
                <View
                  style={[
                    styles.notificationIcon,
                    isEmergency
                      ? styles.emergencyIconContainer
                      : {
                          backgroundColor:
                            notification.iconBackground || "#F1F5F9",
                        },
                  ]}
                >
                  <Image
                    source={notification.icon}
                    style={[
                      styles.cardIcon,
                      isEmergency && styles.emergencyCardIcon,
                      !isEmergency && notification.iconColor
                        ? { tintColor: notification.iconColor }
                        : null,
                    ]}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.notificationCopy}>
                  <Text
                    style={[
                      styles.notificationTitle,
                      isEmergency && styles.emergencyTitle,
                    ]}
                  >
                    {notification.title}
                  </Text>
                  <Text
                    style={[
                      styles.notificationDescription,
                      isEmergency && styles.emergencyDescription,
                    ]}
                    numberOfLines={1}
                  >
                    {notification.description}
                  </Text>
                  <View style={styles.metaBottomRow}>
                    <View
                      style={[
                        styles.statusBadge,
                        isSatisfied
                          ? styles.statusSatisfied
                          : styles.statusPending,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          isSatisfied
                            ? styles.statusTextSatisfied
                            : styles.statusTextPending,
                        ]}
                      >
                        {notification.status ||
                          (isSatisfied ? "Satisfied" : "Pending")}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.time,
                        isEmergency && styles.emergencyTime,
                      ]}
                    >
                      {notification.time}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 24,
  },
  recentActivityTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
  },
  list: {
    gap: 10,
  },
  emptyActivityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  emptyIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#EDFBFB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyActivityText: {
    fontSize: 13.5,
    color: "#64748B",
    fontWeight: "600",
  },
  notificationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  emergencyCard: {
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    backgroundColor: "#EF4444",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  emergencyIconContainer: {
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
  emergencyCardIcon: {
    tintColor: "#EF4444",
  },
  emergencyTitle: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  emergencyDescription: {
    color: "rgba(255, 255, 255, 0.92)",
    fontWeight: "600",
  },
  emergencyTime: {
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardIcon: {
    width: 24,
    height: 24,
  },
  notificationCopy: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  notificationDescription: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "500",
    marginTop: 2,
  },
  metaBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusPending: {
    backgroundColor: "#FFFFFF",
  },
  statusSatisfied: {
    backgroundColor: "#DCFCE7",
  },
  statusText: {
    fontSize: 10.5,
    fontWeight: "800",
  },
  statusTextPending: {
    color: "#DC2626",
  },
  statusTextSatisfied: {
    color: "#16A34A",
  },
  time: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
  },
});
