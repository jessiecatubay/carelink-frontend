import AccountInformation from "@/components/feature/nonpatient/settings/profile/AccountInformation";
import EditProfileButton from "@/components/feature/nonpatient/settings/profile/EditProfileButton";
import ProfileHeader from "@/components/feature/nonpatient/settings/profile/ProfileHeader";
import RoleInformation from "@/components/feature/nonpatient/settings/profile/RoleInformation";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/lib/axios";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phoneNumber, setPhoneNumber] = useState(
    user?.emergencyContact || "",
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setPhoneNumber(user?.emergencyContact || "");
  }, [user]);

  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || "Zayn Malik";

  const email = user?.email || "zaynmalik@gmail.com";

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
      router.replace("/nonpatient/dashboard/(tabs)/settings");
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id) {
      Alert.alert("Error", "User information is unavailable.");
      return;
    }

    if (!firstName.trim()) {
      Alert.alert("Invalid Information", "First name is required.");
      return;
    }

    if (!lastName.trim()) {
      Alert.alert("Invalid Information", "Last name is required.");
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert("Invalid Information", "Phone number is required.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("email", user.email);
      formData.append("firstName", firstName.trim());
      formData.append("lastName", lastName.trim());
      formData.append("emergencyContact", phoneNumber.trim());

      const response = await axiosInstance.put(
        "/api/user/v1/update-user",
        formData,
      );

      console.log("Updated profile:", response.data);

      Alert.alert(
        "Profile Updated",
        "Your profile information has been updated successfully.",
      );
    } catch (error: any) {
      console.error("Failed to update profile:", error);

      const message =
        error?.response?.data?.message ||
        "Failed to update your profile. Please try again.";

      Alert.alert("Update Failed", message);
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
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onPhoneNumberChange={setPhoneNumber}
        />

        <RoleInformation
          accountType={roleTitle}
          onPress={() =>
            Alert.alert(
              "Account Type",
              `Your account role is ${roleTitle}.`,
            )
          }
        />

        <EditProfileButton
          onPress={handleSaveProfile}
          style={styles.editButton}
          disabled={saving}
        />

        {saving && (
          <ActivityIndicator
            size="small"
            color="#0AA7A8"
            style={styles.loading}
          />
        )}
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