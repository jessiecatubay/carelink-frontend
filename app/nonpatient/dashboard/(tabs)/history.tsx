import axiosInstance from "@/lib/axios";
import { CommandData } from "@/lib/CommandData";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Notification, RemoteCommand } from "@/types/command";

const commandDetails: Record<
  RemoteCommand["command"],
  Omit<Notification, "id" | "time" | "status">
> = CommandData

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
  return {
    id: command.id,
    ...commandDetails[command.command],
    status: command.status,
    time: formatRecordedTime(command.recordedAt),
  };
};

const filters = ["All", "Emergency", "Requests", "Resolved"] as const;
type Filter = (typeof filters)[number];

export default function HistoryScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const getAllCommandData = async () => {
      const result = await axiosInstance.get("/api/command/v1/get-all-commands");
      console.log("Remote Data", result.data.data);

      const commands = result.data.data as RemoteCommand[];
      setNotifications(
        commands
          .map(mapRemoteCommand)
          .filter((notification) => notification !== null),
      );
    };

    getAllCommandData();
  }, []);

  const visibleNotifications = notifications.filter((notification) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Resolved") return notification.status === "Satisfied";
    return notification.type === activeFilter;
  });

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={25} color="#202124" />
        </Pressable>
        <Text style={styles.headerTitle}>History</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => setNotifications([])}
          style={styles.clearButton}
        >
          <Text style={styles.clearText}>Clear All</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.filterRow}>
          {filters.map((filter) => (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: activeFilter === filter }}
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filter,
                activeFilter === filter && styles.activeFilter,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.activeFilterText,
                ]}
              >
                {filter}
              </Text>
            </Pressable>
          ))}
        </View>

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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F3",
    flexDirection: "row",
    height: 57,
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  backButton: {
    width: 42,
  },
  headerTitle: {
    color: "#17191B",
    fontSize: 18,
    fontWeight: "700",
  },
  clearButton: {
    alignItems: "flex-end",
    width: 65,
  },
  clearText: {
    color: "#079BA8",
    fontSize: 14,
  },
  content: {
    paddingBottom: 24,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 21,
    paddingVertical: 14,
  },
  filter: {
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    borderRadius: 16,
    flex: 1,
    height: 30,
    justifyContent: "center",
  },
  activeFilter: {
    backgroundColor: "#0BA2A8",
  },
  filterText: {
    color: "#303234",
    fontSize: 12,
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
  list: {
    gap: 9,
    paddingHorizontal: 13,
    paddingTop: 24,
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
