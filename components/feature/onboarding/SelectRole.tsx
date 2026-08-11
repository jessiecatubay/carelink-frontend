import Logo from "@/components/common/Logo";
import Button from "@/components/ui/Button";
import RadioButton from "@/components/ui/RadioButton";
import { useOnboarding } from "@/context/OnboardingContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const COLOR_PATIENT = "#12A5B5";
const COLOR_CAREGIVER = "#F16A66";

export default function SelectRole() {
  const router = useRouter();
  const { setData } = useOnboarding();

  const [selectedRole, setSelectedRole] = useState<
    "patient" | "caregiver" | null
  >(null);

  const handleContinue = () => {
    if (!selectedRole) return;

    setData((prev) => ({
      ...prev,
      role: selectedRole === "patient" ? "PATIENT" : "CAREGIVER",
    }));

    if (selectedRole === "patient") {
      router.push("/(onboarding)/patient/welcome");
    } else {
      router.push("/(onboarding)/nonpatient/welcome");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How will you use</Text>

      <Logo />

      <Text style={styles.subtitle}>
        Select your role to continue
      </Text>

      {/* Patient Card */}
      <Pressable
        style={styles.card}
        onPress={() => setSelectedRole("patient")}
      >
        <Image
          source={require("@/assets/icons/disabled.png")}
          style={styles.icon}
        />

        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>Patient</Text>
          <Text style={styles.cardSubtitle}>
            Send requests using remote
          </Text>
        </View>

        <RadioButton
          selected={selectedRole === "patient"}
          selectedColor={COLOR_PATIENT}
        />
      </Pressable>

      {/* Family / Caregiver Card */}
      <Pressable
        style={styles.card}
        onPress={() => setSelectedRole("caregiver")}
      >
        <Image
          source={require("@/assets/icons/family.png")}
          style={styles.icon}
        />

        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>Family / Caregiver</Text>
          <Text style={styles.cardSubtitle}>
            Monitor and assist the patient
          </Text>
        </View>

        <RadioButton
          selected={selectedRole === "caregiver"}
          selectedColor={COLOR_CAREGIVER}
        />
      </Pressable>

      <View style={{ flex: 1 }} />

      <Button
        title="Continue"
        onPress={handleContinue}
        disabled={!selectedRole}
        style={styles.button}
      />

      {!selectedRole && (
        <View style={styles.helperContainer}>
          <Image
            source={require("@/assets/icons/padlock.png")}
            style={styles.lockIcon}
          />
          <Text style={styles.helperText}>Please select a role to continue</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#12A5B5",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    marginBottom: 32,
    textAlign: "center",
  },
  card: {
    width: "100%",
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    // Subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  icon: {
    width: 44,
    height: 44,
    resizeMode: "contain",
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  button: {
    width: "100%",
  },
  helperContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  lockIcon: {
    width: 12,
    height: 12,
    tintColor: "#8E8E93",
    marginRight: 6,
    resizeMode: "contain",
  },
  helperText: {
    fontSize: 12,
    color: "#8E8E93",
  },
});

