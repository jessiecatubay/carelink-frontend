import Button from "@/components/ui/Button";
import NoteBox from "@/components/ui/NoteBox";
import PaginationDots from "@/components/ui/PaginationDots";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type DeviceAlertItem = {
  title: string;
  description: string;
  icon: ImageSourcePropType;
  iconBg: string;
  iconTintColor?: string;
};

const DEVICE_ALERTS: DeviceAlertItem[] = [
  {
    title: "Emergency Alert",
    description:
      "Critical alert triggered when the patient requires immediate urgent medical or safety help. Sound and sirens will play.",
    icon: require("@/assets/icons/red-emergency.png"),
    iconBg: "#FEE2E2",
    iconTintColor: "#DC2626",
  },
  {
    title: "Food Request",
    description:
      "Patient is requesting a meal, snack, or scheduled dietary assistance.",
    icon: require("@/assets/icons/food.png"),
    iconBg: "#FFEDD5",
    iconTintColor: "#EA580C",
  },
  {
    title: "Water Request",
    description:
      "Patient is requesting water or hydration assistance.",
    icon: require("@/assets/icons/water.png"),
    iconBg: "#E0F2FE",
    iconTintColor: "#0284C7",
  },
  {
    title: "General Assistance",
    description:
      "Patient needs physical support, help standing, or routine caregiving tasks.",
    icon: require("@/assets/icons/assistance.png"),
    iconBg: "#EDE9FE",
    iconTintColor: "#7C3AED",
  },
  {
    title: "Satisfied / Attended",
    description:
      "Signals that the patient's request has been completed and they are comfortable.",
    icon: require("@/assets/icons/satisfied.png"),
    iconBg: "#DCFCE7",
    iconTintColor: "#16A34A",
  },
];

export default function DeviceAlertsScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/(onboarding)/nonpatient/aiguidance");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        {/* Progress Dots - Step 4 of 8 */}
        <View style={styles.paginationWrap}>
          <PaginationDots currentIndex={3} total={8} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Device Alerts & Meanings</Text>

        {/* Scrollable Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Understand the 5 primary alert buttons on the patient's device.
          </Text>

          {/* Cards List */}
          <View style={styles.cardsContainer}>
            {DEVICE_ALERTS.map((item, idx) => (
              <View key={idx} style={styles.itemCard}>
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: item.iconBg },
                  ]}
                >
                  <Image
                    source={item.icon}
                    style={[
                      styles.iconImage,
                      item.iconTintColor
                        ? { tintColor: item.iconTintColor }
                        : undefined,
                    ]}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.cardTextContent}>
                  <Text style={styles.itemHeading}>{item.title}</Text>
                  <Text style={styles.itemDescription}>
                    {item.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Tip / Note Box */}
          <NoteBox text="You can acknowledge and resolve active alerts directly from your caregiver dashboard." />
        </ScrollView>

        <View style={styles.buttonWrap}>
          <Button
            title="Continue"
            onPress={handleContinue}
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  paginationWrap: {
    marginTop: 100,
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#12A5B5",
    textAlign: "center",
    marginBottom: 10,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#7A7A7A",
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  cardsContainer: {
    gap: 12,
    marginBottom: 18,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1.5,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  cardTextContent: {
    flex: 1,
  },
  itemHeading: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  buttonWrap: {
    marginBottom: 40,
  },
  button: {
    width: "100%",
  },
});
