import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      if (user?.role === "PATIENT") {
        router.replace("/(protected)/(patient)/settings");
      } else {
        router.replace("/(protected)/(non-patient)/settings");
      }
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      <View style={styles.backgroundAccent} pointerEvents="none" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={handleGoBack}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={26} color="#0AA7A8" />
        </Pressable>

        <Text style={styles.headerTitle}>Privacy Policy</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last Updated: September 2026</Text>

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>1. Information We Collect</Text>
          <Text style={styles.paragraph}>
            CareLink collects information you provide directly (such as name, email, phone number, and emergency contacts), as well as health metrics, device telemetry, and pairing identifiers necessary to deliver vital monitoring services.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>2. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use your data strictly to facilitate patient-caregiver coordination, trigger real-time emergency alert dispatches, and enhance device pairing reliability. We do not sell your personal or medical data to third parties.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>3. Data Security & Encryption</Text>
          <Text style={styles.paragraph}>
            All transmissions between CareLink devices and our secure servers utilize industry-standard TLS encryption. Medical records and sensitive keys are encrypted at rest with AES-256 standards.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>4. Sharing with Designated Caregivers</Text>
          <Text style={styles.paragraph}>
            When a patient approves a connection code or QR pairing, vital metrics, alert notifications, and emergency states are shared with the authenticated caregiver&apos;s account.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>5. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have questions regarding this Privacy Policy or your data rights, contact our Data Protection Officer at privacy@carelink.com.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E242B",
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
  },
});
