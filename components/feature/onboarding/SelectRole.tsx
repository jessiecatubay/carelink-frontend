import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import axiosInstance from "@/lib/axios";
import { useOnboarding } from "@/context/OnboardingContext";

export default function SelectRole() {
  const [selectedRole, setSelectedRole] = useState<
    "PATIENT" | "CAREGIVER" | null
  >(null);
  const { data } = useOnboarding();

  const handleContinue = async () => {
    if (!selectedRole) {
      console.log("Please select a role.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("role", selectedRole);
      formData.append("email", data.email);

      console.log("Submitting role:", selectedRole, "for email:", data.email);

      const response = await axiosInstance.post(
        `/api/user/v1/user-onboarding`,
        formData
      );

      console.log("Success:", response.data);

      // Navigate to the next screen here if needed
      // router.push("/next-screen");
    } catch (error: any) {
      console.error(
        "Error:",
        error.response?.data || error.message
      );
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