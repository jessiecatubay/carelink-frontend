import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Button from "@/components/ui/Button";
import PaginationDots from "@/components/ui/PaginationDots";
import {
  patientOnboardingSchema,
  type PatientOnboardingInput,
} from "@/schema/api";

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

const GENDER_OPTIONS = [
  { label: "Male", value: "Male", icon: "male" as const },
  { label: "Female", value: "Female", icon: "female" as const },
];

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
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
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

    onContinue({
      age: Number(result.data.age),
      gender: result.data.gender,
      medicalConditions: result.data.medicalConditions,
      notes: result.data.notes,
    });
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
        <View>
          <View style={styles.paginationWrap}>
            <PaginationDots currentIndex={3} total={5} />
          </View>

          {/* Title */}
          <Text style={styles.title}>Patient Profile</Text>

          {/* Form Card */}
          <View style={styles.card}>
            <TextInput
              style={[
                styles.input,
                focusedField === "age" && styles.inputFocused,
                touched.age && errors.age ? styles.inputError : null,
              ]}
              placeholder="Age"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={form.age}
              onFocus={() => {
                setFocusedField("age");
                setIsGenderOpen(false);
              }}
              onBlur={() => setFocusedField(null)}
              onChangeText={(value) => updateField("age", value)}
            />
            {renderError("age")}

            {/* Gender Dropdown Selector */}
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.dropdownButton,
                  touched.gender && errors.gender ? styles.inputError : null,
                  isGenderOpen && styles.dropdownButtonOpen,
                ]}
                onPress={() => setIsGenderOpen((prev) => !prev)}
              >
                <View style={styles.dropdownValueRow}>
                  <Ionicons
                    name={
                      form.gender === "Male"
                        ? "male"
                        : form.gender === "Female"
                          ? "female"
                          : "male-female-outline"
                    }
                    size={19}
                    color={form.gender ? "#0AA7A8" : "#9CA3AF"}
                    style={styles.genderIcon}
                  />
                  <Text
                    style={[
                      styles.dropdownValueText,
                      !form.gender && styles.placeholderText,
                    ]}
                  >
                    {form.gender || "Select Gender"}
                  </Text>
                </View>

                <Ionicons
                  name={isGenderOpen ? "chevron-up" : "chevron-down"}
                  size={19}
                  color={isGenderOpen ? "#0AA7A8" : "#9CA3AF"}
                />
              </TouchableOpacity>

              {/* Dropdown Menu Options */}
              {isGenderOpen && (
                <View style={styles.dropdownMenu}>
                  {GENDER_OPTIONS.map((option, idx) => {
                    const isSelected = form.gender === option.value;
                    return (
                      <TouchableOpacity
                        key={option.value}
                        activeOpacity={0.7}
                        style={[
                          styles.dropdownOption,
                          idx === 0 && styles.dropdownOptionTop,
                          idx === GENDER_OPTIONS.length - 1 &&
                            styles.dropdownOptionBottom,
                          isSelected && styles.dropdownOptionSelected,
                        ]}
                        onPress={() => {
                          updateField("gender", option.value);
                          setIsGenderOpen(false);
                        }}
                      >
                        <View style={styles.optionLeft}>
                          <View
                            style={[
                              styles.optionIconWrap,
                              isSelected && styles.optionIconWrapSelected,
                            ]}
                          >
                            <Ionicons
                              name={option.icon}
                              size={17}
                              color={isSelected ? "#0AA7A8" : "#6B7280"}
                            />
                          </View>
                          <Text
                            style={[
                              styles.optionText,
                              isSelected && styles.optionTextSelected,
                            ]}
                          >
                            {option.label}
                          </Text>
                        </View>

                        {isSelected && (
                          <Ionicons
                            name="checkmark-circle"
                            size={19}
                            color="#0AA7A8"
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
            {renderError("gender")}

            <TextInput
              style={[
                styles.input,
                focusedField === "medicalConditions" && styles.inputFocused,
                touched.medicalConditions && errors.medicalConditions
                  ? styles.inputError
                  : null,
              ]}
              placeholder="Illness / Medical Conditions"
              placeholderTextColor="#9CA3AF"
              value={form.medicalConditions}
              onFocus={() => {
                setFocusedField("medicalConditions");
                setIsGenderOpen(false);
              }}
              onBlur={() => setFocusedField(null)}
              onChangeText={(value) => updateField("medicalConditions", value)}
            />
            {renderError("medicalConditions")}

            <TextInput
              style={[
                styles.input,
                styles.textArea,
                focusedField === "notes" && styles.inputFocused,
                touched.notes && errors.notes ? styles.inputError : null,
              ]}
              placeholder="Notes / Optional"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              value={form.notes}
              onFocus={() => {
                setFocusedField("notes");
                setIsGenderOpen(false);
              }}
              onBlur={() => setFocusedField(null)}
              onChangeText={(value) => updateField("notes", value)}
            />
            {renderError("notes")}
          </View>

          {/* Note */}
          <View style={styles.noteBox}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#12A5B5"
              style={styles.noteIcon}
            />
            <Text style={styles.noteText}>
              <Text style={styles.noteBold}>Note: </Text>
              This profile is used by CareLink's AI to provide personalized care recommendations, monitor health context, and assist in daily care.
            </Text>
          </View>
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
    marginBottom: 16,
    // Soft shadow for premium look
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 18,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1F2937",
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
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
  dropdownContainer: {
    marginBottom: 16,
    zIndex: 10,
  },
  dropdownButton: {
    height: 52,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  dropdownButtonOpen: {
    borderColor: "#12A5B5",
    shadowColor: "#12A5B5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  genderIcon: {
    marginRight: 2,
  },
  dropdownValueText: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  placeholderText: {
    color: "#9CA3AF",
    fontWeight: "400",
  },
  dropdownMenu: {
    marginTop: 6,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  dropdownOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dropdownOptionTop: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  dropdownOptionBottom: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  dropdownOptionSelected: {
    backgroundColor: "#F0FDFA",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  optionIconWrapSelected: {
    backgroundColor: "#CCFBF1",
  },
  optionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  optionTextSelected: {
    color: "#0AA7A8",
    fontWeight: "700",
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
  noteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F0FAFA",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#C5ECEE",
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 24,
    gap: 10,
  },
  noteIcon: {
    marginTop: 1,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
  },
  noteBold: {
    fontWeight: "700",
    color: "#12A5B5",
  },
  buttonWrap: {
    marginBottom: 40,
  },
  button: {
    width: "100%",
  },
});
