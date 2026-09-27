import AccountInformation from "@/components/feature/nonpatient/settings/profile/AccountInformation";
import EditProfileButton from "@/components/feature/nonpatient/settings/profile/EditProfileButton";
import ProfileHeader from "@/components/feature/nonpatient/settings/profile/ProfileHeader";
import RoleInformation from "@/components/feature/nonpatient/settings/profile/RoleInformation";
import PatientMedicalInformation from "@/components/feature/patient/settings/PatientMedicalInformation";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/lib/axios";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phoneNumber, setPhoneNumber] = useState(
    user?.emergencyContact || "",
  );
  const [age, setAge] = useState(
    user?.patientProfile?.age ? String(user.patientProfile.age) : "",
  );
  const [gender, setGender] = useState(user?.patientProfile?.gender || "");
  const [medicalConditions, setMedicalConditions] = useState(
    user?.patientProfile?.medicalConditions || "",
  );
  const [notes, setNotes] = useState(user?.patientProfile?.notes || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setFirstName(user?.firstName || "");
      setLastName(user?.lastName || "");
      setPhoneNumber(user?.emergencyContact || "");
      setAge(user?.patientProfile?.age ? String(user.patientProfile.age) : "");
      setGender(user?.patientProfile?.gender || "");
      setMedicalConditions(user?.patientProfile?.medicalConditions || "");
      setNotes(user?.patientProfile?.notes || "");
    }
  }, [user, isEditing]);

  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") ||
    (user?.role === "PATIENT" ? "Patient" : "Caregiver / Family");

  const email = user?.email || "";

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

  const handleCancelEdit = () => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setPhoneNumber(user?.emergencyContact || "");
    setAge(user?.patientProfile?.age ? String(user.patientProfile.age) : "");
    setGender(user?.patientProfile?.gender || "");
    setMedicalConditions(user?.patientProfile?.medicalConditions || "");
    setNotes(user?.patientProfile?.notes || "");
    setIsEditing(false);
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

      if (user.role === "PATIENT") {
        if (age.trim()) formData.append("age", age.trim());
        if (gender.trim()) formData.append("gender", gender.trim());
        if (medicalConditions.trim())
          formData.append("medicalConditions", medicalConditions.trim());
        if (notes.trim()) formData.append("notes", notes.trim());
      }

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
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          emergencyContact: phoneNumber.trim(),
          patientProfile:
            user.role === "PATIENT"
              ? {
                  ...(user.patientProfile || {
                    id: "",
                    userId: user.id,
                    connectionCode: "",
                    emergencyContact: phoneNumber.trim(),
                  }),
                  age: age.trim() ? Number(age.trim()) : null,
                  gender: gender.trim() || null,
                  medicalConditions: medicalConditions.trim() || null,
                  notes: notes.trim() || null,
                }
              : user.patientProfile,
        });
      }

      setIsEditing(false);

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
          editable={isEditing}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onPhoneNumberChange={setPhoneNumber}
        />

        {user?.role === "PATIENT" && (
          <PatientMedicalInformation
            age={age}
            gender={gender}
            medicalConditions={medicalConditions}
            notes={notes}
            editable={isEditing}
            onAgeChange={setAge}
            onGenderChange={setGender}
            onMedicalConditionsChange={setMedicalConditions}
            onNotesChange={setNotes}
          />
        )}

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