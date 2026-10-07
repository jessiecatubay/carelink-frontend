import CustomAlertModal, { AlertModalType } from "@/components/ui/CustomAlertModal";
import PairingSuccess from "@/components/feature/nonpatient/settings/PairingSuccess";
import PatientPairingFlowModal, {
  PatientPreviewData,
} from "@/components/feature/nonpatient/settings/PatientPairingFlowModal";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/lib/axios";
import { qrCodeSchema } from "@/schema/api";
import { Ionicons } from "@expo/vector-icons";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScanPatientScreen() {
  const { user } = useAuth();

  const [permission, requestPermission] = useCameraPermissions();

  const [scanned, setScanned] = useState(false);
  const [scannerPaused, setScannerPaused] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Patient preview and pairing flow modal states
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [patientPreview, setPatientPreview] = useState<PatientPreviewData | null>(
    null,
  );
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // Custom Alert Modal State
  const [alertModal, setAlertModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type?: AlertModalType;
    confirmText?: string;
    onConfirm?: () => void;
  }>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Camera permission is required to scan the patient&apos;s QR code.
        </Text>

        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Allow Camera</Text>
        </Pressable>
      </View>
    );
  }

  const handleBarcodeScanned = async ({ data }: BarcodeScanningResult) => {
    // Don't allow another scan while processing or while paused
    if (scanned || scannerPaused || showPairingModal) {
      return;
    }

    // Pause scanner immediately
    setScannerPaused(true);

    try {
      // -----------------------------------------
      // Parse QR code
      // -----------------------------------------
      const qrData = qrCodeSchema.parse(JSON.parse(data));

      if (!user?.id) {
        setAlertModal({
          visible: true,
          type: "error",
          title: "Session Error",
          message: "Unable to identify the current user. Please log in again.",
          confirmText: "OK",
          onConfirm: () => {
            setAlertModal((prev) => ({ ...prev, visible: false }));
            setScannerPaused(false);
          },
        });
        return;
      }

      // Fetch patient preview from backend
      setLoadingPreview(true);
      setShowPairingModal(true);

      try {
        const previewRes = await axiosInstance.post(
          "/api/patient-nonpatient/v1/preview-patient",
          {
            connectionCode: qrData.connectionCode,
          },
        );

        if (previewRes.data?.status === "success" && previewRes.data?.data) {
          setPatientPreview(previewRes.data.data);
        } else {
          setShowPairingModal(false);
          setAlertModal({
            visible: true,
            type: "warning",
            title: "Patient Not Found",
            message:
              previewRes.data?.message ||
              "Invalid patient QR code. Please check and try again.",
            confirmText: "Scan Again",
            onConfirm: () => {
              setAlertModal((prev) => ({ ...prev, visible: false }));
              setScannerPaused(false);
            },
          });
        }
      } catch (err: any) {
        console.error("Failed to preview patient:", err);
        setShowPairingModal(false);
        const msg =
          err?.response?.data?.message ||
          "Could not find patient associated with this QR code.";
        setAlertModal({
          visible: true,
          type: "error",
          title: "Invalid QR Code",
          message: msg,
          confirmText: "Try Again",
          onConfirm: () => {
            setAlertModal((prev) => ({ ...prev, visible: false }));
            setScannerPaused(false);
          },
        });
      } finally {
        setLoadingPreview(false);
      }
    } catch (error) {
      console.error("Invalid QR code format:", error);
      setAlertModal({
        visible: true,
        type: "error",
        title: "Invalid QR Code",
        message: "This is not a valid patient QR code. Please scan again.",
        confirmText: "OK",
        onConfirm: () => {
          setAlertModal((prev) => ({ ...prev, visible: false }));
          setScannerPaused(false);
        },
      });
    }
  };

  const handleConfirmConnection = async (relationship: string) => {
    if (!user?.id || !patientPreview?.connectionCode) return;

    setConnecting(true);
    try {
      const result = await axiosInstance.post(
        "/api/patient-nonpatient/v1/connect",
        {
          nonPatientId: user.id,
          connectionCode: patientPreview.connectionCode,
          relationship: relationship.trim(),
        },
      );

      if (result.data?.status === "error") {
        setAlertModal({
          visible: true,
          type: "error",
          title: "Connection Error",
          message: result.data.message || "Failed to connect to patient.",
          confirmText: "OK",
          onConfirm: () => setAlertModal((prev) => ({ ...prev, visible: false })),
        });
        return;
      }

      // Connection succeeded
      setShowPairingModal(false);
      setScanned(true);
      setIsSuccess(true);
    } catch (error: any) {
      console.error("Failed to connect patient:", error);
      const msg =
        error?.response?.data?.message ||
        "Unable to connect to this patient. Please try again.";
      setAlertModal({
        visible: true,
        type: "error",
        title: "Connection Failed",
        message: msg,
        confirmText: "OK",
        onConfirm: () => setAlertModal((prev) => ({ ...prev, visible: false })),
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleClosePairingModal = () => {
    setShowPairingModal(false);
    setPatientPreview(null);
    setScannerPaused(false);
  };

  if (isSuccess) {
    return (
      <SafeAreaView style={styles.successScreen}>
        <PairingSuccess
          onContinue={() => {
            router.replace({
              pathname: "/nonpatient/dashboard",
              params: { startTour: "true" },
            } as any);
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.closeButton}
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/nonpatient/dashboard");
          }
        }}
      >
        <Ionicons name="close" size={30} color="#fff" />
      </Pressable>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={
          scanned || scannerPaused ? undefined : handleBarcodeScanned
        }
      />

      <View style={styles.overlay}>
        <View style={styles.scannerBox} />

        <Text style={styles.instruction}>
          {scannerPaused ? "Scanning paused" : "Scan the patient's QR code"}
        </Text>

        <Pressable
          style={styles.manualCodeButton}
          onPress={() => router.push("/(protected)/device-pairing")}
        >
          <Ionicons name="keypad-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.manualCodeButtonText}>Enter Code Manually</Text>
        </Pressable>
      </View>

      <PatientPairingFlowModal
        visible={showPairingModal}
        patient={patientPreview}
        loadingPatient={loadingPreview}
        connecting={connecting}
        onConnect={handleConfirmConnection}
        onClose={handleClosePairingModal}
      />

      <CustomAlertModal
        visible={alertModal.visible}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        confirmText={alertModal.confirmText}
        onConfirm={
          alertModal.onConfirm ||
          (() => setAlertModal((prev) => ({ ...prev, visible: false })))
        }
        onClose={() => setAlertModal((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  text: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },

  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  scannerBox: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: "#fff",
    borderRadius: 20,
  },

  instruction: {
    color: "#fff",
    fontSize: 18,
    marginTop: 30,
    fontWeight: "600",
  },

  manualCodeButton: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },

  manualCodeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  button: {
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
  },

  buttonText: {
    color: "#000",
    fontWeight: "600",
  },
  successScreen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
