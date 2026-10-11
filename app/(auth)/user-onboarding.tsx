import SelectRole from "@/components/feature/onboarding/SelectRole";
import UserNameStep from "@/components/feature/onboarding/UserNameStep";
import { useAuth } from "@/context/AuthContext";
import { initialOnboardingData, useOnboarding } from "@/context/OnboardingContext";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserOnboarding() {
  const { user } = useAuth();
  const { setData } = useOnboarding();
  const [step, setStep] = useState<"name" | "role">("name");

  // Reset any residual onboarding state from previous user sessions
  useEffect(() => {
    setData({
      ...initialOnboardingData,
      userId: user?.id || "",
      email: user?.email || "",
    });
  }, [user?.id, user?.email, setData]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {step === "name" ? (
        <UserNameStep onContinue={() => setStep("role")} />
      ) : (
        <SelectRole onBack={() => setStep("name")} />
      )}
    </SafeAreaView>
  );
}