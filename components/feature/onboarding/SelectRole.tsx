import Logo from "@/components/common/Logo";
import Button from "@/components/ui/Button";
import RoleSelectorDot from "@/components/ui/RoleSelectorDot";
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

export default function SelectRole() {
  const router = useRouter();
  const { setData } = useOnboarding();

  const [selectedRole, setSelectedRole] = useState<
    "PATIENT" | "CAREGIVER" | null
  >(null);

  const handleContinue = () => {
    if (!selectedRole) return;

    setData((prev) => ({
      ...prev,
      role: selectedRole,
    }));

    if (selectedRole === "PATIENT") {
      router.push("/patient/welcome");
    } else {
      router.push("/non-patient/welcome");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How will you use</Text>

      <Logo />

      <Text style={styles.subtitle}>
        Select your role to continue
      </Text>

      {/* Patient */}
      <Pressable
        style={[
          styles.card,
          selectedRole === "PATIENT" && styles.selectedCard,
        ]}
        onPress={() => setSelectedRole("PATIENT")}
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

        <RoleSelectorDot
          selected={selectedRole === "PATIENT"}
          color="blue"
        />
      </Pressable>

      {/* Caregiver */}
      <Pressable
        style={[
          styles.card,
          selectedRole === "CAREGIVER" && styles.selectedCard,
        ]}
        onPress={() => setSelectedRole("CAREGIVER")}
      >
        <Image
          source={require("@/assets/icons/family.png")}
          style={styles.icon}
        />

        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>
            Family / Caregiver
          </Text>

          <Text style={styles.cardSubtitle}>
            Monitor and assist the patient
          </Text>
        </View>

        <RoleSelectorDot
          selected={selectedRole === "CAREGIVER"}
          color="pink"
        />
      </Pressable>

      <View style={{ flex: 1 }} />

      <Button
        title="Continue"
        onPress={handleContinue}
        disabled={!selectedRole}
        style={{
          opacity: selectedRole ? 1 : 0.5,
        }}
      />

      <Text style={styles.note}>
        Please select a role to continue
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#12A5B5",
    marginBottom: 10,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 18,
    color: "#666",
    marginTop: 15,
    marginBottom: 40,
    textAlign: "center",
  },

  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 18,
    padding: 18,
    marginBottom: 22,
    elevation: 4,
  },

  selectedCard: {
    borderWidth: 2,
    borderColor: "#12A5B5",
  },

  icon: {
    width: 55,
    height: 55,
    resizeMode: "contain",
  },

  textContainer: {
    flex: 1,
    marginLeft: 18,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
  },

  cardSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#777",
  },

  note: {
    marginTop: 12,
    color: "#888",
    fontSize: 13,
  },
});