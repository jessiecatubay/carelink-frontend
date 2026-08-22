import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Button from "@/components/ui/Button";
import PaginationDots from "@/components/ui/PaginationDots";

type PatientProfileProps = {
  onContinue: (profileData: {
    age: string;
    gender: string;
    illness: string;
    notes: string;
  }) => void;
};

export default function PatientProfile({ onContinue }: PatientProfileProps) {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [illness, setIllness] = useState("");
  const [notes, setNotes] = useState("");

  const handleContinue = () => {
    onContinue({
      age,
      gender,
      illness,
      notes,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardContainer}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.paginationWrap}>
          <PaginationDots currentIndex={3} total={6} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Patient Profile</Text>

        {/* Form Card */}
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Age"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />

          <TextInput
            style={styles.input}
            placeholder="Gender"
            placeholderTextColor="#9CA3AF"
            value={gender}
            onChangeText={setGender}
          />

          <TextInput
            style={styles.input}
            placeholder="Illness / Condition"
            placeholderTextColor="#9CA3AF"
            value={illness}
            onChangeText={setIllness}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Notes / Optional"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <View style={styles.buttonWrap}>
          <Button
            title="Continue"
            onPress={handleContinue}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  paginationWrap: {
    marginTop: 100,
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#12A5B5",
    textAlign: "center",
    marginBottom: 24,
  },
  card: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 24,
    padding: 20,
    backgroundColor: "#FFFFFF",
    marginBottom: 40,
    // Soft shadow for premium look
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#4B5563",
    borderRadius: 18,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1F2937",
    marginBottom: 16,
  },
  textArea: {
    height: 140,
    textAlignVertical: "top",
    paddingTop: 14,
    paddingBottom: 14,
    marginBottom: 0,
  },
  buttonWrap: {
    marginBottom: 40,
  },
  button: {
    width: "100%",
  },
});
