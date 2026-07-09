import { Image, StyleSheet, TextInput, View } from "react-native";

type InputProps = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
};

export default function Input({
  placeholder = "Email",
  value = "",
  onChangeText,
  keyboardType = "default",
}: InputProps) {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/icons/user.png")}
        style={styles.icon}
        resizeMode="contain"
      />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 55,
    fontSize: 16,
    color: "#111",
  },
});