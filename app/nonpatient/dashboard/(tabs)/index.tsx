import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import axiosInstance from "@/lib/axios";
import { initSocket, onPatientAlert, onPatientVitals } from "@/lib/socket";
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

import { CommandData } from "@/lib/CommandData";

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
  const [latestCommand, setLatestCommand] = useState<string | null>("SATISFIED");

  useEffect(() => {
    initSocket();

    const off = onPatientAlert((payload: any) => {
      const command = payload?.command ?? payload?.alertType;
      console.log(command)
      if (typeof command !== "string") return;

      const normalizedCommand = command.toUpperCase();
      setLatestCommand(normalizedCommand);
      console.log("Latest command:", normalizedCommand);
    });

    return () => {
      off?.();
    };
  }, []);

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
        {/* Patient Current Status Card (Smile replacing water) */}
        <View style={styles.patientStatusCard}>
          <View style={styles.patientStatusLeft}>
            <View style={styles.smileIconContainer}>
              <Image
                source={CommandData[latestCommand as keyof typeof CommandData].icon}
                style={styles.statusIcon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>Patient Current Status</Text>
              <Text style={styles.statusSubtitle}>
                {latestCommand
                  ? `${latestCommand}`
                  : "No Patients Need"}
              </Text>
            </View>
          </View>
          <View style={styles.patientStatusRight}>
            <Image
              source={CommandData[latestCommand as keyof typeof CommandData].icon}
              style={styles.familyIcon}
              resizeMode="contain"
            />
            <View style={styles.checkBadge}>
              <Image
                source={require("@/assets/icons/check.png")}
                style={styles.checkIcon}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* Sync / Watch Row */}
        <View style={styles.syncRow}>
          <View style={styles.syncCol}>
            <Image
              source={require("@/assets/icons/belt.png")}
              style={styles.beltIcon}
              resizeMode="contain"
            />
            <Text style={styles.syncText}>Last updated: {lastUpdated}</Text>
          </View>
          <View style={styles.syncDivider} />
          <View style={styles.syncCol}>
            <Image
              source={require("@/assets/icons/belt.png")}
              style={styles.beltIcon}
              resizeMode="contain"
            />
            <Text style={styles.syncText}>From CareLink Wrist</Text>
          </View>
          <View style={styles.signalContainer}>
            <View style={[styles.signalBar, { height: 5 }]} />
            <View style={[styles.signalBar, { height: 9 }]} />
            <View style={[styles.signalBar, { height: 13 }]} />
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.actionsTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <Image
              source={require("@/assets/icons/bell.png")}
              style={styles.actionIcon}
              resizeMode="contain"
            />
            <Text style={styles.actionButtonText}>Notification</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <Image
              source={require("@/assets/icons/ai.png")}
              style={styles.actionIcon}
              resizeMode="contain"
            />
            <Text style={styles.actionButtonText}>AI Help</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity (Empty state) */}
        <Text style={styles.recentActivityTitle}>Recent Activity</Text>
        <View style={styles.emptyActivityCard}>
          <Ionicons name="chatbox-ellipses-outline" size={32} color="#A0AEC0" />
          <Text style={styles.emptyActivityText}>No recent activity today</Text>
        </View>
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
  vitalCard: {
    width: "48%",
    borderRadius: 16,
    paddingTop: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#A0AEC0",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  vitalTop: {
    paddingHorizontal: 14,
  },
  vitalIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#A0AEC0",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  vitalIcon: {
    width: 20,
    height: 20,
  },
  vitalLabelContainer: {
    marginTop: 10,
  },
  vitalLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4A5568",
  },
  vitalValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
  },
  vitalValue: {
    fontSize: 28,
    fontWeight: "700",
  },
  vitalUnit: {
    fontSize: 14,
    fontWeight: "600",
  },
  rangeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  rangeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  rangeText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#718096",
  },
  rangeDetail: {
    fontSize: 11,
    color: "#A0AEC0",
    marginTop: 2,
  },
  graphWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 10,
  },
  graphTicks: {
    width: 25,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingVertical: 4,
    marginLeft: 8,
    right: 5,
  },
  tickLabel: {
    fontSize: 10,
    color: "#718096",
  },
  graphContainer: {
    flex: 1,
    height: 50,
  },
  patientStatusCard: {
    backgroundColor: "#EBF8FA",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#A0AEC0",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  patientStatusLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  syncButton: {
    backgroundColor: "#12A5B5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "center",
    marginLeft: 12,
  },
  syncButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  smileIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#A0AEC0",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  statusIcon: {
    width: 40,
    height: 50,
  },
  statusTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#12A5B5",
  },
  statusSubtitle: {
    fontSize: 14,
    color: "#718096",
    marginTop: 2,
  },
  patientStatusRight: {
    position: "relative",
    width: 60,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  familyIcon: {
    width: 50,
    height: 35,
    opacity: 0.3,
  },
  checkBadge: {
    position: "absolute",
    bottom: -2,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#12A5B5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#EBF8FA",
  },
  checkIcon: {
    width: 9,
    height: 9,
    tintColor: "#FFFFFF",
  },
  syncRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#EDF2F7",
  },
  syncCol: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  beltIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    tintColor: "#718096",
  },
  syncText: {
    fontSize: 11,
    color: "#718096",
    fontWeight: "500",
  },
  syncDivider: {
    width: 1,
    height: 14,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 12,
  },
  signalContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginLeft: 8,
  },
  signalBar: {
    width: 2.5,
    backgroundColor: "#48BB78",
    marginHorizontal: 0.75,
    borderRadius: 0.5,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A202C",
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  actionButton: {
    width: "48%",
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#12A5B5",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  actionIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#12A5B5",
  },
  recentActivityTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A202C",
    marginBottom: 12,
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
});
