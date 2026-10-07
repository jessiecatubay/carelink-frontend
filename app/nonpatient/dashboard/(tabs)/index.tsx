import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/lib/axios";
import {
  initSocket,
  onConnectionUpdated,
  onPatientConnectionStatus,
  onPatientVitals,
} from "@/hooks/lib/socket";
import { vitalResponseSchema } from "@/schema/api";
import { User, Vital } from "@/types/user";
import {
  formatPhilippineDate,
  formatPhilippineTime,
  isSamePhilippineDay,
} from "@/utils/date";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CurrentVitals from "@/components/feature/nonpatient/dashboard/CurrentVitals";
import DashboardHeader from "@/components/feature/nonpatient/dashboard/DashboardHeader";
import LastUpdatedCard from "@/components/feature/nonpatient/dashboard/LastUpdatedCard";
import PatientCard from "@/components/feature/nonpatient/dashboard/PatientCard";
import PatientCurrentStatus from "@/components/feature/nonpatient/dashboard/PatientCurrentStatus";
import QuickActions from "@/components/feature/nonpatient/dashboard/QuickActions";
import RecentActivity from "@/components/feature/nonpatient/dashboard/RecentActivity";
import VitalCard from "@/components/feature/nonpatient/dashboard/VitalCard";
import ConnectPatientPromptModal from "@/components/ui/ConnectPatientPromptModal";
import DashboardFeatureTour from "@/components/ui/DashboardFeatureTour";
import PillReminderModal from "@/components/feature/nonpatient/dashboard/PillReminderModal";

const MAX_HISTORY = 8;
const TOUR_STORAGE_KEY = "@carelink_dashboard_tour_completed_v1";

type PillReminder = {
  id: string;
  title: string;
  description: string | null;
  scheduledAt: string;
  status: "PENDING" | "SENT" | "CANCELLED";
};

export default function Home() {
  const router = useRouter();
  const { startTour } = useLocalSearchParams<{ startTour?: string }>();
  const { user } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);

  const [heartRate, setHeartRate] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [heartHistory, setHeartHistory] = useState<number[]>([]);
  const [tempHistory, setTempHistory] = useState<number[]>([]);
  const [patient, setPatient] = useState<User>();
  const [connected, setConnected] = useState<string>("DISCONNECTED");
  const [patientInternetStatus, setPatientInternetStatus] = useState<
    "CONNECTED" | "DISCONNECTED"
  >("DISCONNECTED");
  const [patientLoading, setPatientLoading] = useState(true);
  const [pillReminders, setPillReminders] = useState<PillReminder[]>([]);
  const [showPillReminderModal, setShowPillReminderModal] = useState(false);

  // Connection Prompt & Feature Spotlight Tour States
  const [showConnectPrompt, setShowConnectPrompt] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);

  const getUserById = useCallback(async () => {
    if (!user?.id) return;
    setPatientLoading(true);

    try {
      const result = await axiosInstance.post("/api/user/v1/get-user-by-id", {
        id: user.id,
      });
      const connections = result.data.data.nonPatientConnections;

      let activePatient: User | undefined;

      if (Array.isArray(connections) && connections.length > 0) {
        const found =
          connections.find((c: any) => c.currentPatient && c.patient) ||
          connections.find((c: any) => c.patient) ||
          connections[0];

        if (found?.patient) {
          activePatient = found.patient;
          setPatient(found.patient);
          setConnected(found.status || "CONNECTED");
        }
      }

      // 1. If user has no connected patient -> force connect prompt
      if (!activePatient) {
        setPatient(undefined);
        setShowConnectPrompt(true);
      } else {
        setShowConnectPrompt(false);
        // 2. Once patient is connected, start feature tour if not completed or explicitly requested
        const tourDone = await AsyncStorage.getItem(TOUR_STORAGE_KEY);
        if (!tourDone || startTour === "true") {
          setTimeout(() => {
            setIsTourActive(true);
            setTourStepIndex(0);
          }, 600);
        }
      }
    } catch (error) {
      console.error("Failed to get patient:", error);
    } finally {
      setPatientLoading(false);
    }
  }, [user?.id, startTour]);

  useEffect(() => {
    const off = onPatientConnectionStatus((payload) => {
      console.log("🌐 Patient connection status:", payload);

      if (patient?.id !== payload.patientId) {
        return;
      }

      setPatientInternetStatus(payload.status);
    });

    console.log("📡 CURRENT PATIENT INTERNET STATUS:", patientInternetStatus);

    return () => {
      off();
    };
  }, [patient?.id]);

  useEffect(() => {
    if (!patient) return;

    const getPatientVitalsHistory = async () => {
      try {
        const result = await axiosInstance.get(
          "/api/device/v1/get-recent-vitals",
        );

        console.log(
          "GetResultData: ",
          JSON.stringify(result.data.data, null, 2),
        );

        const parsedVitals = vitalResponseSchema
          .array()
          .safeParse(result.data.data);
        if (!parsedVitals.success || parsedVitals.data.length === 0) {
          console.warn("Received invalid or empty patient vitals response");
          return;
        }

        const vitals: Vital[] = parsedVitals.data;

        const temperatures = vitals.map((vital: Vital) => vital.temperature);
        const heartRates = vitals.map((vital: Vital) => vital.heartRate);
        const lastUpdated = vitals.map((vital: Vital) => vital.recordedAt);
        const batteryLevels = vitals.map((vital: Vital) => vital.batteryLevel);

        const formatLastUpdated = (dateString: string): string => {
          if (isSamePhilippineDay(dateString, new Date().toISOString())) {
            return `Today ${formatPhilippineTime(dateString)}`;
          }

          return `${formatPhilippineDate(dateString)} ${formatPhilippineTime(dateString)}`;
        };

        const formattedTime = formatLastUpdated(lastUpdated[0]);

        const reversedTemps = [...temperatures].reverse();
        const reversedHeartRates = [...heartRates].reverse();

        setTemperature(reversedTemps[4] ?? reversedTemps[0]);
        setHeartRate(reversedHeartRates[4] ?? reversedHeartRates[0]);
        setTempHistory(reversedTemps);
        setHeartHistory(reversedHeartRates);

        setLastUpdated(formattedTime);
        setBatteryLevel(batteryLevels[0] ?? null);
      } catch (error) {
        console.error("Failed to get patient vitals:", error);
      }
    };

    getPatientVitalsHistory();
  }, [patient]);

  useEffect(() => {
    if (!patient?.id) {
      setPillReminders([]);
      return;
    }

    let isCurrent = true;
    axiosInstance
      .get("/api/pill-reminders/v1/list", { params: { patientId: patient.id } })
      .then((result) => {
        if (!isCurrent) return;
        const reminders = result.data?.data;
        setPillReminders(Array.isArray(reminders) ? reminders : []);
      })
      .catch((error) => {
        console.error("Failed to get pill reminders:", error);
        if (isCurrent) setPillReminders([]);
      });

    return () => {
      isCurrent = false;
    };
  }, [patient?.id]);

  const savePillReminder = async (
    title: string,
    description: string,
    scheduledAt: Date,
  ) => {
    if (!patient?.id) {
      throw new Error("Connect a patient before creating a pill reminder.");
    }

    const result = await axiosInstance.post("/api/pill-reminders/v1/create", {
      patientId: patient.id,
      title,
      description,
      scheduledAt: scheduledAt.toISOString(),
    });

    if (result.data?.status !== "success" || !result.data.data) {
      throw new Error(result.data?.message || "Unable to save this reminder.");
    }

    setPillReminders((current) =>
      [...current, result.data.data].sort(
        (first, second) =>
          new Date(first.scheduledAt).getTime() -
          new Date(second.scheduledAt).getTime(),
      ),
    );
  };

  useEffect(() => {
    initSocket();

    const off = onPatientVitals((payload: any) => {
      if (!payload) return;

      if (typeof payload.heartRate === "number") {
        setHeartRate(payload.heartRate);
        setHeartHistory((prev) => {
          const next = [...prev, payload.heartRate];
          return next.slice(-MAX_HISTORY);
        });
      }

      if (typeof payload.temperature === "number") {
        setTemperature(payload.temperature);
        setTempHistory((prev) => {
          const next = [...prev, payload.temperature];
          return next.slice(-MAX_HISTORY);
        });
      }

      if (payload.receivedAt) {
        setLastUpdated(
          isSamePhilippineDay(payload.receivedAt, new Date().toISOString())
            ? `Today, ${formatPhilippineTime(payload.receivedAt)}`
            : `${formatPhilippineDate(payload.receivedAt)} ${formatPhilippineTime(payload.receivedAt)}`,
        );

        setBatteryLevel(payload.batteryLevel ?? null);
      }

      console.log("Received patientVitals via socket", payload);
    });

    return () => {
      off?.();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      getUserById();
    }, [getUserById]),
  );

  useEffect(() => {
    getUserById();
  }, [getUserById]);

  useEffect(() => {
    const socket = initSocket();

    if (!socket) {
      console.log("No socket id", socket);
      return;
    }

    console.log("NON-PATIENT SOCKET:", socket.id);

    const offConn = onConnectionUpdated((payload) => {
      console.log(
        "🔗 Real-time connection update received in NonPatient dashboard:",
        payload,
      );
      getUserById();
    });

    socket.on("patientAlert", (payload) => {
      console.log("🔥 NON-PATIENT RECEIVED:", payload);
    });

    socket.on("patientConnectionStatus", (payload) => {
      console.log("🌐 PATIENT CONNECTION STATUS:", payload);
    });

    return () => {
      offConn();
      socket.off("patientAlert");
    };
  }, [getUserById]);

  // Handle tour step changes & auto-scroll to feature
  const handleTourStep = (newIndex: number) => {
    setTourStepIndex(newIndex);

    const scrollTargets = [0, 90, 290, 470, 680];
    const targetY = scrollTargets[newIndex] ?? 0;

    scrollViewRef.current?.scrollTo({
      y: targetY,
      animated: true,
    });
  };

  const handleFinishTour = async () => {
    try {
      await AsyncStorage.setItem(TOUR_STORAGE_KEY, "true");
    } catch (e) {
      console.log("Tour save error:", e);
    }
    setIsTourActive(false);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <DashboardHeader />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.scrollContainer,
          isTourActive && styles.scrollContainerDuringTour,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 1 Highlight: Patient Card */}
        <View
          style={[
            styles.featureWrapper,
            isTourActive && tourStepIndex === 0 && styles.spotlightActive,
          ]}
        >
          {isTourActive && tourStepIndex === 0 ? (
            <View style={[styles.spotlightTag, { backgroundColor: "#0284C7" }]}>
              <Text style={styles.spotlightTagText}>
                ✦ CURRENT FEATURE: PATIENT STATUS ✦
              </Text>
            </View>
          ) : null}
          <PatientCard
            name={
              patient
                ? `${patient.firstName ?? ""} ${patient.lastName ?? ""}`.trim()
                : patientLoading
                  ? "Loading patient..."
                  : "No patient connected"
            }
            internetStatus={patient ? patientInternetStatus : "DISCONNECTED"}
            onPress={() => router.push("/nonpatient/dashboard/manage-patients")}
          />
        </View>

        {/* Step 2 Highlight: Current Vitals & Graphs */}
        <View
          style={[
            styles.featureWrapper,
            isTourActive && tourStepIndex === 1 && styles.spotlightActive,
          ]}
        >
          {isTourActive && tourStepIndex === 1 ? (
            <View style={[styles.spotlightTag, { backgroundColor: "#F16A66" }]}>
              <Text style={styles.spotlightTagText}>
                ✦ CURRENT FEATURE: REAL-TIME VITALS ✦
              </Text>
            </View>
          ) : null}
          <CurrentVitals />

          <View style={styles.vitalsGrid}>
            <VitalCard
              label="Heart Rate"
              value={heartRate}
              unit=" BPM"
              icon={require("@/assets/icons/cardiogram.png")}
              color="#12A5B5"
              backgroundColor="#F0FCFD"
              rangeDetail="60 - 100 BPM"
              history={heartHistory}
              chartGradientId="hrGradient"
              tickType="heart"
            />
            <VitalCard
              label="Temperature"
              value={temperature}
              unit=" °C"
              icon={require("@/assets/icons/temperature.png")}
              color="#F16A66"
              backgroundColor="#FFF5F5"
              rangeDetail="36.0 - 37.5 °C"
              history={tempHistory}
              chartGradientId="tempGradient"
              tickType="temp"
            />
          </View>
        </View>

        {/* Step 3 Highlight: Patient Posture & Safety Status */}
        <View
          style={[
            styles.featureWrapper,
            isTourActive && tourStepIndex === 2 && styles.spotlightActive,
          ]}
        >
          {isTourActive && tourStepIndex === 2 ? (
            <View style={[styles.spotlightTag, { backgroundColor: "#10B981" }]}>
              <Text style={styles.spotlightTagText}>
                ✦ CURRENT FEATURE: POSTURE & SAFETY ✦
              </Text>
            </View>
          ) : null}
          <PatientCurrentStatus patientId={patient?.id} />
          <LastUpdatedCard
            lastUpdated={lastUpdated}
            batteryLevel={batteryLevel}
          />
        </View>

        {/* Step 4 Highlight: Quick Actions & AI Help */}
        <View
          style={[
            styles.featureWrapper,
            isTourActive && tourStepIndex === 3 && styles.spotlightActive,
          ]}
        >
          {isTourActive && tourStepIndex === 3 ? (
            <View style={[styles.spotlightTag, { backgroundColor: "#D97706" }]}>
              <Text style={styles.spotlightTagText}>
                ✦ CURRENT FEATURE: AI & ALERTS ✦
              </Text>
            </View>
          ) : null}
          <QuickActions
            onNotificationPress={() =>
              router.push("/nonpatient/dashboard/alerts")
            }
            onAiHelpPress={() => router.push("/nonpatient/dashboard/ai-help")}
          />
        </View>

        {/* Step 5 Highlight: Recent Activity Feed */}
        <View
          style={[
            styles.featureWrapper,
            isTourActive && tourStepIndex === 4 && styles.spotlightActive,
          ]}
        >
          {isTourActive && tourStepIndex === 4 ? (
            <View style={[styles.spotlightTag, { backgroundColor: "#8B5CF6" }]}>
              <Text style={styles.spotlightTagText}>
                ✦ CURRENT FEATURE: ACTIVITY LOG ✦
              </Text>
            </View>
          ) : null}
          <RecentActivity patientId={patient?.id} />
        </View>

        <View style={styles.remindersSection}>
          <View style={styles.remindersHeadingRow}>
            <View>
              <Text style={styles.remindersEyebrow}>CARE PLAN</Text>
              <Text style={styles.remindersHeading}>Pill reminders</Text>
            </View>
            <Text style={styles.remindersCount}>{pillReminders.length}</Text>
          </View>
          {pillReminders.length ? (
            pillReminders.map((reminder) => (
              <View key={reminder.id} style={styles.reminderRow}>
                <View style={styles.reminderIcon}>
                  <Ionicons name="medical-outline" size={18} color="#0B8F91" />
                </View>
                <View style={styles.reminderCopy}>
                  <Text style={styles.reminderTitle}>{reminder.title}</Text>
                  {reminder.description ? (
                    <Text style={styles.reminderDescription} numberOfLines={2}>
                      {reminder.description}
                    </Text>
                  ) : null}
                  <Text style={styles.reminderTime}>
                    {isSamePhilippineDay(
                      reminder.scheduledAt,
                      new Date().toISOString(),
                    )
                      ? `Today, ${formatPhilippineTime(reminder.scheduledAt)}`
                      : `${formatPhilippineDate(reminder.scheduledAt)} ${formatPhilippineTime(reminder.scheduledAt)}`}
                  </Text>
                </View>
                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingBadgeText}>{reminder.status}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyReminders}>
              No pill reminders scheduled.
            </Text>
          )}
        </View>
      </ScrollView>

      {!isTourActive ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add pill reminder"
          onPress={() => setShowPillReminderModal(true)}
          disabled={!patient?.id}
          style={({ pressed }) => [
            styles.addReminderButton,
            !patient?.id && styles.addReminderButtonDisabled,
            pressed && patient?.id && styles.addReminderButtonPressed,
          ]}
        >
          <Ionicons name="add" size={30} color="#FFFFFF" />
        </Pressable>
      ) : null}

      <PillReminderModal
        visible={showPillReminderModal}
        onClose={() => setShowPillReminderModal(false)}
        onSave={savePillReminder}
      />

      {/* Mandatory Modal: Connect Patient First */}
      <ConnectPatientPromptModal
        role="NON_PATIENT"
        visible={!patientLoading && showConnectPrompt && !patient}
        onScanQR={() => {
          router.push("/nonpatient/dashboard/scan-patient");
        }}
        onEnterCode={() => {
          router.push("/(protected)/device-pairing");
        }}
        onOpenSettings={() => {
          router.push("/nonpatient/dashboard/settings");
        }}
      />

      {/* Interactive In-Place Feature Tour with Explanations */}
      {isTourActive ? (
        <DashboardFeatureTour
          currentStepIndex={tourStepIndex}
          onNext={() => {
            if (tourStepIndex < 4) {
              handleTourStep(tourStepIndex + 1);
            } else {
              handleFinishTour();
            }
          }}
          onPrev={() => {
            if (tourStepIndex > 0) {
              handleTourStep(tourStepIndex - 1);
            }
          }}
          onFinish={handleFinishTour}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FAFBFD",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  scrollContainerDuringTour: {
    paddingBottom: 320,
  },
  featureWrapper: {
    marginBottom: 16,
    borderRadius: 20,
  },
  spotlightActive: {
    borderWidth: 2.5,
    borderColor: "#0AA7A8",
    borderRadius: 20,
    padding: 4,
    backgroundColor: "#FFFFFF",
    shadowColor: "#0AA7A8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  spotlightTag: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 8,
    marginTop: 2,
  },
  spotlightTagText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  vitalsGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  remindersSection: {
    marginBottom: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#E3ECEE",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
  },
  remindersHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  remindersEyebrow: {
    color: "#0B8F91",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  remindersHeading: {
    marginTop: 3,
    color: "#172B35",
    fontSize: 18,
    fontWeight: "800",
  },
  remindersCount: {
    minWidth: 28,
    height: 28,
    overflow: "hidden",
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 14,
    backgroundColor: "#E8F7F6",
    color: "#0B8F91",
    fontSize: 13,
    fontWeight: "800",
  },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#EDF2F3",
  },
  reminderIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: "#E8F7F6",
  },
  reminderCopy: {
    flex: 1,
  },
  reminderTitle: {
    color: "#243B45",
    fontSize: 14,
    fontWeight: "700",
  },
  reminderDescription: {
    marginTop: 3,
    color: "#647780",
    fontSize: 12,
    lineHeight: 17,
  },
  reminderTime: {
    marginTop: 4,
    color: "#0B8F91",
    fontSize: 12,
    fontWeight: "700",
  },
  pendingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#FFF4DF",
  },
  pendingBadgeText: {
    color: "#986515",
    fontSize: 9,
    fontWeight: "800",
  },
  emptyReminders: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#EDF2F3",
    color: "#70828A",
    fontSize: 13,
  },
  addReminderButton: {
    position: "absolute",
    right: 22,
    bottom: 20,
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 29,
    backgroundColor: "#0B8F91",
    shadowColor: "#12383B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.24,
    shadowRadius: 8,
    elevation: 7,
  },
  addReminderButtonDisabled: {
    opacity: 0.5,
  },
  addReminderButtonPressed: {
    transform: [{ scale: 0.96 }],
  },
});
