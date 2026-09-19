import AccountInformation from "@/components/feature/nonpatient/settings/profile/AccountInformation";
import EditProfileButton from "@/components/feature/nonpatient/settings/profile/EditProfileButton";
import ProfileHeader from "@/components/feature/nonpatient/settings/profile/ProfileHeader";
import RoleInformation from "@/components/feature/nonpatient/settings/profile/RoleInformation";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
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

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    (user?.role === "PATIENT" ? "Patient Resident" : "Caregiver / Family");
  const email = user?.email || "user@carelink.com";
  const phoneNumber = user?.phoneNumber || "+63 900 000 0000";
  const roleTitle =
    user?.role === "NON_PATIENT"
      ? "Family / Caregiver"
      : user?.role === "PATIENT"
        ? "Patient"
        : "User";

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      if (user?.role === "PATIENT") {
        router.replace("/(protected)/(patient)/settings");
      } else {
        router.replace("/(protected)/(non-patient)/settings");
      }
    }
  };

  const handleEditProfile = () => {
    Alert.alert(
      "Edit Profile",
      "Edit profile functionality will be available in the upcoming update.",
      [{ text: "OK" }],
    );
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

        <Text style={styles.headerTitle}>Profile</Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader name={fullName} roleTitle={roleTitle} />

        <AccountInformation
          fullName={fullName}
          email={email}
          phoneNumber={phoneNumber}
          onFullNamePress={() => {}}
          onEmailPress={() => {}}
          onPhonePress={() => {}}
        />

        <RoleInformation
          accountType={roleTitle}
          onPress={() =>
            Alert.alert(
              "Account Type",
              `Your account role is currently configured as ${roleTitle}.`,
            )
          }
        />

        <EditProfileButton onPress={handleEditProfile} style={styles.editButton} />
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
});
