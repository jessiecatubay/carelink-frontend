import CustomAlertModal, { AlertModalType } from "@/components/ui/CustomAlertModal";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/lib/axios";
import { getMe } from "@/services/auth";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterDeviceSection() {
  const { user, updateUser } = useAuth();
  const [deviceId, setDeviceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [confirmRemoveVisible, setConfirmRemoveVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Explicit device ownership conflict state
  const [ownershipStatus, setOwnershipStatus] = useState<{
    alreadyOwned: boolean;
    isOwnedBySelf: boolean;
    conflictingDeviceId?: string;
    message?: string;
  } | null>(null);

  // Inline input validation / error message
  const [inputError, setInputError] = useState<string | null>(null);

  // Custom alert modal (for results/warnings)
  const [alertModal, setAlertModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type?: AlertModalType;
    confirmText?: string;
  }>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  const currentDevice = user?.patientProfile?.deviceOwned;

  const handleTextChange = (text: string) => {
    setDeviceId(text);
    if (ownershipStatus) {
      setOwnershipStatus(null);
    }
    if (inputError) {
      setInputError(null);
    }
  };

  const handleRegisterDevice = async () => {
    const trimmedDeviceId = deviceId.trim();

    if (!trimmedDeviceId) {
      setInputError("Please enter your device ID.");
      setAlertModal({
        visible: true,
        type: "warning",
        title: "Device ID Required",
        message: "Please enter your CareLink device ID.",
        confirmText: "OK",
      });
      return;
    }

    // Pre-check if patient is entering the exact device already registered to them
    if (
      currentDevice &&
      trimmedDeviceId.toLowerCase() === currentDevice.toLowerCase()
    ) {
      setOwnershipStatus({
        alreadyOwned: true,
        isOwnedBySelf: true,
        conflictingDeviceId: trimmedDeviceId,
        message: "This device is already registered to your account.",
      });
      setInputError("This device is already registered to your account.");
      setAlertModal({
        visible: true,
        type: "info",
        title: "Device Already Registered",
        message:
          "This CareLink device is already active and registered to your account.",
        confirmText: "OK",
      });
      return;
    }

    try {
      setLoading(true);
      setInputError(null);
      setOwnershipStatus(null);

      await axiosInstance.post(
        "/api/patient-profile/v1/register-device-owned",
        {
          patientId: user?.id,
          deviceId: trimmedDeviceId,
        }
      );

      // Re-fetch latest user profile or sync state immediately
      try {
        const meRes = await getMe();
        if (meRes?.data?.data?.user) {
          await updateUser(meRes.data.data.user);
        } else if (user) {
          await updateUser({
            ...user,
            patientProfile: user.patientProfile
              ? { ...user.patientProfile, deviceOwned: trimmedDeviceId }
              : {
                  id: "",
                  userId: user.id || "",
                  connectionCode: "",
                  age: null,
                  gender: null,
                  notes: null,
                  emergencyContact: null,
                  medicalConditions: null,
                  deviceOwned: trimmedDeviceId,
                },
          });
        }
      } catch {
        if (user) {
          await updateUser({
            ...user,
            patientProfile: user.patientProfile
              ? { ...user.patientProfile, deviceOwned: trimmedDeviceId }
              : {
                  id: "",
                  userId: user.id || "",
                  connectionCode: "",
                  age: null,
                  gender: null,
                  notes: null,
                  emergencyContact: null,
                  medicalConditions: null,
                  deviceOwned: trimmedDeviceId,
                },
          });
        }
      }

      setDeviceId("");
      setOwnershipStatus(null);
      setInputError(null);

      setAlertModal({
        visible: true,
        type: "success",
        title: "Device Registered",
        message: `Your CareLink device "${trimmedDeviceId}" has been successfully registered to your account.`,
        confirmText: "Done",
      });
    } catch (error: any) {
      const status = error?.response?.status;
      const responseData = error?.response?.data;
      const isAlreadyOwned =
        status === 409 || Boolean(responseData?.alreadyOwned);
      const isOwnedBySelf = Boolean(responseData?.isOwnedBySelf);
      const message =
        responseData?.message ||
        (isAlreadyOwned
          ? "This device is already owned and registered to another account."
          : "Unable to register the device. Please try again.");

      if (isAlreadyOwned) {
        setOwnershipStatus({
          alreadyOwned: true,
          isOwnedBySelf,
          conflictingDeviceId: trimmedDeviceId,
          message,
        });
        setInputError(message);

        setAlertModal({
          visible: true,
          type: isOwnedBySelf ? "info" : "warning",
          title: isOwnedBySelf
            ? "Device Already Registered"
            : "Device Already Owned",
          message: isOwnedBySelf
            ? "This device is already registered to your account."
            : `Device "${trimmedDeviceId}" is already owned and registered to another account. Each CareLink device can only be assigned to one patient.`,
          confirmText: "Understood",
        });
      } else {
        setInputError(message);
        setAlertModal({
          visible: true,
          type: "error",
          title: "Registration Failed",
          message,
          confirmText: "Try Again",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRemoveDevice = async () => {
    try {
      setRemoving(true);

      await axiosInstance.post("/api/patient-profile/v1/remove-device-owned", {
        patientId: user?.id,
      });

      // Sync state immediately
      try {
        const meRes = await getMe();
        if (meRes?.data?.data?.user) {
          await updateUser(meRes.data.data.user);
        } else if (user && user.patientProfile) {
          await updateUser({
            ...user,
            patientProfile: {
              ...user.patientProfile,
              deviceOwned: null,
            },
          });
        }
      } catch {
        if (user && user.patientProfile) {
          await updateUser({
            ...user,
            patientProfile: {
              ...user.patientProfile,
              deviceOwned: null,
            },
          });
        }
      }

      setConfirmRemoveVisible(false);
      setOwnershipStatus(null);
      setInputError(null);
      setDeviceId("");

      setAlertModal({
        visible: true,
        type: "success",
        title: "Device Removed",
        message: `Device "${currentDevice}" has been successfully removed from your account.`,
        confirmText: "OK",
      });
    } catch (error: any) {
      setConfirmRemoveVisible(false);
      const message =
        error?.response?.data?.message ||
        "Unable to remove the registered device. Please try again.";

      setAlertModal({
        visible: true,
        type: "error",
        title: "Removal Failed",
        message,
        confirmText: "Try Again",
      });
    } finally {
      setRemoving(false);
    }
  };

  const hasError = Boolean(ownershipStatus?.alreadyOwned || inputError);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="watch-outline" size={22} color="#0F766E" />
        </View>

        <View style={styles.headerText}>
          <Text style={styles.title}>
            {currentDevice ? "Manage CareLink Device" : "Register Device Owned"}
          </Text>
          <Text style={styles.description}>
            {currentDevice
              ? "View, switch, or remove your registered CareLink health monitor."
              : "Link your personal CareLink health monitor to your account."}
          </Text>
        </View>
      </View>

      {/* Currently Registered Device Card */}
      {currentDevice ? (
        <View style={styles.currentDeviceCard}>
          <View style={styles.currentDeviceHeader}>
            <View style={styles.currentDeviceIconBox}>
              <Ionicons
                name="hardware-chip-outline"
                size={20}
                color="#0F766E"
              />
            </View>

            <View style={styles.currentDeviceInfo}>
              <View style={styles.currentDeviceTopRow}>
                <Text style={styles.currentDeviceTag}>
                  CURRENT REGISTERED DEVICE
                </Text>
                <View style={styles.activePill}>
                  <View style={styles.activePillDot} />
                  <Text style={styles.activePillText}>Active</Text>
                </View>
              </View>

              <Text style={styles.currentDeviceIdText}>{currentDevice}</Text>
              <Text style={styles.currentDeviceSubtext}>
                Health vitals from this device are actively synced to your
                profile.
              </Text>
            </View>
          </View>

          {/* Action Footer to Remove Device */}
          <View style={styles.currentDeviceActionFooter}>
            <Text style={styles.removeHintText}>
              No longer using this device?
            </Text>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => setConfirmRemoveVisible(true)}
              disabled={removing || loading}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={14} color="#DC2626" />
              <Text style={styles.removeButtonText}>Remove Device</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <View style={styles.divider} />

      {/* Explicit "Already Owned" Alert Banner */}
      {ownershipStatus?.alreadyOwned && (
        <View
          style={[
            styles.bannerContainer,
            ownershipStatus.isOwnedBySelf
              ? styles.bannerInfo
              : styles.bannerWarning,
          ]}
        >
          <View style={styles.bannerIconBox}>
            <Ionicons
              name={
                ownershipStatus.isOwnedBySelf
                  ? "information-circle"
                  : "alert-circle"
              }
              size={24}
              color={ownershipStatus.isOwnedBySelf ? "#0284C7" : "#DC2626"}
            />
          </View>

          <View style={styles.bannerTextBox}>
            <Text
              style={[
                styles.bannerTitle,
                ownershipStatus.isOwnedBySelf
                  ? styles.bannerTitleInfo
                  : styles.bannerTitleWarning,
              ]}
            >
              {ownershipStatus.isOwnedBySelf
                ? "Device Already Registered to You"
                : "Device Already Owned"}
            </Text>

            <Text
              style={[
                styles.bannerMessage,
                ownershipStatus.isOwnedBySelf
                  ? styles.bannerMessageInfo
                  : styles.bannerMessageWarning,
              ]}
            >
              {ownershipStatus.message ||
                "This device is already owned and registered to another account."}
            </Text>

            <Text
              style={[
                styles.bannerHint,
                ownershipStatus.isOwnedBySelf
                  ? styles.bannerHintInfo
                  : styles.bannerHintWarning,
              ]}
            >
              {ownershipStatus.isOwnedBySelf
                ? "This device is already actively assigned to your patient profile."
                : "Each CareLink device has a unique serial ID and can only be linked to a single patient account. If you believe this is an error, please verify the Device ID on the device packaging or contact support."}
            </Text>
          </View>
        </View>
      )}

      {/* Form Input */}
      <Text style={styles.label}>
        {currentDevice ? "Switch to New Device ID" : "Device ID"}
      </Text>

      <TextInput
        value={deviceId}
        onChangeText={handleTextChange}
        placeholder="e.g. CL-WRIST-001"
        placeholderTextColor="#94A3B8"
        autoCapitalize="characters"
        autoCorrect={false}
        style={[
          styles.input,
          isFocused ? styles.inputFocused : null,
          hasError ? styles.inputError : null,
        ]}
        editable={!loading && !removing}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {/* Error message or Helper text */}
      {inputError ? (
        <View style={styles.errorRow}>
          <Ionicons name="close-circle" size={15} color="#DC2626" />
          <Text style={styles.errorText}>{inputError}</Text>
        </View>
      ) : (
        <Text style={styles.helper}>
          {currentDevice
            ? "Enter a new Device ID above if you want to switch to a different CareLink device."
            : "You can find the Device ID printed on your CareLink device or its packaging."}
        </Text>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title={
            loading
              ? "Registering..."
              : currentDevice
              ? "Switch to This Device"
              : "Register Device"
          }
          onPress={handleRegisterDevice}
          disabled={loading || removing}
        />

        {loading && (
          <ActivityIndicator
            size="small"
            color="#0F766E"
            style={styles.loader}
          />
        )}
      </View>

      {/* Confirmation Modal for Removing Device */}
      <CustomAlertModal
        visible={confirmRemoveVisible}
        type="delete"
        title="Remove Registered Device?"
        message={`Are you sure you want to remove device "${currentDevice}" from your account? Your vital health stats will no longer sync from this device until a new device is registered.`}
        confirmText="Remove Device"
        cancelText="Cancel"
        isDestructive={true}
        loading={removing}
        onConfirm={handleConfirmRemoveDevice}
        onCancel={() => {
          if (!removing) setConfirmRemoveVisible(false);
        }}
        onClose={() => {
          if (!removing) setConfirmRemoveVisible(false);
        }}
      />

      {/* General Alert Modal */}
      <CustomAlertModal
        visible={alertModal.visible}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        confirmText={alertModal.confirmText || "OK"}
        onConfirm={() => setAlertModal((prev) => ({ ...prev, visible: false }))}
        onClose={() => setAlertModal((prev) => ({ ...prev, visible: false }))}
      />
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

  /* Current Device Card */
  currentDeviceCard: {
    backgroundColor: "#F0FDFA",
    borderWidth: 1,
    borderColor: "#99F6E4",
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
  },

  currentDeviceHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  currentDeviceIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#CCFBF1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 2,
  },

  currentDeviceInfo: {
    flex: 1,
  },

  currentDeviceTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
  },

  currentDeviceTag: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0F766E",
    letterSpacing: 0.5,
  },

  activePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },

  activePillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#16A34A",
    marginRight: 4,
  },

  activePillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#15803D",
  },

  currentDeviceIdText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  currentDeviceSubtext: {
    fontSize: 12,
    lineHeight: 16,
    color: "#475569",
  },

  currentDeviceActionFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#CCFBF1",
  },

  removeHintText: {
    fontSize: 11.5,
    color: "#64748B",
    flex: 1,
    marginRight: 8,
  },

  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },

  removeButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#DC2626",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 16,
  },

  /* Explicit Ownership Conflict Banner */
  bannerContainer: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1.5,
  },

  bannerWarning: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
  },

  bannerInfo: {
    backgroundColor: "#F0F9FF",
    borderColor: "#BAE6FD",
  },

  bannerIconBox: {
    marginRight: 10,
    marginTop: 2,
  },

  bannerTextBox: {
    flex: 1,
  },

  bannerTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },

  bannerTitleWarning: {
    color: "#991B1B",
  },

  bannerTitleInfo: {
    color: "#075985",
  },

  bannerMessage: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
    marginBottom: 4,
  },

  bannerMessageWarning: {
    color: "#B91C1C",
  },

  bannerMessageInfo: {
    color: "#0369A1",
  },

  bannerHint: {
    fontSize: 11.5,
    lineHeight: 16,
  },

  bannerHintWarning: {
    color: "#7F1D1D",
  },

  bannerHintInfo: {
    color: "#0C4A6E",
  },

  /* Form */
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },

  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
  },

  inputFocused: {
    borderColor: "#12A5B5",
    backgroundColor: "#FFFFFF",
    shadowColor: "#12A5B5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },

  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },

  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 5,
  },

  errorText: {
    fontSize: 12,
    color: "#DC2626",
    fontWeight: "500",
    flex: 1,
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
