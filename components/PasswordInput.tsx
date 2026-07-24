import { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type PasswordInputProps = {
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string;
};

export default function PasswordInput({
  value = "",
  onChangeText,
  error,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View>
      <View style={[styles.container, error ? styles.errorContainer : null]}>
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
