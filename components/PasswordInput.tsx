import { useState } from "react";
import { Image, Pressable, StyleSheet, TextInput, View } from "react-native";

type PasswordInputProps = {
  value?: string;
  onChangeText?: (text: string) => void;
};

export default function PasswordInput({
  value = "",
  onChangeText,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/icons/padlock.png")}
        style={styles.icon}
        resizeMode="contain"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry={!showPassword}
        value={value}
        onChangeText={onChangeText}
      />

      <Pressable onPress={() => setShowPassword(!showPassword)}>
        <Image
          source={
            showPassword
              ? require("@/assets/icons/hide.png")
              : require("@/assets/icons/view.png")
          }
          style={styles.icon}
          resizeMode="contain"
        />
      </Pressable>
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