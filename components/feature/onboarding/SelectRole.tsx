import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useOnboarding } from "@/context/OnboardingContext";
import { useRouter } from "expo-router";

export default function SelectRole() {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<
    "PATIENT" | "CAREGIVER" | null
  >(null);
  const { setData } = useOnboarding();

  const handleContinue = async () => {
    if (!selectedRole) {
      console.log("Please select a role.");
      return;
    }
    setData((prev) => ({ ...prev, role: selectedRole }));
    if(selectedRole === "PATIENT") {
      router.push("/patient/welcome");
    } else {
      router.push("/non-patient/welcome");
    }
  };

  return (
    <View>
      {/* Header */}
      <View>
        <Text>Select Your Role</Text>
        <Text>
          Choose the option that best describes how you will use the application.
        </Text>
      </View>

      {/* Role Options */}
      <View>
        <Pressable onPress={() => setSelectedRole("PATIENT")}>
          <View>
            <Text>{selectedRole === "PATIENT" ? "◉" : "○"} Patient</Text>
            <Text>Send request using remote</Text>
          </View>
        </Pressable>

        <Pressable onPress={() => setSelectedRole("CAREGIVER")}>
          <View>
            <Text>{selectedRole === "CAREGIVER" ? "◉" : "○"} Caregiver</Text>
            <Text>Monitor and assist the patient</Text>
          </View>
        </Pressable>
      </View>

      {/* Continue Button */}
      <View>
        <Pressable onPress={handleContinue}>
          <Text>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}