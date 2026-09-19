import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/lib/axios";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QRCode from "react-qr-code";

export default function PatientQRCodeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getGeneratedCode = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.post("/api/user/v1/get-user-by-id", {
          id: user?.id,
        });

        const codeGenerated =
          response.data?.data?.patientProfile?.connectionCode;

        if (codeGenerated) {
          setCode(codeGenerated);
          return;
        }

        const result = await axiosInstance.post(
          "/api/patient-profile/v1/generate-connection-code",
          { id: user?.id },
        );

        setCode(result.data?.data?.generatedCode);
      } catch (error) {
        console.error("Failed to load connection QR code:", error);
      } finally {
        setLoading(false);
      }
    };

    getGeneratedCode();
  }, [user?.id]);

  const qrData = JSON.stringify({
    connectionCode: code,
  });

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/patient/dashboard/settings");
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      {/* Decorative background accent */}
      <View style={styles.backgroundAccent} pointerEvents="none" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={handleGoBack}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={26} color="#0AA7A8" />
        </Pressable>

        <Text style={styles.headerTitle}>My QR Code</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Device Pairing</Text>

        <View style={styles.qrCard}>
          {loading ? (
            <View style={styles.loaderBox}>
              <ActivityIndicator size="large" color="#0AA7A8" />
              <Text style={styles.loadingText}>Generating QR Code...</Text>
            </View>
          ) : (
            <>
              <QRCode value={qrData} size={240} />
              <Text style={styles.code}>{code}</Text>
            </>
          )}
        </View>

        <Text style={styles.subtitle}>
          Let your non-patient scan this code
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backgroundAccent: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 260,
    height: 220,
    borderRadius: 130,
    backgroundColor: "#EDFBFB",
    opacity: 0.9,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E242B",
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#0AA7A8",
    textAlign: "center",
    marginBottom: 32,
  },
  qrCard: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 300,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  loaderBox: {
    height: 240,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748B",
  },
  code: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "700",
    color: "#1E242B",
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 16,
    color: "#7A7A7A",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
});
