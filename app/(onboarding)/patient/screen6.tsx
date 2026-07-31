import { View, Text } from "react-native";
import Button from "@/components/ui/Button";

import { useOnboarding } from "@/context/OnboardingContext";
import { userOnboarding } from "@/services/auth";
import { useRouter } from "expo-router";

export default function SetupComplete() {
  const router = useRouter();
  const { data } = useOnboarding();
  
  const handlePress = async () => {
    console.log(data)

    try {
      await userOnboarding(data);

      router.replace("/patient");
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <View>
      <Text>Screen 6 patient side</Text>
      <Button 
        title="Go to Dashboard"
        onPress={handlePress}
      />
    </View>
  );
}