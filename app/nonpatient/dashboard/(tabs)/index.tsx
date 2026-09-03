import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import axiosInstance from "@/lib/axios";
import { initSocket, onPatientVitals } from "@/lib/socket";
import { Vital } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

const CHART_WIDTH = 140;
const CHART_HEIGHT = 40;
const MAX_HISTORY = 8;

import DashboardHeader from "@/components/feature/nonpatient/dashboard/DashboardHeader";
import PatientCard from "@/components/feature/nonpatient/dashboard/PatientCard";
import CurrentVitals from "@/components/feature/nonpatient/dashboard/CurrentVitals";
import VitalCard from "@/components/feature/nonpatient/dashboard/VitalCard";
import PatientCurrentStatus from "@/components/feature/nonpatient/dashboard/PatientCurrentStatus";
import LastUpdatedCard from "@/components/feature/nonpatient/dashboard/LastUpdatedCard";
import QuickActions from "@/components/feature/nonpatient/dashboard/QuickActions";
import RecentActivity from "@/components/feature/nonpatient/dashboard/RecentActivity";

const MAX_HISTORY = 8;

export default function Home() {
  const router = useRouter();
  const [heartRate, setHeartRate] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [heartHistory, setHeartHistory] = useState<number[]>([]);
  const [sensorContact, setSensorContact] = useState<boolean>(false);
  const [tempHistory, setTempHistory] = useState<number[]>([]);

  useEffect(() => {
    const getPatientVitalsHistory = async () => {
      const result = await axiosInstance.get(
        "/api/device/v1/get-recent-vitals",
      );

      console.log("GetResultData: ", JSON.stringify(result.data.data, null, 2));

      const vitals: Vital[] = result.data.data;

      const temperatures = vitals.map((vital: Vital) => vital.temperature);
      const heartRates = vitals.map((vital: Vital) => vital.heartRate);
      const lastUpdated = vitals.map((vital: Vital) => vital.recordedAt);
      const sensorContact = vitals.map((vital: Vital) => vital.sensorContact);

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

      const formattedTime = formatLastUpdated(lastUpdatedList[0]);

      const reversedTemps = [...temperatures].reverse();
      const reversedHeartRates = [...heartRates].reverse();

      setTemperature(reversedTemps[4]);
      setHeartRate(reversedHeartRates[4]);
      setSensorContact(sensorContact[0]);

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

  return (
    <SafeAreaView style={styles.screen}>
      <DashboardHeader />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <PatientCard />

        <CurrentVitals />

        <View style={styles.vitalsGrid}>
          {/* Heart Rate Card */}
          <View style={[styles.vitalCard, { backgroundColor: "#F0FCFD" }]}>
            <View style={styles.vitalTop}>
              <View style={styles.vitalIconContainer}>
                <Image
                  source={require("@/assets/icons/cardiogram.png")}
                  style={styles.vitalIcon}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.vitalLabelContainer}>
                <Text style={styles.vitalLabel}>Heart Rate</Text>

                {sensorContact ? (
                  <View style={styles.vitalValueRow}>
                    <Text style={[styles.vitalValue, { color: "#12A5B5" }]}>
                      {heartRate}
                    </Text>
                    <Text style={[styles.vitalUnit, { color: "#12A5B5" }]}>
                      {" "}
                      BPM
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={[
                      styles.vitalUnit,
                      { color: "#12A5B5", fontSize: 16.5 },
                    ]}
                  >
                    Sensor not in contact
                  </Text>
                )}

                <View style={styles.rangeRow}>
                  <View
                    style={[styles.rangeDot, { backgroundColor: "#48BB78" }]}
                  />
                  <Text style={styles.rangeText}>Normal Range</Text>
                </View>
                <Text style={styles.rangeDetail}>60 - 100 BPM</Text>
              </View>
            </View>

            {/* SVG Cardiogram Wave */}
            <View style={styles.graphWrapper}>
              <View style={styles.graphContainer}>
                <Svg height={CHART_HEIGHT} width="100%">
                  <Defs>
                    <LinearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0%" stopColor="#12A5B5" stopOpacity="0.2" />
                      <Stop
                        offset="100%"
                        stopColor="#12A5B5"
                        stopOpacity="0.0"
                      />
                    </LinearGradient>
                  </Defs>
                  <Path
                    d={buildFillPath(heartHistory)}
                    fill="url(#hrGradient)"
                  />
                  <Path
                    d={buildChartPoints(heartHistory)}
                    fill="none"
                    stroke="#12A5B5"
                    strokeWidth="2"
                  />
                </Svg>
              </View>
              <View style={styles.graphTicks}>
                {getChartTicks(heartHistory).map((tick, index) => (
                  <Text key={index} style={styles.tickLabel}>
                    {formatTickValue(tick, "heart")}
                  </Text>
                ))}
              </View>
            </View>
          </View>

          {/* Temperature Card */}
          <View style={[styles.vitalCard, { backgroundColor: "#FFF5F5" }]}>
            <View style={styles.vitalTop}>
              <View style={styles.vitalIconContainer}>
                <Image
                  source={require("@/assets/icons/temperature.png")}
                  style={styles.vitalIcon}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.vitalLabelContainer}>
                <Text style={styles.vitalLabel}>Temperature</Text>
                <View style={styles.vitalValueRow}>
                  <Text style={[styles.vitalValue, { color: "#F16A66" }]}>
                    {temperature}
                  </Text>
                  <Text style={[styles.vitalUnit, { color: "#F16A66" }]}>
                    {" "}
                    °C
                  </Text>
                </View>
                <View style={styles.rangeRow}>
                  <View
                    style={[styles.rangeDot, { backgroundColor: "#48BB78" }]}
                  />
                  <Text style={styles.rangeText}>Normal Range</Text>
                </View>
                <Text style={styles.rangeDetail}>36.0 - 37.5 °C</Text>
              </View>
            </View>

            {/* SVG Temperature Wave */}
            <View style={styles.graphWrapper}>
              <View style={styles.graphContainer}>
                <Svg height={CHART_HEIGHT} width="100%">
                  <Defs>
                    <LinearGradient
                      id="tempGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <Stop offset="0%" stopColor="#F16A66" stopOpacity="0.2" />
                      <Stop
                        offset="100%"
                        stopColor="#F16A66"
                        stopOpacity="0.0"
                      />
                    </LinearGradient>
                  </Defs>
                  <Path
                    d={buildFillPath(tempHistory)}
                    fill="url(#tempGradient)"
                  />
                  <Path
                    d={buildChartPoints(tempHistory)}
                    fill="none"
                    stroke="#F16A66"
                    strokeWidth="2"
                  />
                </Svg>
              </View>
              <View style={styles.graphTicks}>
                {getChartTicks(tempHistory).map((tick, index) => (
                  <Text key={index} style={styles.tickLabel}>
                    {formatTickValue(tick, "temp")}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </View>

        <PatientCurrentStatus />

        <LastUpdatedCard lastUpdated={lastUpdated} />

        <QuickActions
          onNotificationPress={() => router.push("/nonpatient/dashboard/alerts")}
          onAiHelpPress={() => router.push("/nonpatient/dashboard/ai-help")}
        />

        <RecentActivity />
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
