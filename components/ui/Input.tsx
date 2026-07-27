import { Image, StyleSheet, Text, TextInput, View } from "react-native";

type InputProps = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  error?: string;
};

export default function Input({
  placeholder = "Email",
  value = "",
  onChangeText,
  keyboardType = "default",
  error,
}: InputProps) {
  return (
    <View>
      <View style={[styles.container, error ? styles.errorContainer : null]}>
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
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  errorContainer: {
    borderColor: "#F16A66",
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
  errorText: {
    marginTop: 6,
    color: "#F16A66",
    fontSize: 12,
  },
});
