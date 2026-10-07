import CustomAlertModal, { AlertModalType } from "@/components/ui/CustomAlertModal";
import AccountInformation from "@/components/feature/nonpatient/settings/profile/AccountInformation";
import EditProfileButton from "@/components/feature/nonpatient/settings/profile/EditProfileButton";
import ProfileHeader from "@/components/feature/nonpatient/settings/profile/ProfileHeader";
import RoleInformation from "@/components/feature/nonpatient/settings/profile/RoleInformation";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/lib/axios";
import {
  formatPhilippinePhoneNumber,
  isValidPhilippinePhoneNumber,
} from "@/utils/phone";
import { capitalizeWords, formatNameInput } from "@/utils/string";
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

export default function ProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phoneNumber, setPhoneNumber] = useState(
    user?.emergencyContact || "",
  );
  const [saving, setSaving] = useState(false);

  // Custom alert modal
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

  useEffect(() => {
    if (!isEditing) {
      setFirstName(user?.firstName || "");
      setLastName(user?.lastName || "");
      setPhoneNumber(user?.emergencyContact || "");
    }
  }, [user, isEditing]);

  const fullName =
    capitalizeWords([firstName, lastName].filter(Boolean).join(" ")) || "User";

  const email = user?.email || "";

  const roleTitle =
    user?.role === "NON_PATIENT"
      ? "Family / Caregiver"
      : user?.role === "PATIENT"
        ? "Patient"
        : "Family / Caregiver";

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/nonpatient/dashboard/settings");
    }
  };

  const handleCancelEdit = () => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setPhoneNumber(user?.emergencyContact || "");
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!user?.id) {
      setAlertModal({
        visible: true,
        type: "error",
        title: "Error",
        message: "User information is unavailable.",
        confirmText: "OK",
      });
      return;
    }

    const formattedFirst = capitalizeWords(firstName);
    const formattedLast = capitalizeWords(lastName);

    if (!formattedFirst) {
      setAlertModal({
        visible: true,
        type: "warning",
        title: "Invalid Information",
        message: "First name is required.",
        confirmText: "OK",
      });
      return;
    }

    if (!formattedLast) {
      setAlertModal({
        visible: true,
        type: "warning",
        title: "Invalid Information",
        message: "Last name is required.",
        confirmText: "OK",
      });
      return;
    }

    if (!phoneNumber.trim()) {
      setAlertModal({
        visible: true,
        type: "warning",
        title: "Invalid Information",
        message: "Phone number is required.",
        confirmText: "OK",
      });
      return;
    }

    if (!isValidPhilippinePhoneNumber(phoneNumber.trim())) {
      setAlertModal({
        visible: true,
        type: "warning",
        title: "Invalid Phone Number",
        message: "Please enter a valid Philippine mobile number (e.g. +63 9XX XXX XXXX).",
        confirmText: "OK",
      });
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("email", user.email);
      formData.append("firstName", formattedFirst);
      formData.append("lastName", formattedLast);
      formData.append("emergencyContact", phoneNumber.trim());

      const response = await axiosInstance.put(
        "/api/user/v1/update-user",
        formData,
      );

      console.log("Updated profile:", response.data);

      const updatedUser =
        response?.data?.data?.user ??
        response?.data?.data ??
        response?.data?.user;

      if (updatedUser) {
        await updateUser(updatedUser);
      } else {
        await updateUser({
          ...user,
          firstName: formattedFirst,
          lastName: formattedLast,
          emergencyContact: phoneNumber.trim(),
        });
      }

      setFirstName(formattedFirst);
      setLastName(formattedLast);
      setIsEditing(false);

      setAlertModal({
        visible: true,
        type: "success",
        title: "Profile Updated",
        message: "Your profile information has been updated successfully.",
        confirmText: "OK",
      });
    } catch (error: any) {
      console.error("Failed to update profile:", error);

      const message =
        error?.response?.data?.message ||
        "Failed to update your profile. Please try again.";

      setAlertModal({
        visible: true,
        type: "error",
        title: "Update Failed",
        message,
        confirmText: "OK",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      <View style={styles.backgroundAccent} pointerEvents="none" />

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

        <Text style={styles.headerTitle}>Profile</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader name={fullName} roleTitle={roleTitle} />

        <AccountInformation
          firstName={firstName}
          lastName={lastName}
          email={email}
          phoneNumber={phoneNumber}
          editable={isEditing}
          onFirstNameChange={(val) => setFirstName(formatNameInput(val))}
          onLastNameChange={(val) => setLastName(formatNameInput(val))}
          onPhoneNumberChange={(val) =>
            setPhoneNumber(formatPhilippinePhoneNumber(val.replace(/[\r\n]/g, "")))
          }
        />

        <RoleInformation accountType={roleTitle} />

        <EditProfileButton
          isEditing={isEditing}
          loading={saving}
          onPress={isEditing ? handleSaveProfile : () => setIsEditing(true)}
          onCancel={handleCancelEdit}
          style={styles.editButton}
          disabled={saving}
        />
      </ScrollView>

      <CustomAlertModal
        visible={alertModal.visible}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        confirmText={alertModal.confirmText || "OK"}
        onConfirm={() => setAlertModal((prev) => ({ ...prev, visible: false }))}
        onClose={() => setAlertModal((prev) => ({ ...prev, visible: false }))}
      />
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  editButton: {
    marginTop: 8,
    marginBottom: 20,
  },
  loading: {
    marginTop: -10,
    marginBottom: 20,
  },
});