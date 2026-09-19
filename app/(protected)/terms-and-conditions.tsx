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

export default function TermsAndConditionsScreen() {
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

        <Text style={styles.headerTitle}>Terms & Conditions</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last Updated: September 2026</Text>

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing or using the CareLink application and services, you agree to be bound by these Terms and Conditions. If you do not agree to all terms, you may not access or use the application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>2. Service Description</Text>
          <Text style={styles.paragraph}>
            CareLink provides patient monitoring, emergency assistance alerts, and communication facilitation between patients, designated caregivers, and healthcare personnel.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>3. Emergency Alert Disclaimer</Text>
          <Text style={styles.paragraph}>
            While CareLink facilitates emergency communication and alert notification, the application is not a substitute for professional 911 or localized emergency medical dispatch services. In immediate life-threatening situations, always contact local emergency authorities directly.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>4. User Accounts & Responsibilities</Text>
          <Text style={styles.paragraph}>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify CareLink immediately of any unauthorized use.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>5. Privacy & Data Handling</Text>
          <Text style={styles.paragraph}>
            Your use of CareLink is also governed by our Privacy Policy, which outlines how we collect, store, and safeguard your medical and personal information.
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
