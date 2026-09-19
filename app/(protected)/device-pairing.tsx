import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/lib/axios";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DevicePairingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(protected)/(non-patient)/settings");
    }
  };

  const handleOpenScanner = () => {
    router.push("/nonpatient/dashboard/scan-patient");
  };

  const handleConnectByCode = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      Alert.alert("Input Required", "Please enter a valid connection code.");
      return;
    }

    if (!user?.id) {
      Alert.alert("Error", "User session not found. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/api/patient-nonpatient/v1/connect",
        {
          nonPatientId: user.id,
          connectionCode: trimmed,
        },
      );

      if (response.data.status === "error") {
        Alert.alert("Connection Error", response.data.message || "Failed to pair device.");
        return;
      }

      Alert.alert(
        "Pairing Successful",
        "Patient device has been linked to your account.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/nonpatient/dashboard/(tabs)"),
          },
        ],
      );
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        "Unable to connect with this code. Please check and try again.";
      Alert.alert("Pairing Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
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

        <Text style={styles.headerTitle}>Device Pairing</Text>

        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Card 1: Scan QR */}
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Ionicons name="qr-code-outline" size={32} color="#0AA7A8" />
            </View>
            <Text style={styles.cardTitle}>Scan Patient QR Code</Text>
            <Text style={styles.cardSubtitle}>
              Use your device camera to scan the pairing QR code displayed on the patient&apos;s device.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={handleOpenScanner}
              style={({ pressed }) => [
                styles.scanButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Ionicons name="camera-outline" size={20} color="#FFFFFF" style={styles.btnIcon} />
              <Text style={styles.scanButtonText}>Open QR Scanner</Text>
            </Pressable>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR ENTER CODE</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Card 2: Manual Code Input */}
          <View style={styles.card}>
            <Text style={styles.inputLabel}>Connection Code</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. AB12CD"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
              autoCorrect={false}
              value={code}
              onChangeText={setCode}
            />
            <Pressable
              accessibilityRole="button"
              disabled={loading}
              onPress={handleConnectByCode}
              style={({ pressed }) => [
                styles.connectButton,
                pressed && styles.buttonPressed,
                loading && styles.buttonDisabled,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#0AA7A8" />
              ) : (
                <Text style={styles.connectButtonText}>Pair with Code</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 20,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EDFBFB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  scanButton: {
    backgroundColor: "#0AA7A8",
    borderRadius: 12,
    height: 48,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnIcon: {
    marginRight: 8,
  },
  scanButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  inputLabel: {
    alignSelf: "flex-start",
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 2,
    fontWeight: "700",
  },
  connectButton: {
    borderWidth: 1.5,
    borderColor: "#0AA7A8",
    borderRadius: 12,
    height: 48,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EDFBFB",
  },
  connectButtonText: {
    color: "#0AA7A8",
    fontSize: 15,
    fontWeight: "600",
  },
});
