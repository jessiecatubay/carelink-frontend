import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/lib/axios";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function RegisterDeviceSection() {
  const {user} = useAuth();
  const [deviceId, setDeviceId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegisterDevice = async () => {
    const trimmedDeviceId = deviceId.trim();

    if (!trimmedDeviceId) {
      Alert.alert("Device ID Required", "Please enter your device ID.");
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post("/api/patient-profile/v1/register-device-owned", {
        patientId: user?.id,
        deviceId: trimmedDeviceId,
      });

      Alert.alert(
        "Device Registered",
        "Your CareLink device has been successfully registered.",
      );

      setDeviceId("");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Unable to register the device. Please try again.";

      Alert.alert("Registration Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="watch-outline" size={22} color="#0F766E" />
        </View>

        <View style={styles.headerText}>
          <Text style={styles.title}>Register Device Owned</Text>

          <Text style={styles.description}>
            Register your CareLink device to your patient account.
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.label}>Device ID</Text>

      <TextInput
        value={deviceId}
        onChangeText={setDeviceId}
        placeholder="e.g. CL-WRIST-001"
        placeholderTextColor="#94A3B8"
        autoCapitalize="characters"
        autoCorrect={false}
        style={styles.input}
        editable={!loading}
      />

      <Text style={styles.helper}>
        You can find the Device ID printed on your CareLink device or its
        packaging.
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title={loading ? "Registering..." : "Register Device"}
          onPress={handleRegisterDevice}
          disabled={loading}
        />

        {loading && (
          <ActivityIndicator
            size="small"
            color="#0F766E"
            style={styles.loader}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#CCFBF1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },

  description: {
    fontSize: 13,
    lineHeight: 19,
    color: "#64748B",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
  },

  helper: {
    fontSize: 12,
    lineHeight: 18,
    color: "#64748B",
    marginTop: 8,
  },

  buttonContainer: {
    marginTop: 16,
    position: "relative",
  },

  loader: {
    position: "absolute",
    right: 20,
    top: 14,
  },
});
