import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export type PatientPreviewData = {
  patientId: string;
  firstName?: string | null;
  lastName?: string | null;
  age?: number | null;
  gender?: string | null;
  medicalConditions?: string | null;
  notes?: string | null;
  connectionCode: string;
};

export type PatientPairingFlowModalProps = {
  visible: boolean;
  patient: PatientPreviewData | null;
  loadingPatient?: boolean;
  connecting?: boolean;
  onClose: () => void;
  onConnect: (relationship: string) => void;
};

const SUGGESTED_RELATIONSHIPS = [
  "Daughter",
  "Son",
  "Spouse",
  "Mother",
  "Father",
  "Sister",
  "Brother",
  "Primary Caregiver",
  "Doctor",
  "Nurse",
  "Grandchild",
  "Friend",
];

export default function PatientPairingFlowModal({
  visible,
  patient,
  loadingPatient = false,
  connecting = false,
  onClose,
  onConnect,
}: PatientPairingFlowModalProps) {
  // Step: 1 = Patient Profile Preview, 2 = Relationship Input
  const [step, setStep] = useState<1 | 2>(1);
  const [relationship, setRelationship] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const patientFullName =
    [patient?.firstName, patient?.lastName].filter(Boolean).join(" ") ||
    "Patient";

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const f = (firstName || "").trim().charAt(0).toUpperCase();
    const l = (lastName || "").trim().charAt(0).toUpperCase();
    return f || l ? `${f}${l}` : "PT";
  };

  const handleSelectPill = (val: string) => {
    setRelationship(val);
    setError(null);
  };

  const handleNextStep = () => {
    setStep(2);
    setError(null);
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setError(null);
  };

  const handleFinalConnect = () => {
    const trimmed = relationship.trim();
    if (!trimmed) {
      setError("Please specify your relationship to the patient.");
      return;
    }
    setError(null);
    onConnect(trimmed);
  };

  const handleModalClose = () => {
    if (connecting) return;
    setStep(1);
    setRelationship("");
    setError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleModalClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.backdrop}
      >
        <Pressable style={styles.overlayTouch} onPress={handleModalClose} />

        <View style={styles.container}>
          {/* Drag handle */}
          <View style={styles.dragHandle} />

          {loadingPatient ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0AA7A8" />
              <Text style={styles.loadingText}>Fetching patient profile...</Text>
            </View>
          ) : step === 1 ? (
            /* ======================================================== */
            /* STEP 1: PATIENT PROFILE VERIFICATION PREVIEW             */
            /* ======================================================== */
            <View>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.iconCircle}>
                  <Ionicons name="shield-checkmark" size={24} color="#0AA7A8" />
                </View>
                <View style={styles.headerTextWrap}>
                  <Text style={styles.title}>Confirm Patient</Text>
                  <Text style={styles.subtitle}>
                    You are connecting to this patient:
                  </Text>
                </View>
              </View>

              {/* Patient Profile Card */}
              <View style={styles.profileCard}>
                <View style={styles.profileHeaderRow}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>
                      {getInitials(patient?.firstName, patient?.lastName)}
                    </Text>
                  </View>
                  <View style={styles.profileDetailsCol}>
                    <Text style={styles.patientNameText} numberOfLines={1}>
                      {patientFullName}
                    </Text>
                    <View style={styles.metaRow}>
                      {patient?.age ? (
                        <View style={styles.metaBadge}>
                          <Text style={styles.metaBadgeText}>
                            {patient.age} yrs old
                          </Text>
                        </View>
                      ) : null}
                      {patient?.gender ? (
                        <View style={styles.metaBadge}>
                          <Text style={styles.metaBadgeText}>
                            {patient.gender}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </View>

                {/* Additional Patient Info if available */}
                {patient?.medicalConditions ? (
                  <View style={styles.infoRow}>
                    <Ionicons
                      name="medkit-outline"
                      size={16}
                      color="#0AA7A8"
                      style={{ marginTop: 2, marginRight: 8 }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>Medical Conditions:</Text>
                      <Text style={styles.infoValue} numberOfLines={2}>
                        {patient.medicalConditions}
                      </Text>
                    </View>
                  </View>
                ) : null}

                {/* Connection Code Badge */}
                <View style={styles.codeRow}>
                  <Ionicons name="key-outline" size={14} color="#64748B" />
                  <Text style={styles.codeLabel}>Device Code:</Text>
                  <Text style={styles.codeValue}>
                    {patient?.connectionCode || "N/A"}
                  </Text>
                </View>
              </View>

              {/* Verification Notice */}
              <View style={styles.noticeBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color="#0891B2"
                  style={{ marginRight: 8, marginTop: 1 }}
                />
                <Text style={styles.noticeText}>
                  Please verify this is the patient you want to monitor and receive urgent alert notifications from.
                </Text>
              </View>

              {/* Step 1 Actions */}
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleModalClose}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleNextStep}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmButtonText}>Confirm Patient</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color="#FFFFFF"
                    style={{ marginLeft: 6 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* ======================================================== */
            /* STEP 2: RELATIONSHIP INPUT & FINAL CONNECT               */
            /* ======================================================== */
            <View>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.iconCircle}>
                  <Ionicons name="people" size={24} color="#0AA7A8" />
                </View>
                <View style={styles.headerTextWrap}>
                  <Text style={styles.title}>Your Relationship</Text>
                  <Text style={styles.subtitle}>
                    How are you related to {patientFullName}?
                  </Text>
                </View>
              </View>

              <Text style={styles.infoText}>
                {patientFullName} will see your name and this relationship in their connected accounts list so they know who receives their alerts.
              </Text>

              {/* Quick Selection Pills */}
              <Text style={styles.sectionLabel}>
                Select or type your relationship:
              </Text>
              <View style={styles.pillsWrap}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.pillsScrollContent}
                >
                  {SUGGESTED_RELATIONSHIPS.map((rel) => {
                    const isSelected =
                      relationship.trim().toLowerCase() === rel.toLowerCase();
                    return (
                      <TouchableOpacity
                        key={rel}
                        style={[styles.pill, isSelected && styles.pillSelected]}
                        onPress={() => handleSelectPill(rel)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.pillText,
                            isSelected && styles.pillTextSelected,
                          ]}
                        >
                          {rel}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Custom Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    isFocused ? styles.inputFocused : null,
                    error ? styles.inputError : null,
                  ]}
                  placeholder="e.g. Daughter, Spouse, Primary Doctor..."
                  placeholderTextColor="#94A3B8"
                  value={relationship}
                  onChangeText={(text) => {
                    setRelationship(text);
                    if (error) setError(null);
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  autoCapitalize="words"
                  editable={!connecting}
                />
                {error && <Text style={styles.errorText}>{error}</Text>}
              </View>

              {/* Step 2 Actions */}
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleBackToStep1}
                  disabled={connecting}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="arrow-back"
                    size={16}
                    color="#64748B"
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.cancelButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    connecting && styles.buttonDisabled,
                  ]}
                  onPress={handleFinalConnect}
                  disabled={connecting}
                  activeOpacity={0.8}
                >
                  {connecting ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Text style={styles.confirmButtonText}>Connect</Text>
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="#FFFFFF"
                        style={{ marginLeft: 6 }}
                      />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  overlayTouch: {
    flex: 1,
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#CBD5E1",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  loadingContainer: {
    paddingVertical: 36,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EDFBFB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    borderWidth: 1.5,
    borderColor: "#B2EBF2",
  },
  headerTextWrap: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  subtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    padding: 16,
    marginBottom: 14,
    shadowColor: "#0AA7A8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  profileHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#0AA7A8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  profileDetailsCol: {
    flex: 1,
  },
  patientNameText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    gap: 6,
  },
  metaBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  metaBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 10,
    marginTop: 6,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#475569",
  },
  infoValue: {
    fontSize: 12,
    color: "#1E293B",
    marginTop: 1,
  },
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  codeLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  codeValue: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0AA7A8",
    letterSpacing: 1,
  },
  noticeBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#EDFBFB",
    borderWidth: 1,
    borderColor: "#B2EBF2",
    borderRadius: 12,
    padding: 10,
    marginBottom: 18,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: "#0E7490",
    lineHeight: 17,
  },
  infoText: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 18,
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  pillsWrap: {
    marginBottom: 14,
  },
  pillsScrollContent: {
    gap: 8,
    paddingRight: 16,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  pillSelected: {
    backgroundColor: "#0AA7A8",
    borderColor: "#0AA7A8",
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  pillTextSelected: {
    color: "#FFFFFF",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    paddingHorizontal: 16,
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
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  confirmButton: {
    flex: 2,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#0AA7A8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0AA7A8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
