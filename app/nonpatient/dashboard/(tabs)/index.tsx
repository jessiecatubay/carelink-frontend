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

const buildChartPoints = (
  values: number[],
  width = CHART_WIDTH,
  height = CHART_HEIGHT,
) => {
  if (!values.length) return "";

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max === min ? Math.max(1, max) : max - min;
  const step = width / Math.max(values.length - 1, 1);

  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
};

const buildFillPath = (
  values: number[],
  width = CHART_WIDTH,
  height = CHART_HEIGHT,
) => {
  const points = buildChartPoints(values, width, height);
  if (!points) return "";
  return `${points} L ${width.toFixed(1)} ${height.toFixed(1)} L 0 ${height.toFixed(
    1,
  )} Z`;
};

const getChartTicks = (values: number[], count = 4) => {
  if (!values.length) return Array.from({ length: count }, () => 0);

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  const step = count > 1 ? range / (count - 1) : 0;

  return Array.from({ length: count }, (_, index) => max - index * step);
};

const formatTickValue = (value: number, type: "heart" | "temp") => {
  return type === "heart" ? Math.round(value).toString() : value.toFixed(1);
};

export default function Home() {
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

      const formattedTime = formatLastUpdated(lastUpdated[0]);

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
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Image
              source={require("@/assets/icons/bell.png")}
              style={styles.bellIcon}
              resizeMode="contain"
            />
            <View style={styles.badge} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Patient Status Card */}
        <View style={styles.patientCard}>
          <View style={styles.patientCardLeft}>
            <Image
              source={require("@/assets/users/zayn.png")}
              style={styles.avatar}
            />
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>Patient: Zayn Malik</Text>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Status:</Text>
                <Text style={styles.statusValue}>Connected</Text>
                <View style={styles.statusDot} />
              </View>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#718096" />
        </View>

        {/* Current Vitals Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Current Vitals</Text>
          <TouchableOpacity style={styles.viewHistoryButton}>
            <Text style={styles.viewHistoryText}>View History </Text>
            <Ionicons name="chevron-forward" size={14} color="#12A5B5" />
          </TouchableOpacity>
        </View>

        {/* Vitals Column/Grid */}
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
  header: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F4F8",
  },
  logo: {
    height: 32,
    width: 120,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    position: "relative",
    marginRight: 16,
    padding: 4,
  },
  bellIcon: {
    width: 24,
    height: 24,
  },
  badge: {
    position: "absolute",
    top: 3,
    right: 3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F16A66",
  },
  menuButton: {
    width: 24,
    height: 16,
    justifyContent: "space-between",
    paddingVertical: 1,
  },
  menuLine: {
    height: 2,
    backgroundColor: "#1A202C",
    borderRadius: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  patientCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#A0AEC0",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  patientCardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E2E8F0",
  },
  patientInfo: {
    marginLeft: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A202C",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statusLabel: {
    fontSize: 14,
    color: "#718096",
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#48BB78",
    marginLeft: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#48BB78",
    marginLeft: 6,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A202C",
  },
  viewHistoryButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewHistoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#12A5B5",
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
