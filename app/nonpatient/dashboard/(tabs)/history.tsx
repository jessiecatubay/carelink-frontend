import axiosInstance from "@/hooks/lib/axios";
import { initSocket, onPatientVitals } from "@/hooks/lib/socket";
import { Vital } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PAGE_SIZE = 20;

type PageResponse<T> = {
  items: T[];
  totalItems?: number;
  totalPages?: number;
  hasNext?: boolean;
};

const formatRecordedTime = (recordedAt: string) => {
  const date = new Date(recordedAt);
  if (Number.isNaN(date.getTime())) return "Unknown time";

  return date.toLocaleString("en-PH", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
  });
};

const getPageResponse = (data: unknown): PageResponse<Vital> => {
  if (Array.isArray(data)) {
    return { items: data as Vital[], hasNext: data.length === PAGE_SIZE };
  }

  if (!data || typeof data !== "object") {
    return { items: [], hasNext: false };
  }

  const response = data as {
    data?: unknown;
    items?: unknown;
    totalItems?: number;
    totalPages?: number;
    hasNext?: boolean;
    meta?: { totalItems?: number; totalPages?: number; hasNext?: boolean };
    pagination?: {
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
    items: rawItems as Vital[],
    totalItems:
      response.totalItems ?? metadata?.totalItems ?? payload.totalItems,
    totalPages:
      response.totalPages ?? metadata?.totalPages ?? payload.totalPages,
    hasNext: response.hasNext ?? metadata?.hasNext ?? payload.hasNext,
  };
};

export default function HistoryScreen() {
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const pageRef = useRef(1);

  const loadPage = async (pageNumber: number) => {
    pageRef.current = pageNumber;
    setLoading(true);

    try {
      const result = await axiosInstance.get("/api/device/v1/get-full-vitals", {
        params: { page: pageNumber, limit: PAGE_SIZE },
      });
      const response = getPageResponse(result.data);
      const itemCount = response.totalItems ?? response.items.length;
      const nextPageExists =
        response.hasNext ?? pageNumber < Math.ceil(itemCount / PAGE_SIZE);

      setVitals(response.items);
      setTotalItems(itemCount);
      setPage(pageNumber);
      setHasNext(nextPageExists);
      setTotalPages(
        response.totalPages ?? Math.max(1, Math.ceil(itemCount / PAGE_SIZE)),
      );
    } catch (error) {
      console.error("Failed to get full vitals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage(1);
    initSocket();

    const off = onPatientVitals((payload: Partial<Vital>) => {
      if (
        !payload ||
        typeof payload.heartRate !== "number" ||
        typeof payload.temperature !== "number"
      ) {
        return;
      }

      const liveVital: Vital = {
        id: payload.id ?? `live-${payload.recordedAt ?? Date.now()}`,
        deviceId: payload.deviceId ?? "live",
        heartRate: payload.heartRate,
        temperature: payload.temperature,
        sensorContact: Boolean(payload.sensorContact),
        recordedAt: payload.recordedAt ?? new Date().toISOString(),
      };

      if (pageRef.current === 1) {
        setVitals((current) =>
          [
            liveVital,
            ...current.filter((vital) => vital.id !== liveVital.id),
          ].slice(0, PAGE_SIZE),
        );
        setTotalItems((current) => current + 1);
      }
    });

    return () => off?.();
  }, []);

  const goToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === page) {
      return;
    }
    loadPage(pageNumber);
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>History</Text>
          <Text style={styles.count}>{totalItems} readings</Text>
        </View>
        <Pressable
          accessibilityLabel="Refresh vitals history"
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

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <Text style={styles.message}>Loading vitals...</Text>
        ) : vitals.length === 0 ? (
          <Text style={styles.message}>No vitals recorded yet</Text>
        ) : (
          <View style={styles.list}>
            {vitals.map((vital) => (
              <View key={vital.id} style={styles.vitalCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.recordedAt}>
                    {formatRecordedTime(vital.recordedAt)}
                  </Text>
                  <Text
                    style={[
                      styles.contact,
                      vital.sensorContact
                        ? styles.connected
                        : styles.disconnected,
                    ]}
                  >
                    {vital.sensorContact
                      ? "Sensor connected"
                      : "Sensor disconnected"}
                  </Text>
                </View>
                <View style={styles.metrics}>
                  <View style={styles.metric}>
                    <Ionicons name="heart-outline" size={20} color="#12A5B5" />
                    <Text style={styles.metricLabel}>Heart rate</Text>
                    <Text style={styles.metricValue}>
                      {vital.heartRate} BPM
                    </Text>
                  </View>
                  <View style={styles.metric}>
                    <Ionicons
                      name="thermometer-outline"
                      size={20}
                      color="#F16A66"
                    />
                    <Text style={styles.metricLabel}>Temperature</Text>
                    <Text style={styles.metricValue}>
                      {vital.temperature} °C
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.pagination}>
          <Pressable
            accessibilityLabel="Previous vitals page"
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
            accessibilityLabel="Next vitals page"
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
  screen: { backgroundColor: "#FAFBFD", flex: 1 },
  header: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#F0F2F3",
    borderBottomWidth: 1,
    flexDirection: "row",
    height: 57,
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  headerTitle: { color: "#17191B", fontSize: 18, fontWeight: "700" },
  count: { color: "#079BA8", fontSize: 11, marginTop: 2 },
  content: { padding: 14, paddingBottom: 30 },
  message: { color: "#777B7D", padding: 24, textAlign: "center" },
  list: { gap: 10 },
  vitalCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7E9",
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  recordedAt: { color: "#303234", fontSize: 13, fontWeight: "600" },
  contact: { fontSize: 11 },
  connected: { color: "#159F96" },
  disconnected: { color: "#F16A66" },
  metrics: { flexDirection: "row", gap: 10 },
  metric: { backgroundColor: "#F7FAFC", borderRadius: 6, flex: 1, padding: 10 },
  metricLabel: { color: "#777B7D", fontSize: 11, marginTop: 4 },
  metricValue: {
    color: "#17191B",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 2,
  },
  pagination: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
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
