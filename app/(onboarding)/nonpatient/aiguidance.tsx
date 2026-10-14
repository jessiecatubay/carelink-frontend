import Button from "@/components/ui/Button";
import NoteBox from "@/components/ui/NoteBox";
import PaginationDots from "@/components/ui/PaginationDots";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AI_FEATURES = [
  {
    iconName: "sparkles-outline" as const,
    heading: "AI Incident Advisory",
    description:
      "Our AI instantly analyzes the emergency alert context and provides step-by-step first-aid and care instructions.",
    iconBg: "#F3E8FF",
    iconColor: "#9333EA",
  },
  {
    iconName: "medkit-outline" as const,
    heading: "Pill & Medication Reminders",
    description:
      "Schedule customized medication reminders that notify both you and the patient at specified times.",
    iconBg: "#E0F2FE",
    iconColor: "#0284C7",
  },
];

export default function AiGuidanceScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/(onboarding)/nonpatient/device-pairing");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        {/* Progress Dots - Step 5 of 8 */}
        <View style={styles.paginationWrap}>
          <PaginationDots currentIndex={4} total={8} />
        </View>

        {/* Title */}
        <Text style={styles.title}>AI Guidance & Tracking</Text>

        {/* Scrollable Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Intelligent recommendations to assist you during emergencies.
          </Text>

          {/* Cards List */}
          <View style={styles.cardsContainer}>
            {AI_FEATURES.map((item, idx) => (
              <View key={idx} style={styles.itemCard}>
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: item.iconBg },
                  ]}
                >
                  <Ionicons
                    name={item.iconName}
                    size={22}
                    color={item.iconColor}
                  />
                </View>
                <View style={styles.cardTextContent}>
                  <Text style={styles.itemHeading}>{item.heading}</Text>
                  <Text style={styles.itemDescription}>
                    {item.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Tip / Note Box */}
          <NoteBox text="Check the AI Help tab in the navigation bar whenever you need care guidance." />
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
