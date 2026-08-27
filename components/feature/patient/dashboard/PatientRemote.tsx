import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import RemoteButton from "./RemoteButton";
import { emitPatientAlert } from "@/lib/socket";
import { patientCommand } from "@/services/monitor";

export default function PatientRemote() {
  const [activeAlert, setActiveAlert] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  const handlePress = async (label: string) => {
    setActiveAlert(label);
    emitPatientAlert(label);

    try {
      await patientCommand("ESP32-001", label.toUpperCase());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (activeAlert) {
      // Fade in the alert sent notification
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // Clear the alert notification after 2 seconds
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setActiveAlert(null);
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [activeAlert, fadeAnim]);

  return (
    <View style={styles.container}>
      {/* Dynamic Alert Banner */}
      {activeAlert && (
        <Animated.View style={[styles.alertBanner, { opacity: fadeAnim }]}>
          <Text style={styles.alertBannerText}>
            {activeAlert === "Emergency"
              ? "🚨 Emergency Alert Broadcasted!"
              : `✓ Alert Sent: ${activeAlert}`}
          </Text>
        </Animated.View>
      )}

      {/* Floating Remote Panel */}
      <View style={styles.remotePanel}>
        {/* Row 1 */}
        <View style={styles.row}>
          <RemoteButton
            label="Food"
            icon={require("@/assets/icons/food.png")}
            onPress={() => handlePress("Food")}
            cardStyle={styles.foodCard}
          />
          <RemoteButton
            label="Water"
            icon={require("@/assets/icons/water.png")}
            onPress={() => handlePress("Water")}
            cardStyle={styles.waterCard}
          />
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          <RemoteButton
            label="Assistance"
            icon={require("@/assets/icons/assistance.png")}
            onPress={() => handlePress("Assistance")}
            cardStyle={styles.assistanceCard}
          />
          <RemoteButton
            label="Emergency"
            icon={require("@/assets/icons/emergency.png")}
            onPress={() => handlePress("Emergency")}
            isEmergency
          />
        </View>

        {/* Row 3 - Centered */}
        <View style={styles.rowCentered}>
          <RemoteButton
            label="Satisfied"
            icon={require("@/assets/icons/satisfied.png")}
            onPress={() => handlePress("Satisfied")}
            cardStyle={styles.satisfiedCard}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  alertBanner: {
    position: "absolute",
    top: -60,
    backgroundColor: "#1F2937",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  alertBannerText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  remotePanel: {
    backgroundColor: "#F3F4F6", // Off-white/light gray mockup card background
    borderRadius: 44,
    padding: 32,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    // Soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 24,
    marginBottom: 24,
  },
  rowCentered: {
    flexDirection: "row",
    justifyContent: "center",
  },
  foodCard: {
    backgroundColor: "#FCECE9",
  },
  waterCard: {
    backgroundColor: "#D4EBFD",
  },
  assistanceCard: {
    backgroundColor: "#FDE8C7",
  },
  satisfiedCard: {
    backgroundColor: "#D3F4DF",
  },
});
