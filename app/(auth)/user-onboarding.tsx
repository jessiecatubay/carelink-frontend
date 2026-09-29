import SelectRole from "@/components/feature/onboarding/SelectRole";
import UserNameStep from "@/components/feature/onboarding/UserNameStep";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserOnboarding() {
  const [step, setStep] = useState<"name" | "role">("name");

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