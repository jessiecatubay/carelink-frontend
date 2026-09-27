import PatientRemote from "@/components/feature/patient/dashboard/PatientRemote";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RemoteScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <PatientRemote />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
});

