import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";

export default function TermsCard() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  const handleContinue = () => {
    if (!checked) {
      Alert.alert(
        "Terms and Conditions",
        "Please agree before continuing."
      );
      return;
    }

    router.push("/(onboarding)/non-patient/instruction");
  };

  return (
    <>
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
            caregivers to receive alerts from connected hardware
            devices and access AI-based guidance for responding to
            patient needs.
          </Text>

          <Text style={styles.subheading}>
            3. User Responsibilities
          </Text>

          <Text style={styles.body}>
            • Provide accurate information during registration.{"\n"}
            • Keep your account credentials confidential.{"\n"}
            • Use CareLink responsibly.
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

      <Button
        title="Continue"
        onPress={handleContinue}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 340,
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 18,
    padding: 15,
    backgroundColor: "#FFF",
    marginBottom: 24,

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

  heading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#666",
    marginBottom: 16,
  },

  subheading: {
    fontSize: 15,
    fontWeight: "700",
    color: "#666",
    marginTop: 15,
    marginBottom: 6,
  },

  body: {
    fontSize: 14,
    lineHeight: 22,
    color: "#777",
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  checkboxText: {
    marginLeft: 10,
    color: "#666",
    fontSize: 14,
  },
});