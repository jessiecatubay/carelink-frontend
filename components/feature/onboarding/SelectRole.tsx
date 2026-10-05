import { Ionicons } from "@expo/vector-icons";
import Logo from "@/components/common/Logo";
import Button from "@/components/ui/Button";
import RadioButton from "@/components/ui/RadioButton";
import { useOnboarding } from "@/context/OnboardingContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const COLOR_PATIENT = "#12A5B5";
const COLOR_NONPATIENT = "#F16A66";

export default function SelectRole({ onBack }: { onBack?: () => void }) {
  const router = useRouter();
  const { setData } = useOnboarding();

  const [selectedRole, setSelectedRole] = useState<
    "patient" | "nonpatient" | null
  >(null);

  const handleContinue = () => {
    if (!selectedRole) return;

    setData((prev) => ({
      ...prev,
      role: selectedRole === "patient" ? "PATIENT" : "NON-PATIENT",
    }));

    if (selectedRole === "patient") {
      router.push("/(onboarding)/patient/welcome");
    } else {
      router.push("/(onboarding)/nonpatient/welcome");
    }
  };

  return (
    <View style={styles.container}>
      {onBack ? (
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#374151" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <Text style={styles.title}>How will you use</Text>

      <Logo />

      <Text style={styles.subtitle}>Select your role to continue</Text>

      {/* Patient Card */}
      <Pressable
        style={[
          styles.card,
          selectedRole === "patient" && styles.cardSelectedPatient,
        ]}
        onPress={() => setSelectedRole("patient")}
      >
        <Image
          source={require("@/assets/icons/disabled.png")}
          style={styles.icon}
        />

        <View style={styles.textContainer}>
          <Text
            style={[
              styles.cardTitle,
              selectedRole === "patient" && styles.cardTitlePatientSelected,
            ]}
          >
            Patient
          </Text>
          <Text style={styles.cardSubtitle}>Send requests using remote</Text>
        </View>

        <RadioButton
          selected={selectedRole === "patient"}
          selectedColor={COLOR_PATIENT}
        />
      </Pressable>

      {/* Non-patient Card */}
      <Pressable
        style={[
          styles.card,
          selectedRole === "nonpatient" && styles.cardSelectedNonPatient,
        ]}
        onPress={() => setSelectedRole("nonpatient")}
      >
        <Image
          source={require("@/assets/icons/family.png")}
          style={styles.icon}
        />

        <View style={styles.textContainer}>
          <Text
            style={[
              styles.cardTitle,
              selectedRole === "nonpatient" && styles.cardTitleNonPatientSelected,
            ]}
          >
            Non-patient
          </Text>
          <Text style={styles.cardSubtitle}>
            Monitor and assist the patient
          </Text>
        </View>

        <RadioButton
          selected={selectedRole === "nonpatient"}
          selectedColor={COLOR_NONPATIENT}
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
          <Text style={styles.helperText}>
            Please select a role to continue
          </Text>
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
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: "center",
  },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 4,
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
    borderWidth: 1.5,
    borderColor: "transparent",
    paddingHorizontal: 16,
    marginBottom: 16,
    // Subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardSelectedPatient: {
    backgroundColor: "#F0FCFD",
    borderColor: "#12A5B5",
    borderWidth: 2,
    shadowColor: "#12A5B5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  cardSelectedNonPatient: {
    backgroundColor: "#FFF5F5",
    borderColor: "#F16A66",
    borderWidth: 2,
    shadowColor: "#F16A66",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
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
  cardTitlePatientSelected: {
    color: "#12A5B5",
    fontWeight: "700",
  },
  cardTitleNonPatientSelected: {
    color: "#F16A66",
    fontWeight: "700",
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
