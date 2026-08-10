import { View, Text, StyleSheet } from 'react-native';

export default function RemoteScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Remote Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
  },
  text: {
    fontSize: 16,
    color: '#A0AEC0',
  },
});
