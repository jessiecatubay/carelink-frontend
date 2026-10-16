import Button from "@/components/ui/Button";
import NoteBox from "@/components/ui/NoteBox";
import PaginationDots from "@/components/ui/PaginationDots";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PAIRING_STEPS = [
  {
    iconName: "qr-code-outline" as const,
    heading: "1. Keep your QR code ready",
    description:
      "You can display your connection QR code anytime from your CareLink dashboard or settings.",
    iconBg: "#CCFBF1",
    iconColor: "#0D9488",
  },
  {
    iconName: "camera-outline" as const,
    heading: "2. Let your caregiver scan",
    description:
      "Ask your caregiver or non-patient to scan your QR code using the scanner in their CareLink app.",
    iconBg: "#FEE2E2",
    iconColor: "#EF4444",
  },
  {
    iconName: "checkmark-circle-outline" as const,
    heading: "3. Instant connection",
    description:
      "Once scanned, your accounts will be paired to send alerts and requests in real time.",
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
  },
];

export default function DevicePairingScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/(onboarding)/patient/setupcomplete");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardContainer}
      >
        <View style={styles.container}>
          {/* Progress Dots - Step 5 of 5 */}
          <View style={styles.paginationWrap}>
            <PaginationDots currentIndex={4} total={5} />
          </View>

          {/* Title */}
          <Text style={styles.title}>Connect to Family</Text>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Subtitle */}
            <Text style={styles.subtitle}>
              To connect your account to a family or caregiver, allow them to
              scan your CareLink QR code.
            </Text>

            {/* Cards List */}
            <View style={styles.cardsContainer}>
              {PAIRING_STEPS.map((item, idx) => (
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
            <NoteBox text="You can manage or add more connected family members anytime in settings." />
          </ScrollView>

          {/* Bottom Button */}
          <View style={styles.buttonWrap}>
            <Button
              title="Continue"
              onPress={handleContinue}
              style={styles.button}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardContainer: {
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
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#7A7A7A",
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  scrollContent: {
    paddingBottom: 16,
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