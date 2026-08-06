import { createContext, useContext, useState, type ReactNode } from "react";

type OnboardingRole = "PATIENT" | "CAREGIVER" | null;

type OnboardingData = {
  role: OnboardingRole;
};

type OnboardingContextValue = {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
};

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>({
    role: null,
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
    throw new Error("useOnboarding must be used within an OnboardingProvider.");
  }

  return context;
}
