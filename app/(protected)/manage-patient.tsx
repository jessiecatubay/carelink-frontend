import CustomAlertModal, { AlertModalType } from "@/components/ui/CustomAlertModal";
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

  const [alertModal, setAlertModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type?: AlertModalType;
  }>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

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
      router.replace("/nonpatient/dashboard/settings");
    }
  };

  const handleEditPatient = () => {
    router.push("/nonpatient/dashboard/manage-patients");
  };

  const patient = currentConnection?.patient;
  const profile = patient?.patientProfile;

  const patientName =
    [patient?.firstName, patient?.lastName].filter(Boolean).join(" ") ||
    "Patient";
  const patientEmail = patient?.email || "No email available";
  const age = profile?.age ?? null;
  const gender = profile?.gender ?? null;
  const medicalConditions = profile?.medicalConditions ?? "";
  const notes = profile?.notes ?? "";
  const emergencyContact =
    profile?.emergencyContact || patient?.phoneNumber || null;
  const connectionCode = profile?.connectionCode || null;
  const status = currentConnection?.status ?? "DISCONNECTED";

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
          {!patient ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="person-outline" size={48} color="#0AA7A8" />
              </View>
              <Text style={styles.emptyTitle}>No Patient Connected</Text>
              <Text style={styles.emptySubtitle}>
                You haven't connected with any patient yet. Scan a patient's QR code to start monitoring.
              </Text>
              <EditPatientButton
                title="Pair New Patient"
                onPress={() => router.push("/nonpatient/dashboard/scan-patient")}
                style={styles.pairButton}
              />
            </View>
          ) : (
            <>
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
                  setAlertModal({
                    visible: true,
                    type: "info",
                    title: "Medical Conditions",
                    message:
                      "To modify diagnosed medical conditions, please consult the healthcare supervisor.",
                  })
                }
                onEditNotes={() =>
                  setAlertModal({
                    visible: true,
                    type: "info",
                    title: "Care Notes",
                    message:
                      "Care notes are synchronized in real-time with family members.",
                  })
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
            </>
          )}
        </ScrollView>
      )}

      <CustomAlertModal
        visible={alertModal.visible}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        confirmText="OK"
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
  emptyContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 28,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyIconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#EDFBFB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#0AA7A8",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E242B",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  pairButton: {
    width: "100%",
  },
  editButton: {
    marginTop: 8,
    marginBottom: 20,
  },
});
