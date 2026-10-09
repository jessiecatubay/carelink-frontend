import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  WelcomeActions,
  WelcomeBackground,
  WelcomeHeader,
  WelcomeHero,
} from "@/components/feature/welcome";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeLandingScreen() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Auto-redirect authenticated users directly to their appropriate dashboard / manual
  useEffect(() => {
    const handleAuthRedirect = async () => {
      // Only perform auto-redirect if we are currently on the landing page (index)
      if (pathname !== "/") return;

      if (!loading && isAuthenticated) {
        if (user?.role === "NON_PATIENT") {
          try {
            const manualSeen = await AsyncStorage.getItem("@carelink_user_manual_seen");
            if (!manualSeen) {
              router.replace("/nonpatient/dashboard/user-manual");
              return;
            }
          } catch (e) {
            console.log("Error checking manual seen:", e);
          }
          router.replace("/nonpatient/dashboard");
        } else if (user?.role === "PATIENT") {
          router.replace("/patient/dashboard");
        } else if (user?.onBoarded === false && user?.role === "USER") {
          router.replace("/user-onboarding");
        } else {
          router.replace("/(auth)/login");
        }
      }
    };

    handleAuthRedirect();
  }, [isAuthenticated, loading, pathname, router, user?.role, user?.onBoarded]);

  if (loading || (isAuthenticated && pathname === "/")) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F16A66" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <WelcomeBackground />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeHeader />
        <WelcomeHero />
        <WelcomeActions />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    zIndex: 1,
  },
});