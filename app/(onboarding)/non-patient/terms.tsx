import TermsContent from "@/components/feature/onboarding/TermsContent";
import PaginationDots from "@/components/ui/PaginationDots";

import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text
} from "react-native";

export default function TermsPage() {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <PaginationDots currentIndex={1} total={8} />

          <Text style={styles.title}>
            Terms and Conditions
          </Text>

          <TermsContent />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
  },

  title: {
    marginTop: 30,
    marginBottom: 25,
    textAlign: "center",
    fontSize: 34,
    fontWeight: "500",
    color: "#0FA4AF",
  },
});