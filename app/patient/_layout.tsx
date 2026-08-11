import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "@/context/AuthContext";

export default function PatientLayout() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace("/login");
        return;
      }

      if(user?.role === "USER" && user?.onBoarded === false) {
        router.replace("/(auth)/user-onboarding");
        return;
      }

      if (user?.role !== "PATIENT") {
        router.replace("/nonpatient/dashboard/(tabs)");
      }
    }
  }, [isAuthenticated, loading, router, user?.role]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}
