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

export type PatientRelationshipModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (relationship: string) => void;
  loading?: boolean;
  patientName?: string;
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

export default function PatientRelationshipModal({
  visible,
  onClose,
  onConfirm,
  loading = false,
  patientName,
}: PatientRelationshipModalProps) {
  const [relationship, setRelationship] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleSelectPill = (val: string) => {
    setRelationship(val);
    setError(null);
  };

  const handleConfirm = () => {
    const trimmed = relationship.trim();
    if (!trimmed) {
      setError("Please specify your relationship to the patient.");
      return;
    }
    setError(null);
    onConfirm(trimmed);
  };

  const handleModalClose = () => {
    if (loading) return;
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
          {/* Handle bar */}
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="people" size={24} color="#0AA7A8" />
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.title}>Your Relationship</Text>
              <Text style={styles.subtitle}>
                {patientName
                  ? `How are you related to ${patientName}?`
                  : "How are you related to this patient?"}
              </Text>
            </View>
          </View>

          <Text style={styles.infoText}>
            The patient will see this relationship in their connected caregivers list so they know who receives their alerts.
          </Text>

          {/* Quick Selection Pills */}
          <Text style={styles.sectionLabel}>Select or type your relationship:</Text>
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
              placeholder="e.g. Daughter, Spouse, Doctor..."
              placeholderTextColor="#94A3B8"
              value={relationship}
              onChangeText={(text) => {
                setRelationship(text);
                if (error) setError(null);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              autoCapitalize="words"
              editable={!loading}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleModalClose}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmButton, loading && styles.buttonDisabled]}
              onPress={handleConfirm}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.confirmButtonText}>Confirm & Connect</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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
