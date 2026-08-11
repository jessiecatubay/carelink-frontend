import { createContext, useContext, useState } from "react";

type OnboardingData = {
  email: string;
  role?: "PATIENT" | "CAREGIVER";
  onBoarded: boolean
};

type OnboardingContextType = {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<OnboardingData>({
    email: "",
    role: undefined,
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
