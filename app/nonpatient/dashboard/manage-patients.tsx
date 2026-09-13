import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/lib/axios";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Resident = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
};

type Connection = {
  id?: string;
  patient?: Resident | null;
  status?: string;
  currentPatient?: boolean;
};

const getResidentName = (resident?: Resident | null) => {
  const name = [resident?.firstName, resident?.lastName]
    .filter(Boolean)
    .join(" ");

  return name || "Resident";
};

export default function ManagePatientsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  console.log("user karunn", user);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const loadConnections = async () => {
      try {
        const response = await axiosInstance.post(
          "/api/user/v1/get-user-by-id",
          { id: user.id },
        );
        const nextConnections = response.data?.data?.nonPatientConnections;
        setConnections(Array.isArray(nextConnections) ? nextConnections : []);
      } catch (error) {
        console.error("Failed to load non-patient:", error);
        Alert.alert("Unable to load non-patient", "Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadConnections();
  }, [user?.id]);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/nonpatient/dashboard/(tabs)/settings");
    }
  };

  const handleDisconnect = async (
    patientId: string | undefined,
    nonPatientId: string | undefined,
  ) => {
    const payload = {
      patientId: patientId,
      nonPatientId: nonPatientId,
      status: "DISCONNECTED",
    };
    try {
      await axiosInstance.post("/api/patient-nonpatient/v1/update", payload);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectPatient = async (patientId: string | undefined) => {
    if (!patientId || !user?.id) return;

    try {
      await axiosInstance.post("/api/patient-nonpatient/v1/update", {
        patientId,
        nonPatientId: user.id,
        currentPatient: true,
      });

      router.replace("/nonpatient/dashboard/(tabs)");
    } catch (error) {
      console.error("Failed to select current patient:", error);
      Alert.alert("Unable to select patient", "Please try again later.");
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="Go back" hitSlop={12} onPress={goBack}>
          <Ionicons name="arrow-back" size={29} color="#17191B" />
        </Pressable>
        <Text style={styles.headerTitle}>Connection</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Non-patient</Text>
        <Text style={styles.subtitle}>
          Manage and monitor non-patient easily
        </Text>

        <Text style={styles.listTitle}>All Non-patients</Text>

        {loading ? (
          <ActivityIndicator color="#08A8A8" style={styles.loader} />
        ) : connections.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={34} color="#08A8A8" />
            <Text style={styles.emptyTitle}>No non-patient connected</Text>
            <Text style={styles.emptyText}>
              Add a resident by scanning their connection QR code.
            </Text>
          </View>
        ) : (
          connections.map((connection, index) => {
            const resident = connection.patient;
            const name = getResidentName(resident);

            return (
              <View
                key={connection.id ?? resident?.id ?? index}
                style={styles.residentCard}
              >
                <View style={styles.residentTop}>
                  <View style={styles.linkIcon}>
                    <Ionicons name="link" size={25} color="#08A8A8" />
                  </View>
                  <View style={styles.residentCopy}>
                    <Text style={styles.statusLabel}>Connection Status</Text>
                    <Text style={styles.statusText}>
                      Connected to Caregiver/Family
                    </Text>
                    <View style={styles.nameRow}>
                      <Text style={styles.residentName}>{name}</Text>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#08A8A8"
                      />
                    </View>
                  </View>
                </View>
                <Pressable
                  style={styles.disconnectButton}
                  onPress={() =>
                    Alert.alert(
                      "Disconnect resident?",
                      `Remove ${name} from your connected non-patient?`,
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Disconnect",
                          style: "destructive",
                          onPress: () =>
                            handleDisconnect(connection?.patient?.id, user?.id),
                        },
                      ],
                    )
                  }
                >
                  <Text style={styles.disconnectText}>Disconnect</Text>
                </Pressable>
                <Pressable
                  disabled={connection.currentPatient}
                  style={[
                    styles.selectButton,
                    connection.currentPatient && styles.selectedButton,
                  ]}
                  onPress={() => handleSelectPatient(resident?.id)}
                >
                  <Text
                    style={[
                      styles.selectText,
                      connection.currentPatient && styles.selectedText,
                    ]}
                  >
                    {connection.currentPatient
                      ? "Current Patient"
                      : "Select Patient"}
                  </Text>
                </Pressable>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    alignItems: "center",
    borderBottomColor: "#F0F2F3",
    borderBottomWidth: 1,
    flexDirection: "row",
    height: 57,
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerTitle: { color: "#111111", fontSize: 22, fontWeight: "700" },
  headerSpacer: { width: 29 },
  content: { paddingBottom: 32, paddingHorizontal: 16, paddingTop: 37 },
  title: { color: "#08A8A8", fontSize: 20, fontWeight: "700" },
  subtitle: { color: "#9CA3AF", fontSize: 15, marginTop: 7 },
  listTitle: {
    color: "#17191B",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 23,
  },
  loader: { marginTop: 30 },
  residentCard: {
    borderColor: "#D8D8D8",
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 13,
    padding: 16,
  },
  residentTop: { flexDirection: "row" },
  linkIcon: {
    alignItems: "center",
    borderColor: "#A7EEEE",
    borderRadius: 24,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  residentCopy: { flex: 1, marginLeft: 26 },
  statusLabel: { color: "#73777A", fontSize: 14 },
  statusText: { color: "#17191B", fontSize: 14, marginTop: 2 },
  nameRow: { alignItems: "center", flexDirection: "row", gap: 6, marginTop: 7 },
  residentName: { color: "#08A8A8", fontSize: 14, fontWeight: "600" },
  disconnectButton: {
    alignItems: "center",
    borderColor: "#FF6462",
    borderRadius: 9,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    marginTop: 25,
  },
  disconnectText: { color: "#FF6462", fontSize: 16 },
  selectButton: {
    alignItems: "center",
    borderColor: "#08A8A8",
    borderRadius: 9,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    marginTop: 10,
  },
  selectedButton: { backgroundColor: "#08A8A8" },
  selectText: { color: "#08A8A8", fontSize: 16 },
  selectedText: { color: "#FFFFFF" },
  emptyState: {
    alignItems: "center",
    borderColor: "#D8D8D8",
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 13,
    padding: 28,
  },
  emptyTitle: {
    color: "#17191B",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 10,
  },
  emptyText: {
    color: "#73777A",
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
  },
});
