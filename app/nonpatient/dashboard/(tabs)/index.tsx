import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/lib/axios";
import { initSocket, onPatientVitals } from "@/hooks/lib/socket";
import { vitalResponseSchema } from "@/schema/api";
import { User, Vital } from "@/types/user";
import { useEffect, useState } from "react";

import CurrentVitals from "@/components/feature/nonpatient/dashboard/CurrentVitals";
import DashboardHeader from "@/components/feature/nonpatient/dashboard/DashboardHeader";
import LastUpdatedCard from "@/components/feature/nonpatient/dashboard/LastUpdatedCard";
import PatientCard from "@/components/feature/nonpatient/dashboard/PatientCard";
import PatientCurrentStatus from "@/components/feature/nonpatient/dashboard/PatientCurrentStatus";
import QuickActions from "@/components/feature/nonpatient/dashboard/QuickActions";
import RecentActivity from "@/components/feature/nonpatient/dashboard/RecentActivity";
import VitalCard from "@/components/feature/nonpatient/dashboard/VitalCard";

const MAX_HISTORY = 8;

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [heartRate, setHeartRate] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [heartHistory, setHeartHistory] = useState<number[]>([]);
  const [tempHistory, setTempHistory] = useState<number[]>([]);
  const [patient, setPatient] = useState<User>();
  const [connected, setConnected] = useState<string>("DISCONNECTED");

  useEffect(() => {
    const getPatientVitalsHistory = async () => {
      const result = await axiosInstance.get(
        "/api/device/v1/get-recent-vitals",
      );

      console.log("GetResultData: ", JSON.stringify(result.data.data, null, 2));

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

      const formatLastUpdated = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();

        const time = date
          .toLocaleTimeString("en-PH", {
            timeZone: "Asia/Manila",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
          .toLowerCase();

        const datePH = date.toLocaleDateString("en-PH", {
          timeZone: "Asia/Manila",
        });

        const todayPH = now.toLocaleDateString("en-PH", {
          timeZone: "Asia/Manila",
        });

        if (datePH === todayPH) {
          return `Today ${time}`;
        }

        return `${datePH} ${time}`;
      };

      const formattedTime = formatLastUpdated(lastUpdated[0]);

      const reversedTemps = [...temperatures].reverse();
      const reversedHeartRates = [...heartRates].reverse();

      setTemperature(reversedTemps[4]);
      setHeartRate(reversedHeartRates[4]);
      setTempHistory(reversedTemps);
      setHeartHistory(reversedHeartRates);

      setLastUpdated(formattedTime);
    };

    getPatientVitalsHistory();
  }, [heartRate, temperature]);

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
        const date = new Date(payload.receivedAt);
        const today = new Date();
        const sameDay =
          date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth() &&
          date.getDate() === today.getDate();

        const formattedTime = date.toLocaleTimeString("en-PH", {
          timeZone: "Asia/Manila",
          hour: "numeric",
          minute: "2-digit",
        });

        setLastUpdated(
          sameDay
            ? `Today, ${formattedTime}`
            : `${date.toLocaleDateString()} ${formattedTime}`,
        );
      }

      console.log("Received patientVitals via socket", payload);
    });

    return () => {
      off?.();
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const getUserById = async () => {
      try {
        const result = await axiosInstance.post("/api/user/v1/get-user-by-id", {
          id: user.id,
        });
        const connections = result.data.data.nonPatientConnections;

        console.log(
          "lafdsjhfoaweflsfkeasd",
          JSON.stringify(connections, null, 2),
        );

        if (!connections) return;

        for (const connection of connections) {
          if (!connection.currentPatient) {
            continue;
          }

          setPatient(connection.patient);
          setConnected(connection.status);
          break;
        }
      } catch (error) {
        console.error("Failed to get patient:", error);
      }
    };

    getUserById();
  }, [user?.id]);

  useEffect(() => {
    const socket = initSocket();

    if (!socket) {
      console.log("No socket id", socket);
      return;
    }

    console.log("NON-PATIENT SOCKET:", socket.id);

    socket!.on("patientAlert", (payload) => {
      console.log("🔥 NON-PATIENT RECEIVED:", payload);
    });

    return () => {
      socket!.off("patientAlert");
    };
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <DashboardHeader />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <PatientCard
          name={`${patient?.firstName ?? ""} ${patient?.lastName ?? ""}`.trim()}
          status={connected}
          onPress={() => router.push("/nonpatient/dashboard/manage-patients")}
        />
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

        <PatientCurrentStatus patientId={patient?.id} />

        <LastUpdatedCard lastUpdated={lastUpdated} />

        <QuickActions
          onNotificationPress={() =>
            router.push("/nonpatient/dashboard/alerts")
          }
          onAiHelpPress={() => router.push("/nonpatient/dashboard/ai-help")}
        />

        <RecentActivity patientId={patient?.id}/>
      </ScrollView>
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
  vitalsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
});
