import EditPatientButton from "@/components/feature/nonpatient/settings/manage-patient/EditPatientButton";
import EmergencyContactCard from "@/components/feature/nonpatient/settings/manage-patient/EmergencyContactCard";
import ManagePatientHeader from "@/components/feature/nonpatient/settings/manage-patient/ManagePatientHeader";
import MedicalInformation from "@/components/feature/nonpatient/settings/manage-patient/MedicalInformation";
import PatientInformation from "@/components/feature/nonpatient/settings/manage-patient/PatientInformation";
import PatientProfileCard from "@/components/feature/nonpatient/settings/manage-patient/PatientProfileCard";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/lib/axios";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Resident = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  patientProfile?: {
    age?: number | null;
    gender?: string | null;
    medicalConditions?: string | null;
    notes?: string | null;
    emergencyContact?: string | null;
    connectionCode?: string | null;
  } | null;
};

type Connection = {
  id?: string;
  patient?: Resident | null;
  status?: string;
  currentPatient?: boolean;
};

export default function ManagePatientScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentConnection, setCurrentConnection] = useState<Connection | null>(
    null,
  );

  const loadPatientData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/api/user/v1/get-user-by-id",
        { id: user.id },
      );
      const connections: Connection[] =
        response.data?.data?.nonPatientConnections || [];

      // Find currently selected patient, or default to first connection
      const active =
        connections.find((c) => c.currentPatient) ||
        connections[0] ||
        null;

      setCurrentConnection(active);
    } catch (error) {
      console.error("Failed to load patient profile:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPatientData();
  }, [user?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    loadPatientData();
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/nonpatient/dashboard/(tabs)/settings");
    }
  };

  const handleEditPatient = () => {
    Alert.alert(
      "Manage Patients",
      "Would you like to switch patients or pair a new device?",
      [
        {
          text: "Switch Patient",
          onPress: () => router.push("/nonpatient/dashboard/manage-patients"),
        },
        {
          text: "Pair New Patient",
          onPress: () => router.push("/nonpatient/dashboard/scan-patient"),
        },
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  const patient = currentConnection?.patient;
  const profile = patient?.patientProfile;

  const patientName =
    [patient?.firstName, patient?.lastName].filter(Boolean).join(" ") ||
    "Elderly Resident";
  const patientEmail = patient?.email || "No email available";
  const age = profile?.age ?? 74;
  const gender = profile?.gender ?? "Female";
  const medicalConditions =
    profile?.medicalConditions ?? "Hypertension, Mild Arthritis, Type 2 Diabetes";
  const notes =
    profile?.notes ??
    "Prefers morning walks. Takes prescribed hypertension medication at 8:00 AM daily after breakfast.";
  const emergencyContact = profile?.emergencyContact ?? "+63 912 345 6789";
  const connectionCode = profile?.connectionCode ?? "CARE-8821";
  const status = currentConnection?.status ?? "CONNECTED";

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      {/* Curved Background Accent */}
      <View style={styles.backgroundAccent} pointerEvents="none" />

      {/* Header */}
      <ManagePatientHeader
        title="Manage Patient"
        onBack={handleGoBack}
        rightAction={
          <Ionicons
            name="people-outline"
            size={22}
            color="#0AA7A8"
            onPress={() => router.push("/nonpatient/dashboard/manage-patients")}
          />
        }
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0AA7A8" />
          <Text style={styles.loadingText}>Loading patient details...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#0AA7A8"
            />
          }
        >
          {/* Patient Profile Card */}
          <PatientProfileCard
            name={patientName}
            age={age}
            gender={gender}
            connectionStatus={status}
            connectionCode={connectionCode}
          />

          {/* Personal Information */}
          <PatientInformation
            fullName={patientName}
            age={age}
            gender={gender}
            email={patientEmail}
            relationship="Primary Monitored Patient"
          />

          {/* Medical & Illness Details */}
          <MedicalInformation
            medicalConditions={medicalConditions}
            notes={notes}
            onEditConditions={() =>
              Alert.alert(
                "Medical Conditions",
                "To modify diagnosed medical conditions, please consult the healthcare supervisor.",
              )
            }
            onEditNotes={() =>
              Alert.alert(
                "Care Notes",
                "Care notes are synchronized in real-time with family members.",
              )
            }
          />

          {/* Emergency Contact */}
          <EmergencyContactCard
            contactName={`${patientName}'s Emergency Contact`}
            phoneNumber={emergencyContact}
            relationship="Caregiver / Emergency"
          />

          {/* Action Button */}
          <EditPatientButton
            title="Manage Connected Patients"
            onPress={handleEditPatient}
            style={styles.editButton}
          />
        </ScrollView>
      )}
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
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748B",
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
