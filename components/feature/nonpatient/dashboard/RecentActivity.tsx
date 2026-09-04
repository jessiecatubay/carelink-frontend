import axiosInstance from "@/lib/axios";
import { CommandData } from "@/lib/CommandData";
import { initSocket, onPatientAlert } from "@/lib/socket";
import { Notification, RemoteCommand } from "@/types/command";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const MAX_RECENT_ACTIVITIES = 5;

interface RecentActivityProps {
  emptyText?: string;
}

const commandDetails: Record<
  RemoteCommand["command"],
  Omit<Notification, "id" | "time" | "status">
> = CommandData;

const formatRecordedTime = (recordedAt: string) => {
  const date = new Date(recordedAt);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("en-PH", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
  });
};

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
    time: formatRecordedTime(command.recordedAt),
  };
};

export default function RecentActivity({
  emptyText = "No recent activity today",
}: RecentActivityProps) {
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
          const markAsSatisfied = async () => {
            await axiosInstance.post("/api/command/v1/update-latest", {
              status: "Satisfied",
            });
          };
          markAsSatisfied();
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
      const result = await axiosInstance.get(
        "/api/command/v1/get-recent-commands",
      );
      console.log("Remote Data", result.data.data);

      const commands = result.data.data as RemoteCommand[];
      setNotifications(
        commands
          .map(mapRemoteCommand)
          .filter((notification) => notification !== null)
          .slice(0, MAX_RECENT_ACTIVITIES),
      );
    };

    getAllCommandData();

    return () => {
      off?.();
    };
  }, []);

  const visibleNotifications = notifications.filter((notification) => {
    return notification.type;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.recentActivityTitle}>Recent Activity</Text>
      {notifications.length === 0 ? (
        <View style={styles.emptyActivityCard}>
          <Ionicons name="chatbox-ellipses-outline" size={32} color="#A0AEC0" />
          <Text style={styles.emptyActivityText}>{emptyText}</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {visibleNotifications.map((notification) => (
            <View
              key={notification.id}
              style={[
                styles.notificationCard,
                notification.type === "Emergency" && styles.emergencyCard,
              ]}
            >
              <View
                style={[
                  styles.notificationIcon,
                  { backgroundColor: notification.iconBackground },
                ]}
              >
                <Image
                  source={notification.icon}
                  style={styles.cardIcon}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.notificationCopy}>
                <Text style={styles.notificationTitle}>
                  {notification.title}
                </Text>
                <Text style={styles.notificationDescription}>
                  {notification.description}
                </Text>
                <Text
                  style={[
                    styles.status,
                    notification.status === "Pending"
                      ? styles.pending
                      : styles.resolved,
                  ]}
                >
                  {notification.status}
                </Text>
              </View>
              <Text style={styles.time}>{notification.time}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  recentActivityTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A202C",
    marginBottom: 12,
  },
  list: {
    gap: 9,
  },
  emptyActivityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EDF2F7",
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyActivityText: {
    marginTop: 8,
    fontSize: 14,
    color: "#A0AEC0",
    fontWeight: "500",
  },
  notificationCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7E9",
    borderRadius: 7,
    borderWidth: 1,
    elevation: 3,
    flexDirection: "row",
    minHeight: 64,
    paddingHorizontal: 9,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  emergencyCard: {
    borderLeftColor: "#FF5753",
    borderLeftWidth: 5,
  },
  notificationIcon: {
    alignItems: "center",
    borderColor: "#D9EEF4",
    borderRadius: 24,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  cardIcon: {
    height: 24,
    width: 24,
  },
  notificationCopy: {
    flex: 1,
    marginLeft: 10,
  },
  notificationTitle: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "700",
  },
  notificationDescription: {
    color: "#777B7D",
    fontSize: 11,
    marginTop: 1,
  },
  status: {
    alignSelf: "flex-start",
    borderRadius: 2,
    fontSize: 10,
    marginTop: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  pending: {
    backgroundColor: "#FFE5E4",
    color: "#FF5B58",
  },
  resolved: {
    backgroundColor: "#DDF7F3",
    color: "#159F96",
  },
  time: {
    alignSelf: "flex-start",
    color: "#777B7D",
    fontSize: 10,
    marginTop: 9,
  },
});
