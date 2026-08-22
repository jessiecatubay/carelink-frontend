import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "@/components/ui/Button";
import PaginationDots from "@/components/ui/PaginationDots";

type DevicePairingProps = {
  onConnect: (code: string) => void;
  onScanQR: () => void;
};

export default function DevicePairing({ onConnect, onScanQR }: DevicePairingProps) {
  const [pairingCode, setPairingCode] = useState("");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardContainer}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.paginationWrap}>
          <PaginationDots currentIndex={4} total={6} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Device Pairing</Text>

        {/* Card Container */}
        <View style={styles.card}>
          <Text style={styles.label}>Enter Pairing Code</Text>
          
          <TextInput
            style={styles.input}
            placeholder=""
            placeholderTextColor="#9CA3AF"
            value={pairingCode}
            onChangeText={setPairingCode}
            keyboardType="default"
            autoCapitalize="characters"
          />

          {/* Divider Row */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Scan QR Code Outline Button */}
          <TouchableOpacity style={styles.qrButton} onPress={onScanQR} activeOpacity={0.8}>
            <Image
              source={require("@/assets/icons/qr-code.png")}
              style={styles.qrIcon}
              resizeMode="contain"
            />
            <Text style={styles.qrButtonText}>Scan QR Code</Text>
          </TouchableOpacity>

          <Text style={styles.helperText}>
            Use the code shown on the device
          </Text>
        </View>

        {/* Bottom Button */}
        <View style={styles.buttonWrap}>
          <Button
            title="Connect Device"
            onPress={() => onConnect(pairingCode)}
            disabled={!pairingCode.trim()}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  paginationWrap: {
    marginTop: 100,
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#12A5B5",
    textAlign: "center",
    marginBottom: 24,
  },
  card: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 24,
    padding: 24,
    backgroundColor: "#FFFFFF",
    marginBottom: 40,
    // Soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: "#4B5563",
    marginBottom: 12,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#4B5563",
    borderRadius: 18,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: "500",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#D1D5DB",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#9CA3AF",
    fontSize: 14,
  },
  qrButton: {
    flexDirection: "row",
    height: 52,
    borderWidth: 1.5,
    borderColor: "#12A5B5",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },
  qrIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: "#12A5B5",
  },
  qrButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#12A5B5",
  },
  helperText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 13,
  },
  buttonWrap: {
    marginBottom: 40,
  },
  button: {
    width: "100%",
  },
});
