import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/lib/axios";
import { initSocket, onConnectionUpdated } from "@/hooks/lib/socket";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type CaregiverConnection = {
  id: string;
  patientId: string;
  nonPatientId: string;
  status: "CONNECTED" | "DISCONNECTED";
  currentPatient?: boolean;
  createdAt: string;
  updatedAt: string;
  nonPatient?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    role?: string | null;
    createdAt?: string | null;
    nonPatientProfile?: {
      relationship?: string | null;
      emergencyContact?: string | null;
    } | null;
  } | null;
};

export default function ConnectedCaregiversScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [connections, setConnections] = useState<CaregiverConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCaregivers = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/api/patient-nonpatient/v1/connected-caregivers",
        { patientId: user.id },
      );

      if (response.data?.status === "success" && Array.isArray(response.data?.data)) {
        setConnections(response.data.data);
      } else {
        // Fallback: try get-user-by-id
        const userRes = await axiosInstance.post("/api/user/v1/get-user-by-id", {
          id: user.id,
        });
        const userConns = userRes.data?.data?.patientConnections || [];
        setConnections(userConns);
      }
    } catch (error) {
      console.error("Failed to load connected caregivers:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchCaregivers();
  }, [fetchCaregivers]);

  useEffect(() => {
    initSocket();
    const off = onConnectionUpdated((payload) => {
      console.log("🔗 Real-time caregiver connection update in Caregiver Screen:", payload);
      fetchCaregivers();
    });

    return () => {
      off();
    };
  }, [fetchCaregivers]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCaregivers();
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/patient/dashboard/settings");
    }
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const f = (firstName || "").trim().charAt(0).toUpperCase();
    const l = (lastName || "").trim().charAt(0).toUpperCase();
    return f || l ? `${f}${l}` : "CG";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently connected";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently connected";
    }
  };

  const handleCall = (phoneNumber?: string | null) => {
    if (!phoneNumber) return;
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      console.log("Unable to place call to:", phoneNumber);
    });
  };

  const handleEmail = (email?: string | null) => {
    if (!email) return;
    Linking.openURL(`mailto:${email}`).catch(() => {
      console.log("Unable to open mail client for:", email);
    });
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      <View style={styles.backgroundAccent} pointerEvents="none" />

      {/* Navigation Header */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={handleGoBack}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color="#0AA7A8" />
        </Pressable>

        <Text style={styles.headerTitle}>Connected Caregivers</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Show My QR Code"
          hitSlop={12}
          onPress={() => router.push("/(protected)/my-qr-code")}
          style={styles.headerButton}
        >
          <Ionicons name="qr-code-outline" size={22} color="#0AA7A8" />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0AA7A8" />
          <Text style={styles.loadingText}>Loading connected caregivers...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#0AA7A8"
            />
          }
        >
          {/* Notification Alert Broadcast Notice Banner */}
          <View style={styles.noticeBanner}>
            <View style={styles.noticeIconContainer}>
              <Ionicons name="notifications-outline" size={22} color="#0AA7A8" />
            </View>
            <View style={styles.noticeTextContainer}>
              <View style={styles.noticeHeaderRow}>
                <Text style={styles.noticeTitle}>Alert Distribution Network</Text>
                <View style={styles.activeDotBadge}>
                  <View style={styles.activeDot} />
                  <Text style={styles.activeDotText}>Active</Text>
                </View>
              </View>
              <Text style={styles.noticeSubtitle}>
                Whenever you press <Text style={styles.highlightText}>Food</Text>,{" "}
                <Text style={styles.highlightText}>Water</Text>,{" "}
                <Text style={styles.highlightText}>Assistance</Text>, or{" "}
                <Text style={styles.emergencyText}>Emergency</Text> on your remote,
                these users receive instant notifications and alert alarms.
              </Text>
            </View>
          </View>

          {/* Connected Count Bar */}
          <View style={styles.countRow}>
            <Text style={styles.countTitle}>
              {connections.length} {connections.length === 1 ? "Caregiver" : "Caregivers"} Connected
            </Text>
            <TouchableOpacity
              style={styles.qrLinkButton}
              onPress={() => router.push("/(protected)/my-qr-code")}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle-outline" size={16} color="#0AA7A8" />
              <Text style={styles.qrLinkText}>Pair More</Text>
            </TouchableOpacity>
          </View>

          {/* List of Connected Users */}
          {connections.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="people-outline" size={44} color="#0AA7A8" />
              </View>
              <Text style={styles.emptyTitle}>No Caregivers Connected Yet</Text>
              <Text style={styles.emptySubtitle}>
                No family member or caregiver has paired with your device yet. Share your QR code so they can scan it and start receiving your alerts.
              </Text>
              <TouchableOpacity
                style={styles.pairButton}
                onPress={() => router.push("/(protected)/my-qr-code")}
                activeOpacity={0.8}
              >
                <Ionicons name="qr-code-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.pairButtonText}>Show My QR Code</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cardsList}>
              {connections.map((conn, index) => {
                const np = conn.nonPatient;
                const firstName = np?.firstName || "";
                const lastName = np?.lastName || "";
                const fullName =
                  [firstName, lastName].filter(Boolean).join(" ") || "Caregiver";
                const email = np?.email || "No email available";
                const relationship =
                  np?.nonPatientProfile?.relationship || "Family / Caregiver";
                const phone = np?.nonPatientProfile?.emergencyContact;
                const initials = getInitials(firstName, lastName);
                const connectedDate = formatDate(conn.createdAt);

                return (
                  <View key={conn.id || `conn-${index}`} style={styles.caregiverCard}>
                    {/* Top Row: Avatar, Name, Relationship */}
                    <View style={styles.cardHeaderRow}>
                      <View style={styles.avatarCircle}>
                        <Text style={styles.avatarText}>{initials}</Text>
                      </View>

                      <View style={styles.infoCol}>
                        <View style={styles.nameRow}>
                          <Text style={styles.caregiverName} numberOfLines={1}>
                            {fullName}
                          </Text>
                        </View>
                        <View style={styles.relationshipPill}>
                          <Text style={styles.relationshipText}>{relationship}</Text>
                        </View>
                      </View>

                      <View style={styles.receivingBadge}>
                        <Ionicons name="checkmark-circle" size={14} color="#059669" />
                        <Text style={styles.receivingBadgeText}>Receiving</Text>
                      </View>
                    </View>

                    {/* Divider */}
                    <View style={styles.cardDivider} />

                    {/* Details: Email & Phone */}
                    <View style={styles.cardDetails}>
                      <TouchableOpacity
                        style={styles.detailRow}
                        onPress={() => handleEmail(email)}
                        activeOpacity={0.6}
                      >
                        <Ionicons name="mail-outline" size={15} color="#64748B" />
                        <Text style={styles.detailText} numberOfLines={1}>
                          {email}
                        </Text>
                      </TouchableOpacity>

                      {phone ? (
                        <TouchableOpacity
                          style={styles.detailRow}
                          onPress={() => handleCall(phone)}
                          activeOpacity={0.6}
                        >
                          <Ionicons name="call-outline" size={15} color="#0AA7A8" />
                          <Text style={[styles.detailText, styles.phoneText]}>
                            {phone}
                          </Text>
                        </TouchableOpacity>
                      ) : null}

                      <View style={styles.detailRow}>
                        <Ionicons name="time-outline" size={15} color="#94A3B8" />
                        <Text style={styles.dateText}>
                          Connected {connectedDate}
                        </Text>
                      </View>
                    </View>

                    {/* Alert Status Pill */}
                    <View style={styles.alertStatusRow}>
                      <View style={styles.alertStatusBadge}>
                        <Ionicons name="radio" size={12} color="#0AA7A8" style={{ marginRight: 4 }} />
                        <Text style={styles.alertStatusText}>
                          Will be alerted on button press
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Quick Action to Display QR Code */}
          {connections.length > 0 && (
            <TouchableOpacity
              style={styles.secondaryPairButton}
              onPress={() => router.push("/(protected)/my-qr-code")}
              activeOpacity={0.8}
            >
              <Ionicons name="qr-code-outline" size={18} color="#0AA7A8" style={{ marginRight: 8 }} />
              <Text style={styles.secondaryPairText}>Show QR Code to Add Another</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
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
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748B",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  noticeBanner: {
    flexDirection: "row",
    backgroundColor: "#EDFBFB",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#B2EBF2",
    padding: 14,
    marginBottom: 20,
    shadowColor: "#0AA7A8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  noticeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#B2EBF2",
  },
  noticeTextContainer: {
    flex: 1,
  },
  noticeHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0E7490",
  },
  activeDotBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#16A34A",
    marginRight: 4,
  },
  activeDotText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#16A34A",
  },
  noticeSubtitle: {
    fontSize: 12,
    color: "#334155",
    lineHeight: 18,
  },
  highlightText: {
    fontWeight: "700",
    color: "#0891B2",
  },
  emergencyText: {
    fontWeight: "700",
    color: "#EF4444",
  },
  countRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  countTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  qrLinkButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#EDFBFB",
    borderRadius: 12,
  },
  qrLinkText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0AA7A8",
  },
  cardsList: {
    gap: 14,
  },
  caregiverCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#0AA7A8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  caregiverName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  relationshipPill: {
    alignSelf: "flex-start",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 3,
  },
  relationshipText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
  },
  receivingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  receivingBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 12,
  },
  cardDetails: {
    gap: 6,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: "#475569",
  },
  phoneText: {
    color: "#0AA7A8",
    fontWeight: "600",
  },
  dateText: {
    fontSize: 12,
    color: "#94A3B8",
  },
  alertStatusRow: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F8FAFC",
  },
  alertStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDFA",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  alertStatusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#0D9488",
  },
  emptyContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 28,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EDFBFB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#B2EBF2",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  pairButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0AA7A8",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "100%",
    shadowColor: "#0AA7A8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  pairButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  secondaryPairButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#0AA7A8",
    paddingVertical: 14,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  secondaryPairText: {
    color: "#0AA7A8",
    fontSize: 14,
    fontWeight: "700",
  },
});
