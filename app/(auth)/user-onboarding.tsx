import { View } from "react-native";
import SelectRole from "@/components/feature/onboarding/SelectRole";

export default function UserOnboarding() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <SelectRole />
    </View>
  );
}