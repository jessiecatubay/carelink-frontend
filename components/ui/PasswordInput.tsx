import { useState } from "react";
import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

type PasswordInputProps = Omit<TextInputProps, "style"> & {
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function PasswordInput({
  placeholder = "Password",
  value,
  onChangeText,
  error,
  onFocus,
  onBlur,
  editable = true,
  containerStyle,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={containerStyle}>
      <View
        style={[
          styles.container,
          !editable ? styles.containerDisabled : null,
          isFocused ? styles.focusedContainer : null,
          error ? styles.errorContainer : null,
        ]}
      >
        <Image
          source={require("@/assets/icons/padlock.png")}
          style={[styles.icon, isFocused ? styles.iconFocused : null]}
          resizeMode="contain"
        />

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          secureTextEntry={!showPassword}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />

        <Pressable
          disabled={!editable}
          onPress={() => setShowPassword(!showPassword)}
          hitSlop={8}
        >
          <Image
            source={
              showPassword
                ? require("@/assets/icons/hide.png")
                : require("@/assets/icons/view.png")
            }
            style={styles.eyeIcon}
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
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    height: 54,
  },

  containerDisabled: {
    backgroundColor: "#F1F5F9",
    borderColor: "#CBD5E1",
  },

  focusedContainer: {
    borderColor: "#12A5B5",
    backgroundColor: "#FFFFFF",
  },

  errorContainer: {
    borderColor: "#F16A66",
  },

  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: "#94A3B8",
  },

  iconFocused: {
    tintColor: "#12A5B5",
  },

  input: {
    flex: 1,
    fontSize: 15.5,
    color: "#1E293B",
    height: 54,
  },

  eyeIcon: {
    width: 20,
    height: 20,
    tintColor: "#94A3B8",
    marginLeft: 6,
  },

  errorText: {
    marginTop: 6,
    color: "#F16A66",
    fontSize: 12,
  },
});