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
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function ScanPatientScreen() {
  const { user } = useAuth();

  const [permission, requestPermission] = useCameraPermissions();

  const [scanned, setScanned] = useState(false);
  const [scannerPaused, setScannerPaused] = useState(false);

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
    // Don't allow another scan while processing
    // or while the scanner is paused.
    if (scanned || scannerPaused) {
      return;
    }

    // Pause scanner immediately so the same QR
    // doesn't trigger multiple times.
    setScannerPaused(true);

    try {
      // -----------------------------------------
      // Parse QR code
      // -----------------------------------------
      const qrData = qrCodeSchema.parse(JSON.parse(data));

      // -----------------------------------------
      // Validate QR code
      // -----------------------------------------
      console.log("Connection Code:", qrData.connectionCode);

      // -----------------------------------------
      // Make sure user is logged in
      // -----------------------------------------
      if (!user?.id) {
        Alert.alert(
          "Error",
          "Unable to identify the current user.",
          [
            {
              text: "OK",
              onPress: () => {
                setScannerPaused(false);
              },
            },
          ],
          {
            cancelable: false,
          },
        );

        return;
      }

      // -----------------------------------------
      // Connect caregiver/non-patient to patient
      // -----------------------------------------
      try {
        const result = await axiosInstance.post(
          "/api/patient-nonpatient/v1/connect",
          {
            nonPatientId: user.id,
            connectionCode: qrData.connectionCode,
          },
        );

        if (result.data.status === "error") {
          Alert.alert(
            "Error",
            `${result.data.message}`,
            [
              {
                text: "OK",
                onPress: () => {
                  setScannerPaused(false);
                },
              },
            ],
            {
              cancelable: false,
            },
          );

          return;
        }

        console.log("Successfully connected");

        // Stop scanner permanently because
        // connection was successful.
        setScanned(true);

        // Show success message first.
        Alert.alert(
          "Successfully Connected",
          "The patient has been successfully connected to your account.",
          [
            {
              text: "OK",
              onPress: () => {
                router.replace("/nonpatient/dashboard/(tabs)");
              },
            },
          ],
          {
            cancelable: false,
          },
        );
      } catch (error: any) {
        console.error("Failed to connect patient:", error);

        // Connection failed, so allow the user
        // to scan another QR after closing alert.
        Alert.alert(
          "Connection Failed",
          error?.response?.data?.message ??
            "Unable to connect to this patient. Please try again.",
          [
            {
              text: "OK",
              onPress: () => {
                setScannerPaused(false);
              },
            },
          ],
          {
            cancelable: false,
          },
        );
      }
    } catch (error) {
      console.error("Invalid QR code:", error);

      Alert.alert(
        "Invalid QR Code",
        "This is not a valid patient QR code. Please scan again.",
        [
          {
            text: "OK",
            onPress: () => {
              setScannerPaused(false);
            },
          },
        ],
        {
          cancelable: false,
        },
      );
    }
  };

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
      </View>
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
});
