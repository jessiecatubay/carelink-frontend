import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from "react-native-svg";

export default function Home() {
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
                <View style={styles.vitalValueRow}>
                  <Text style={[styles.vitalValue, { color: "#12A5B5" }]}>78</Text>
                  <Text style={[styles.vitalUnit, { color: "#12A5B5" }]}> BPM</Text>
                </View>
                <View style={styles.rangeRow}>
                  <View style={[styles.rangeDot, { backgroundColor: "#48BB78" }]} />
                  <Text style={styles.rangeText}>Normal Range</Text>
                </View>
                <Text style={styles.rangeDetail}>60 - 100 BPM</Text>
              </View>
            </View>

            {/* SVG Cardiogram Wave */}
            <View style={styles.graphContainer}>
              <Svg height="50" width="100%">
                <Defs>
                  <LinearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#12A5B5" stopOpacity="0.2" />
                    <Stop offset="100%" stopColor="#12A5B5" stopOpacity="0.0" />
                  </LinearGradient>
                </Defs>
                <Path
                  d="M -10 50 L -10 30 C 10 42, 25 10, 40 32 C 55 45, 65 5, 80 28 C 95 40, 110 15, 125 22 L 140 22 L 140 50 Z"
                  fill="url(#hrGradient)"
                />
                <Path
                  d="M -10 30 C 10 42, 25 10, 40 32 C 55 45, 65 5, 80 28 C 95 40, 110 15, 125 22 L 140 22"
                  fill="none"
                  stroke="#12A5B5"
                  strokeWidth="2"
                />
                <Circle cx="140" cy="22" r="3.5" fill="#12A5B5" />
              </Svg>
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
                  <Text style={[styles.vitalValue, { color: "#F16A66" }]}>36.6</Text>
                  <Text style={[styles.vitalUnit, { color: "#F16A66" }]}> °C</Text>
                </View>
                <View style={styles.rangeRow}>
                  <View style={[styles.rangeDot, { backgroundColor: "#48BB78" }]} />
                  <Text style={styles.rangeText}>Normal Range</Text>
                </View>
                <Text style={styles.rangeDetail}>36.0 - 37.5 °C</Text>
              </View>
            </View>

            {/* SVG Temperature Wave */}
            <View style={styles.graphContainer}>
              <Svg height="50" width="100%">
                <Defs>
                  <LinearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#F16A66" stopOpacity="0.2" />
                    <Stop offset="100%" stopColor="#F16A66" stopOpacity="0.0" />
                  </LinearGradient>
                </Defs>
                <Path
                  d="M -10 50 L -10 35 C 15 15, 30 45, 45 25 C 60 10, 75 35, 90 20 C 105 10, 120 30, 135 25 L 140 25 L 140 50 Z"
                  fill="url(#tempGradient)"
                />
                <Path
                  d="M -10 35 C 15 15, 30 45, 45 25 C 60 10, 75 35, 90 20 C 105 10, 120 30, 135 25 L 140 25"
                  fill="none"
                  stroke="#F16A66"
                  strokeWidth="2"
                />
                <Circle cx="140" cy="25" r="3.5" fill="#F16A66" />
              </Svg>
            </View>
          </View>
        </View>

        {/* Patient Current Status Card (Smile replacing water) */}
        <View style={styles.patientStatusCard}>
          <View style={styles.patientStatusLeft}>
            <View style={styles.smileIconContainer}>
              <Image
                source={require("@/assets/icons/smile.png")}
                style={styles.smileIcon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>Patient Current Status</Text>
              <Text style={styles.statusSubtitle}>No Patients Need</Text>
            </View>
          </View>
          <View style={styles.patientStatusRight}>
            <Image
              source={require("@/assets/icons/family.png")}
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
            <Text style={styles.syncText}>Last updated: Today, 9:41 AM</Text>
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
  graphContainer: {
    marginTop: 10,
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
  smileIcon: {
    width: 70,
    height: 70,
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
