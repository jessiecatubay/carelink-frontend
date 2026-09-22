import axiosInstance from "@/hooks/lib/axios";
import { CommandData } from "@/hooks/lib/CommandData";
import { onPatientAlert } from "@/hooks/lib/socket";
import { remoteCommandSchema, type PatientAlert } from "@/schema/api";
import { Notification, RemoteCommand } from "@/types/command";
import { formatPhilippineDateTime } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PAGE_SIZE = 20;
const filters = ["All", "Emergency", "Requests", "Resolved"] as const;
type Filter = (typeof filters)[number];

type PageResponse<T> = {
  items: T[];
  totalItems?: number;
  page?: number;
  totalPages?: number;
  hasNext?: boolean;
};

const mapCommand = (command: RemoteCommand): Notification | null => {
  const details =
    CommandData[command.command.toUpperCase() as keyof typeof CommandData];
  if (!details) return null;

  const parsed = remoteCommandSchema.safeParse(command);
  if (!parsed.success) return null;

  return {
    id: command.id,
    ...details,
    status: command.status,
    time: formatPhilippineDateTime(command.recordedAt),
  };
};

const getPageResponse = (data: unknown): PageResponse<RemoteCommand> => {
  if (Array.isArray(data)) {
    return {
      items: data.flatMap((item) => {
        const parsed = remoteCommandSchema.safeParse(item);
        return parsed.success ? [parsed.data] : [];
      }),
      hasNext: data.length === PAGE_SIZE,
    };
  }

  if (!data || typeof data !== "object") {
    return { items: [], hasNext: false };
  }

  const response = data as {
    data?: unknown;
    items?: unknown;
    page?: number;
    totalItems?: number;
    totalPages?: number;
    hasNext?: boolean;
    meta?: {
      page?: number;
      totalItems?: number;
      totalPages?: number;
      hasNext?: boolean;
    };
    pagination?: {
      page?: number;
      totalItems?: number;
      totalPages?: number;
      hasNext?: boolean;
    };
  };
  const payload =
    response.data && typeof response.data === "object"
      ? (response.data as typeof response)
      : response;
  const metadata =
    response.pagination ?? response.meta ?? payload.pagination ?? payload.meta;
  const rawItems = Array.isArray(response.data)
    ? response.data
    : Array.isArray(payload.items)
      ? payload.items
      : Array.isArray(payload.data)
        ? payload.data
        : [];

  return {
    items: rawItems.flatMap((item) => {
      const parsed = remoteCommandSchema.safeParse(item);
      return parsed.success ? [parsed.data] : [];
    }),
    page: response.page ?? metadata?.page ?? payload.page,
    totalItems:
      response.totalItems ?? metadata?.totalItems ?? payload.totalItems,
    totalPages:
      response.totalPages ?? metadata?.totalPages ?? payload.totalPages,
    hasNext: response.hasNext ?? metadata?.hasNext ?? payload.hasNext,
  };
};

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<Notification[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const pageRef = useRef(1);

  const loadPage = async (pageNumber: number) => {
    pageRef.current = pageNumber;
    setLoading(true);
    setLoadError(false);

    try {
      const result = await axiosInstance.get(
        "/api/command/v1/get-all-commands",
        { params: { page: pageNumber, limit: PAGE_SIZE } },
      );
      const response = getPageResponse(result.data);
      const mappedAlerts = response.items
        .map(mapCommand)
        .filter((alert): alert is Notification => alert !== null);

      setAlerts(mappedAlerts);
      const itemCount = response.totalItems ?? mappedAlerts.length;
      setTotalItems(itemCount);
      setPage(pageNumber);
      const nextPageExists =
        response.hasNext ?? pageNumber < Math.ceil(itemCount / PAGE_SIZE);
      setHasNext(nextPageExists);
      setTotalPages(
        response.totalPages ?? Math.max(1, Math.ceil(itemCount / PAGE_SIZE)),
      );
    } catch (error) {
      console.error("Failed to get alerts:", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const off = onPatientAlert((payload: PatientAlert) => {
      const command = payload.command ?? payload.alertType;
      if (typeof command !== "string") return;

      if (command.toUpperCase() === "SATISFIED") {
        setAlerts((current) =>
          current.length
            ? current.map((alert, index) =>
                index === 0 ? { ...alert, status: "Satisfied" } : alert,
              )
            : current,
        );
        return;
      }

      const alert = mapCommand({
        command: command.toUpperCase() as RemoteCommand["command"],
        id: payload.id ?? `${command}-${payload.timestamp ?? Date.now()}`,
        recordedAt:
          payload.recordedAt ?? payload.timestamp ?? new Date().toISOString(),
        status: payload.status ?? "Pending",
      });
      if (!alert || pageRef.current !== 1) return;

      setAlerts((current) =>
        [alert, ...current.filter((item) => item.id !== alert.id)].slice(
          0,
          PAGE_SIZE,
        ),
      );
      setTotalItems((current) => current + 1);
    });

    loadPage(1);
    return () => off?.();
  }, []);

  const visibleAlerts = alerts.filter((alert) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Resolved") return alert.status === "Satisfied";
    return alert.type === activeFilter;
  });

  const goToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === page) {
      return;
    }
    loadPage(pageNumber);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Alerts</Text>
          <Text style={styles.count}>{totalItems} alerts</Text>
        </View>

        <Pressable
          accessibilityLabel="Refresh alerts"
          disabled={loading}
          onPress={() => loadPage(page)}
        >
          <Ionicons
            name="refresh-outline"
            size={23}
            color={loading ? "#C7D0D5" : "#079BA8"}
          />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        <View style={styles.filterRow}>
          {filters.map((filter) => (
            <Pressable
              key={filter}
              onPress={() => {
                setActiveFilter(filter);
                if (page !== 1) loadPage(1);
              }}
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
        {loading ? (
          <Text style={styles.empty}>Loading alerts...</Text>
        ) : loadError ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Alerts are unavailable</Text>
            <Text style={styles.emptyDescription}>
              Check your connection and try loading them again.
            </Text>
            <Pressable
              style={styles.retryButton}
              onPress={() => loadPage(page)}
            >
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        ) : visibleAlerts.length === 0 ? (
          <Text style={styles.empty}>No patient alerts</Text>
        ) : (
          visibleAlerts.map((alert) => (
            <View key={alert.id} style={styles.card}>
              <View
                style={[styles.icon, { backgroundColor: alert.iconBackground }]}
              >
                <Image source={alert.icon} style={styles.iconImage} />
              </View>
              <View style={styles.copy}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.description}>{alert.description}</Text>
                <Text
                  style={[
                    styles.status,
                    alert.status === "Pending"
                      ? styles.pending
                      : styles.resolved,
                  ]}
                >
                  {alert.status || "Pending"}
                </Text>
              </View>
              <Text style={styles.time}>{alert.time}</Text>
            </View>
          ))
        )}
        <View style={styles.pagination}>
          <Pressable
            accessibilityLabel="Previous alerts page"
            disabled={page === 1 || loading}
            onPress={() => goToPage(page - 1)}
            style={styles.pageButton}
          >
            <Ionicons
              name="chevron-back"
              size={18}
              color={page === 1 ? "#C7D0D5" : "#079BA8"}
            />
          </Pressable>
          <Text style={styles.pageText}>
            Page {page} of {totalPages}
          </Text>
          <Pressable
            accessibilityLabel="Next alerts page"
            disabled={!hasNext || loading}
            onPress={() => goToPage(page + 1)}
            style={styles.pageButton}
          >
            <Ionicons
              name="chevron-forward"
              size={18}
              color={!hasNext ? "#C7D0D5" : "#079BA8"}
            />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFBFD" },
  header: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#F0F2F3",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  title: { color: "#17191B", fontSize: 18, fontWeight: "700" },
  count: { color: "#079BA8", fontSize: 13 },
  list: { gap: 10, padding: 14 },
  filterRow: { flexDirection: "row", gap: 8, marginBottom: 4 },
  filter: {
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    borderRadius: 16,
    flex: 1,
    justifyContent: "center",
    paddingVertical: 7,
  },
  filterText: { color: "#303234", fontSize: 11 },
  activeFilter: { backgroundColor: "#0BA2A8" },
  activeFilterText: { color: "#FFFFFF" },
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7E9",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 70,
    padding: 10,
  },
  icon: {
    alignItems: "center",
    borderRadius: 22,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  iconImage: { height: 24, width: 24 },
  copy: { flex: 1, marginLeft: 10 },
  alertTitle: { color: "#111111", fontSize: 14, fontWeight: "700" },
  description: { color: "#777B7D", fontSize: 11, marginTop: 2 },
  status: {
    alignSelf: "flex-start",
    fontSize: 10,
    marginTop: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  pending: { backgroundColor: "#FFE5E4", color: "#FF5B58" },
  resolved: { backgroundColor: "#DDF7F3", color: "#159F96" },
  time: { alignSelf: "flex-start", color: "#777B7D", fontSize: 10 },
  empty: { color: "#A0AEC0", paddingTop: 60, textAlign: "center" },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  emptyTitle: { color: "#17191B", fontSize: 16, fontWeight: "700" },
  emptyDescription: {
    color: "#777B7D",
    fontSize: 13,
    marginTop: 8,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#0BA2A8",
    borderRadius: 8,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  retryText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  pagination: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  pageButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7E9",
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  pageText: { color: "#4D5A60", fontSize: 12, marginHorizontal: 16 },
});
