import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import PaginationDots from "@/components/ui/PaginationDots";

export default function TermsPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  const handleContinue = () => {
    if (!checked) return;
    // router.push("/patient/onboarding/screen3");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.paginationWrap}>
          <PaginationDots currentIndex={1} total={6} />
        </View>

        <Text style={styles.title}>Terms and Conditions</Text>

        <View style={styles.card}>
          <ScrollView showsVerticalScrollIndicator>
            <Text style={styles.heading}>
              CareLink Terms and Conditions
            </Text>

            <Text style={styles.body}>
              Welcome to CareLink. By creating an account and using this
              application, you agree to the following Terms and
              Conditions. Please read them carefully.
            </Text>

            <Text style={styles.subheading}>
              1. Acceptance of Terms
            </Text>

            <Text style={styles.body}>
              By accessing or using CareLink, you agree to be bound by
              these Terms and Conditions. If you do not agree, please do
              not use the application.
            </Text>

            <Text style={styles.subheading}>
              2. Description of Service
            </Text>

            <Text style={styles.body}>
              CareLink is a patient assistance system that allows
              caregivers to receive alerts from a connected hardware
              device and access AI-based guidance for responding to
              patient needs.
            </Text>

            <Text style={styles.subheading}>
              3. User Responsibilities
            </Text>

            <Text style={styles.body}>
              You agree to:{"\n"}
              • Provide accurate and complete information during registration{"\n"}
              • Maintain the confidentiality of your account credentials.
            </Text>

            <Text style={styles.subheading}>
              4. Privacy
            </Text>

            <Text style={styles.body}>
              Your information is collected only to provide CareLink
              services and is protected according to our Privacy Policy.
            </Text>
          </ScrollView>
        </View>

        <View style={styles.checkboxContainer}>
          <Checkbox
            checked={checked}
            onPress={() => setChecked(!checked)}
          />
          <Text style={styles.checkboxText}>
            I agree to the Terms and Conditions
          </Text>
        </View>

        <View style={styles.buttonWrap}>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={!checked}
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  paginationWrap: {
    marginTop: 20,
    alignItems: "center",
  },
  title: {
    marginTop: 24,
    marginBottom: 20,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "600",
    color: "#12A5B5",
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#FFF",
    marginBottom: 20,
    // Subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  heading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#555",
    marginBottom: 12,
  },
  subheading: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
    marginTop: 14,
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  checkboxText: {
    marginLeft: 10,
    color: "#6B7280",
    fontSize: 14,
  },
  buttonWrap: {
    marginBottom: 10,
  },
  button: {
    width: "100%",
  },
});
