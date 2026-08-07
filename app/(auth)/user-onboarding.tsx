import SelectRole from "@/components/feature/onboarding/SelectRole";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserOnboarding() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SelectRole />
    </SafeAreaView>
  );
}