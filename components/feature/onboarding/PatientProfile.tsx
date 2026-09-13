import Button from "@/components/ui/Button";
import PaginationDots from "@/components/ui/PaginationDots";
import {
  patientOnboardingSchema,
  type PatientOnboardingInput,
} from "@/schema/api";
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

type PatientProfileProps = {
  onContinue: (profileData: {
    age: number;
    gender: string;
    medicalConditions: string;
    notes: string;
  }) => void;
};

type FieldName = keyof PatientOnboardingInput;
type FormErrors = Partial<Record<FieldName, string>>;

const initialForm: PatientOnboardingInput = {
  age: "",
  gender: "",
  medicalConditions: "",
  notes: "",
};

function getFormErrors(form: PatientOnboardingInput): FormErrors {
  const result = patientOnboardingSchema.safeParse(form);

  if (result.success) {
    return {};
  }

  return result.error.issues.reduce<FormErrors>((errors, issue) => {
    const field = issue.path[0] as FieldName;
    if (!errors[field]) {
      errors[field] = issue.message;
    }
    return errors;
  }, {});
}

export default function PatientProfile({ onContinue }: PatientProfileProps) {
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>(
    {},
  );

  const errors = getFormErrors(form);

  const updateField = (field: FieldName, value: string) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setTouched((currentTouched) => ({ ...currentTouched, [field]: true }));
  };

  const handleContinue = () => {
    const result = patientOnboardingSchema.safeParse(form);
    setTouched({
      age: true,
      gender: true,
      medicalConditions: true,
      notes: true,
    });

    if (!result.success) {
      return;
    }

    onContinue(result.data);
  };

  const renderError = (field: FieldName) =>
    touched[field] && errors[field] ? (
      <Text style={styles.error}>{errors[field]}</Text>
    ) : null;

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
            style={[
              styles.input,
              touched.age && errors.age ? styles.inputError : null,
            ]}
            placeholder="Age"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={form.age}
            onChangeText={(value) => updateField("age", value)}
          />
          {renderError("age")}

          <TextInput
            style={[
              styles.input,
              touched.gender && errors.gender ? styles.inputError : null,
            ]}
            placeholder="Gender"
            placeholderTextColor="#9CA3AF"
            value={form.gender}
            onChangeText={(value) => updateField("gender", value)}
          />
          {renderError("gender")}

          <TextInput
            style={[
              styles.input,
              touched.medicalConditions && errors.medicalConditions
                ? styles.inputError
                : null,
            ]}
            placeholder="Illness / Medical Conditions"
            placeholderTextColor="#9CA3AF"
            value={form.medicalConditions}
            onChangeText={(value) => updateField("medicalConditions", value)}
          />
          {renderError("medicalConditions")}

          <TextInput
            style={[
              styles.input,
              styles.textArea,
              touched.notes && errors.notes ? styles.inputError : null,
            ]}
            placeholder="Notes / Optional"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            value={form.notes}
            onChangeText={(value) => updateField("notes", value)}
          />
          {renderError("notes")}
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
  inputError: {
    borderColor: "#F16A66",
  },
  textArea: {
    height: 140,
    textAlignVertical: "top",
    paddingTop: 14,
    paddingBottom: 14,
    marginBottom: 0,
  },
  error: {
    color: "#DC2626",
    fontSize: 13,
    marginTop: -10,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  buttonWrap: {
    marginBottom: 40,
  },
  button: {
    width: "100%",
  },
});
