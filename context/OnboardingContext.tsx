import { UserOnBoardingData } from "@/types/user";
import React, { createContext, useCallback, useContext, useState } from "react";

export const initialOnboardingData: UserOnBoardingData = {
  userId: "",
  email: "",
  role: undefined,
  age: undefined,
  gender: "",
  medicalConditions: "",
  notes: "",
  emergencyContactName: "",
  relationship: "",
  emergencyContact: "",
  onBoarded: false,
};

type OnboardingContextType = {
  data: UserOnBoardingData;
  setData: React.Dispatch<React.SetStateAction<UserOnBoardingData>>;
  resetOnboarding: () => void;
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<UserOnBoardingData>(initialOnboardingData);

  const resetOnboarding = useCallback(() => {
    setData({ ...initialOnboardingData });
  }, []);

  return (
    <OnboardingContext.Provider value={{ data, setData, resetOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }

  return context;
}
