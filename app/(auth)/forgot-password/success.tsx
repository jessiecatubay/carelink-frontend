import PasswordSuccess from "@/components/feature/auth/forgot-password/PasswordSuccess";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PasswordSuccessScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <PasswordSuccess />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
});
