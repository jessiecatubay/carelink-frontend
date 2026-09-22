import RegisterDeviceSection from "@/components/feature/patient/settings/RegisterDeviceSection";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterDeviceScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          animation: "slide_from_right",
          headerShown: false,
        }}
      />

      <SafeAreaView edges={["top"]} style={styles.screen}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Register Device</Text>
            <Text style={styles.subtitle}>Connect your CareLink device</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <RegisterDeviceSection />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },

  subtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 36,
  },
});