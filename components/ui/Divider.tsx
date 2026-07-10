import { StyleSheet, Text, View } from "react-native";

export default function Divider({ text = "Or" }) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#DDD",
  },
  text: {
    marginHorizontal: 10,
    color: "#666",
  },
});