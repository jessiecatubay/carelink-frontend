import { UserOnBoardingData } from "@/types/user";
import { createContext, useContext, useState } from "react";

type OnboardingContextType = {
  data: UserOnBoardingData;
  setData: React.Dispatch<React.SetStateAction<UserOnBoardingData>>;
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<UserOnBoardingData>({
    userId: "",
    email: "",
    role: undefined,
    age: 0,
    gender: "",
    medicalConditions: "",
    notes: "",
    onBoarded: false,
  });

  return (
    <OnboardingContext.Provider value={{ data, setData }}>
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
