import LogoutButton from '@/components/ui/LogoutButton';
import { View, Text } from 'react-native';

export default function Home() {
  return (
    <View>
      <Text>
        Hello this is Patient side
      </Text>
      <LogoutButton/>
    </View>
  );
}
