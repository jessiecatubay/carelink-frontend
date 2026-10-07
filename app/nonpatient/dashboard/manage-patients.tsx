import CustomAlertModal, { AlertModalType } from "@/components/ui/CustomAlertModal";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/lib/axios";
import { initSocket, onConnectionUpdated } from "@/hooks/lib/socket";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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

type ModalState = {
  visible: boolean;
  title: string;
  message: string;
  type?: AlertModalType;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const getResidentName = (resident?: Resident | null) => {
  const name = [resident?.firstName, resident?.lastName]
    .filter(Boolean)
    .join(" ");

  return name || "Patient";
};

const getInitials = (resident?: Resident | null) => {
  const f = (resident?.firstName || "").trim().charAt(0).toUpperCase();
  const l = (resident?.lastName || "").trim().charAt(0).toUpperCase();
  return f || l ? `${f}${l}` : "PT";
};

export default function ManagePatientsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [switchingId, setSwitchingId] = useState<string | null>(null);

  const [modalState, setModalState] = useState<ModalState>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  const loadConnections = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/api/user/v1/get-user-by-id",
        { id: user.id },
      );
      const nextConnections = response.data?.data?.nonPatientConnections;
      setConnections(Array.isArray(nextConnections) ? nextConnections : []);
    } catch (error) {
      console.error("Failed to load patient connections:", error);
      setModalState({
        visible: true,
        type: "error",
        title: "Connection Error",
        message: "Unable to load patient connections. Please try again later.",
        confirmText: "OK",
        onConfirm: () => setModalState((prev) => ({ ...prev, visible: false })),
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadConnections();
  }, [loadConnections]);

  useEffect(() => {
    initSocket();
    const off = onConnectionUpdated(() => {
      loadConnections();
    });

    return () => {
      off();
    };
  }, [loadConnections]);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/nonpatient/dashboard/settings");
    }
  };

  const handleDisconnect = async (
    patientId: string | undefined,
    nonPatientId: string | undefined,
  ) => {
    if (!patientId || !nonPatientId) return;

    const payload = {
      patientId,
      nonPatientId,
      status: "DISCONNECTED",
    };
    try {
      await axiosInstance.post("/api/patient-nonpatient/v1/update", payload);
      await loadConnections();
    } catch (error) {
      console.error("Disconnect error:", error);
      setModalState({
        visible: true,
        type: "error",
        title: "Disconnect Failed",
        message: "Failed to disconnect patient. Please try again.",
        confirmText: "OK",
        onConfirm: () => setModalState((prev) => ({ ...prev, visible: false })),
      });
    }
  };

  const handleSelectPatient = async (patientId: string | undefined) => {
    if (!patientId || !user?.id) return;

    setSwitchingId(patientId);
    try {
      await axiosInstance.post("/api/patient-nonpatient/v1/update", {
        patientId,
        nonPatientId: user.id,
        currentPatient: true,
      });

      await loadConnections();

      setModalState({
        visible: true,
        type: "success",
        title: "Patient Selected",
        message: "The dashboard is now showing this patient's live vitals and notifications.",
        confirmText: "Go to Dashboard",
        onConfirm: () => {
          setModalState((prev) => ({ ...prev, visible: false }));
          router.replace("/nonpatient/dashboard");
        },
      });
    } catch (error) {
      console.error("Failed to select current patient:", error);
      setModalState({
        visible: true,
        type: "error",
        title: "Selection Failed",
        message: "Unable to select patient. Please try again later.",
        confirmText: "OK",
        onConfirm: () => setModalState((prev) => ({ ...prev, visible: false })),
      });
    } finally {
      setSwitchingId(null);
    }
  };

  // Determine the active patient ID safely (only one can be current)
  const activePatientId =
    connections.find((c) => c.currentPatient && c.status === "CONNECTED")?.patient?.id ||
    connections.find((c) => c.currentPatient)?.patient?.id ||
    connections[0]?.patient?.id;

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      {/* Curved Background Accent */}
      <View style={styles.backgroundAccent} pointerEvents="none" />

      {/* Navigation Header */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={goBack}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#0AA7A8" />
        </Pressable>
        <Text style={styles.headerTitle}>Patient Connections</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Pair New Patient"
          hitSlop={12}
          onPress={() => router.push("/nonpatient/dashboard/scan-patient")}
          style={styles.headerRightButton}
        >
          <Ionicons name="qr-code-outline" size={22} color="#0AA7A8" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Header */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Connected Patients</Text>
          <Text style={styles.subtitle}>
            Select which patient's real-time vitals and notifications you want to monitor on your dashboard.
          </Text>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.listTitle}>
            All Paired Patients ({connections.length})
          </Text>
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0AA7A8" />
            <Text style={styles.loadingText}>Loading patient connections...</Text>
          </View>
        ) : connections.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="people-outline" size={38} color="#0AA7A8" />
            </View>
            <Text style={styles.emptyTitle}>No Patients Connected</Text>
            <Text style={styles.emptyText}>
              Scan a patient's QR code or enter their connection code to start monitoring their status.
            </Text>
            <TouchableOpacity
              style={styles.emptyPairButton}
              onPress={() => router.push("/nonpatient/dashboard/scan-patient")}
              activeOpacity={0.8}
            >
              <Ionicons name="qr-code-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.emptyPairButtonText}>Pair Patient Device</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cardsList}>
            {connections.map((connection, index) => {
              const resident = connection.patient;
              const name = getResidentName(resident);
              const initials = getInitials(resident);
              const isCurrent =
                Boolean(resident?.id && resident.id === activePatientId) &&
                connection.status !== "DISCONNECTED";
              const isSwitching = switchingId === resident?.id;

              return (
                <View
                  key={connection.id ?? resident?.id ?? index}
                  style={[
                    styles.residentCard,
                    isCurrent && styles.residentCardActive,
                  ]}
                >
                  {/* Top Status Strip */}
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.avatarWrap}>
                      <View
                        style={[
                          styles.avatarCircle,
                          isCurrent && styles.avatarCircleActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.avatarText,
                            isCurrent && styles.avatarTextActive,
                          ]}
                        >
                          {initials}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.residentCopy}>
                      <Text style={styles.patientName}>{name}</Text>
                      <Text style={styles.statusDescription}>
                        {isCurrent
                          ? "Active Monitored Patient"
                          : "Paired Patient"}
                      </Text>
                    </View>

                    {/* Role / Status Badge */}
                    <View
                      style={[
                        styles.statusBadge,
                        isCurrent
                          ? styles.statusBadgeCurrent
                          : styles.statusBadgePaired,
                      ]}
                    >
                      <View
                        style={[
                          styles.statusDot,
                          isCurrent
                            ? styles.statusDotCurrent
                            : styles.statusDotPaired,
                        ]}
                      />
                      <Text
                        style={[
                          styles.statusBadgeText,
                          isCurrent
                            ? styles.statusBadgeTextCurrent
                            : styles.statusBadgeTextPaired,
                        ]}
                      >
                        {isCurrent ? "Current Patient" : "Paired Patient"}
                      </Text>
                    </View>
                  </View>

                  {/* Active Indicator Notice */}
                  {isCurrent && (
                    <View style={styles.currentPatientNotice}>
                      <Ionicons name="radio" size={14} color="#0D9488" style={{ marginRight: 6 }} />
                      <Text style={styles.currentPatientNoticeText}>
                        Showing live heart rate, temperature, and alerts on dashboard
                      </Text>
                    </View>
                  )}

                  {/* Divider */}
                  <View style={styles.cardDivider} />

                  {/* Action Buttons */}
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.disconnectButton}
                      onPress={() =>
                        setModalState({
                          visible: true,
                          type: "confirm",
                          isDestructive: true,
                          title: "Disconnect Patient?",
                          message: `Are you sure you want to unlink ${name}? You will no longer receive their emergency alerts or telemetry.`,
                          confirmText: "Disconnect",
                          cancelText: "Cancel",
                          onCancel: () =>
                            setModalState((prev) => ({ ...prev, visible: false })),
                          onConfirm: async () => {
                            setModalState((prev) => ({ ...prev, visible: false }));
                            await handleDisconnect(connection?.patient?.id, user?.id);
                          },
                        })
                      }
                      activeOpacity={0.7}
                    >
                      <Ionicons name="close-circle-outline" size={16} color="#EF4444" style={{ marginRight: 4 }} />
                      <Text style={styles.disconnectText}>Disconnect</Text>
                    </TouchableOpacity>

                    {isCurrent ? (
                      <View style={styles.activeIndicatorButton}>
                        <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                        <Text style={styles.activeIndicatorText}>Current Patient</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        disabled={isSwitching}
                        style={styles.switchButton}
                        onPress={() => handleSelectPatient(resident?.id)}
                        activeOpacity={0.8}
                      >
                        {isSwitching ? (
                          <ActivityIndicator size="small" color="#0AA7A8" />
                        ) : (
                          <>
                            <Ionicons name="swap-horizontal" size={16} color="#0AA7A8" style={{ marginRight: 6 }} />
                            <Text style={styles.switchButtonText}>Set as Current</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}

            {/* Pair Another Patient Button */}
            <TouchableOpacity
              style={styles.addPatientButton}
              onPress={() => router.push("/nonpatient/dashboard/scan-patient")}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle-outline" size={20} color="#0AA7A8" style={{ marginRight: 8 }} />
              <Text style={styles.addPatientText}>Pair Another Patient</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Universal Alert & Confirmation Modal */}
      <CustomAlertModal
        visible={modalState.visible}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        isDestructive={modalState.isDestructive}
        onConfirm={modalState.onConfirm || (() => setModalState((prev) => ({ ...prev, visible: false })))}
        onCancel={modalState.onCancel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  backgroundAccent: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 260,
    height: 220,
    borderRadius: 130,
    backgroundColor: "#EDFBFB",
    opacity: 0.9,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  headerRightButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    color: "#0F172A",
    fontSize: 22,
    fontWeight: "800",
  },
  subtitle: {
    color: "#64748B",
    fontSize: 13.5,
    marginTop: 4,
    lineHeight: 19,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  listTitle: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  loaderContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: "#64748B",
  },
  cardsList: {
    gap: 14,
  },
  residentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  residentCardActive: {
    borderColor: "#0AA7A8",
    backgroundColor: "#FFFFFF",
    shadowColor: "#0AA7A8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrap: {
    marginRight: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F1F5F9",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarCircleActive: {
    backgroundColor: "#EDFBFB",
    borderColor: "#99F6E4",
  },
  avatarText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#64748B",
  },
  avatarTextActive: {
    color: "#0AA7A8",
  },
  residentCopy: {
    flex: 1,
    marginRight: 8,
  },
  patientName: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  statusDescription: {
    color: "#64748B",
    fontSize: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeCurrent: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  statusBadgePaired: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  statusDotCurrent: {
    backgroundColor: "#10B981",
  },
  statusDotPaired: {
    backgroundColor: "#94A3B8",
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusBadgeTextCurrent: {
    color: "#065F46",
  },
  statusBadgeTextPaired: {
    color: "#64748B",
  },
  currentPatientNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDFA",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginTop: 12,
  },
  currentPatientNoticeText: {
    flex: 1,
    fontSize: 11.5,
    color: "#0F766E",
    fontWeight: "600",
    lineHeight: 16,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  disconnectButton: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECDD3",
    backgroundColor: "#FFF1F2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  disconnectText: {
    color: "#E11D48",
    fontSize: 13.5,
    fontWeight: "600",
  },
  activeIndicatorButton: {
    flex: 1.4,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#0AA7A8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0AA7A8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  activeIndicatorText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "700",
  },
  switchButton: {
    flex: 1.4,
    height: 42,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#0AA7A8",
    backgroundColor: "#F0FDFA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  switchButtonText: {
    color: "#0AA7A8",
    fontSize: 13.5,
    fontWeight: "700",
  },
  emptyState: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 20,
    borderWidth: 1,
    padding: 32,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#EDFBFB",
    borderWidth: 1.5,
    borderColor: "#B2EBF2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyTitle: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  emptyText: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginBottom: 20,
  },
  emptyPairButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0AA7A8",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "100%",
  },
  emptyPairButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  addPatientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#0AA7A8",
    paddingVertical: 14,
    marginTop: 8,
    shadowColor: "#0AA7A8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  addPatientText: {
    color: "#0AA7A8",
    fontSize: 14.5,
    fontWeight: "700",
  },
});
