import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export type PatientMedicalInformationProps = {
  age: string;
  gender: string;
  medicalConditions: string;
  notes: string;
  editable?: boolean;
  onAgeChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onMedicalConditionsChange: (value: string) => void;
  onNotesChange: (value: string) => void;
};

const GENDER_OPTIONS = ["Male", "Female"] as const;

export default function PatientMedicalInformation({
  age,
  gender,
  medicalConditions,
  notes,
  editable = false,
  onAgeChange,
  onGenderChange,
  onMedicalConditionsChange,
  onNotesChange,
}: PatientMedicalInformationProps) {
  const conditionsList = medicalConditions
    ? medicalConditions
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>PATIENT & MEDICAL DETAILS</Text>

      <View style={styles.card}>
        {/* Age Field */}
        <View style={[styles.itemContainer, styles.divider]}>
          <View style={styles.iconContainer}>
            <Ionicons name="calendar-outline" size={20} color="#0AA7A8" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Age</Text>
            {editable ? (
              <TextInput
                value={age}
                onChangeText={onAgeChange}
                keyboardType="numeric"
                maxLength={3}
                placeholder="Enter age (e.g. 68)"
                placeholderTextColor="#A0A5A8"
                style={styles.input}
              />
            ) : (
              <Text style={[styles.value, !age && styles.emptyValue]}>
                {age ? `${age} years old` : "Not specified"}
              </Text>
            )}
          </View>
        </View>

        {/* Gender Field */}
        <View style={[styles.itemContainer, styles.divider]}>
          <View style={styles.iconContainer}>
            <Ionicons name="male-female-outline" size={20} color="#0AA7A8" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Gender</Text>
            {editable ? (
              <View style={styles.genderRow}>
                {GENDER_OPTIONS.map((option) => {
                  const isSelected =
                    gender?.toLowerCase() === option.toLowerCase();
                  return (
                    <Pressable
                      key={option}
                      onPress={() => onGenderChange(option)}
                      style={[
                        styles.genderPill,
                        isSelected && styles.genderPillSelected,
                      ]}
                    >
                      <Ionicons
                        name={option === "Male" ? "male" : "female"}
                        size={15}
                        color={isSelected ? "#FFFFFF" : "#64748B"}
                        style={{ marginRight: 5 }}
                      />
                      <Text
                        style={[
                          styles.genderPillText,
                          isSelected && styles.genderPillTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <Text style={[styles.value, !gender && styles.emptyValue]}>
                {gender || "Not specified"}
              </Text>
            )}
          </View>
        </View>

        {/* Illness / Medical Conditions Field */}
        <View style={[styles.itemContainer, styles.divider]}>
          <View style={styles.iconContainer}>
            <Ionicons name="medkit-outline" size={20} color="#0AA7A8" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Illness / Medical Conditions</Text>
            {editable ? (
              <TextInput
                value={medicalConditions}
                onChangeText={onMedicalConditionsChange}
                placeholder="e.g. Hypertension, Diabetes, Asthma"
                placeholderTextColor="#A0A5A8"
                style={styles.input}
              />
            ) : conditionsList.length > 0 ? (
              <View style={styles.tagContainer}>
                {conditionsList.map((cond, idx) => (
                  <View key={idx} style={styles.tag}>
                    <Text style={styles.tagText}>{cond}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={[styles.value, styles.emptyValue]}>
                {medicalConditions || "No medical conditions recorded"}
              </Text>
            )}
          </View>
        </View>

        {/* Notes / Optional Field */}
        <View style={styles.itemContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="document-text-outline" size={20} color="#0AA7A8" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Notes / Care Preferences (Optional)</Text>
            {editable ? (
              <TextInput
                value={notes}
                onChangeText={onNotesChange}
                placeholder="e.g. Penicillin allergy, uses walking cane"
                placeholderTextColor="#A0A5A8"
                multiline
                numberOfLines={3}
                style={[styles.input, styles.multilineInput]}
              />
            ) : (
              <Text style={[styles.value, !notes && styles.emptyValue]}>
                {notes || "No special notes provided"}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#707477",
    letterSpacing: 0.5,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F5",
  },
  iconContainer: {
    width: 32,
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E242B",
    marginBottom: 4,
  },
  value: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 19,
    fontWeight: "400",
  },
  emptyValue: {
    color: "#A0A5A8",
    fontStyle: "italic",
  },
  input: {
    fontSize: 14,
    color: "#1E242B",
    fontWeight: "500",
    paddingVertical: 4,
    paddingHorizontal: 0,
    margin: 0,
    minHeight: 24,
  },
  multilineInput: {
    minHeight: 56,
    textAlignVertical: "top",
  },
  genderRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  genderPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  genderPillSelected: {
    backgroundColor: "#0AA7A8",
    borderColor: "#0AA7A8",
  },
  genderPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  genderPillTextSelected: {
    color: "#FFFFFF",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  tag: {
    backgroundColor: "#F0FDFA",
    borderWidth: 1,
    borderColor: "#99F6E4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    color: "#0F766E",
    fontWeight: "600",
  },
});
