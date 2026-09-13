import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type AIHeaderProps = {
  patientName?: string;
  onBack?: () => void;
};

export default function AIHeader({
  patientName = "Kathryn Bernardo",
  onBack,
}: AIHeaderProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      <Pressable onPress={handleBack} style={styles.backButton} hitSlop={12}>
        <Ionicons name="arrow-back" size={26} color="#1F2937" />
      </Pressable>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>AI Assistance</Text>
        <Text style={styles.subtitle}>Patient: {patientName}</Text>
      </View>
      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F4F8",
  },
  backButton: {
    padding: 6,
    width: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
});
