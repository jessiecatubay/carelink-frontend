import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type MedicalInformationProps = {
  medicalConditions?: string | null;
  notes?: string | null;
  onEditConditions?: () => void;
  onEditNotes?: () => void;
};

export default function MedicalInformation({
  medicalConditions,
  notes,
  onEditConditions,
  onEditNotes,
}: MedicalInformationProps) {
  const conditionsList = medicalConditions
    ? medicalConditions.split(",").map((item) => item.trim()).filter(Boolean)
    : [];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>MEDICAL INFORMATION</Text>

      <View style={styles.card}>
        {/* Conditions Section */}
        <View style={styles.block}>
          <View style={styles.blockHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="medkit-outline" size={17} color="#0AA7A8" />
            </View>
            <Text style={styles.blockTitle}>Medical Conditions & Illnesses</Text>
            {onEditConditions ? (
              <Pressable onPress={onEditConditions} hitSlop={8}>
                <Ionicons name="create-outline" size={18} color="#0AA7A8" />
              </Pressable>
            ) : null}
          </View>

          {conditionsList.length > 0 ? (
            <View style={styles.tagContainer}>
              {conditionsList.map((condition, idx) => (
                <View key={idx} style={styles.tag}>
                  <Text style={styles.tagText}>{condition}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>
              {medicalConditions || "No medical conditions recorded"}
            </Text>
          )}
        </View>

        <View style={styles.divider} />

        {/* Care Notes Section */}
        <View style={styles.block}>
          <View style={styles.blockHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="document-text-outline" size={17} color="#0AA7A8" />
            </View>
            <Text style={styles.blockTitle}>Special Care Notes</Text>
            {onEditNotes ? (
              <Pressable onPress={onEditNotes} hitSlop={8}>
                <Ionicons name="create-outline" size={18} color="#0AA7A8" />
              </Pressable>
            ) : null}
          </View>

          <Text style={styles.notesText}>
            {notes || "No additional care notes provided for this patient."}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#707477",
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    gap: 12,
  },
  block: {
    gap: 10,
  },
  blockHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#E6F7F7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  blockTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#1E242B",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 2,
  },
  tag: {
    backgroundColor: "#F0FDFA",
    borderWidth: 1,
    borderColor: "#99F6E4",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 13,
    color: "#0F766E",
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 13,
    color: "#9CA3AF",
    fontStyle: "italic",
    paddingLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 4,
  },
  notesText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
    paddingLeft: 4,
  },
});
