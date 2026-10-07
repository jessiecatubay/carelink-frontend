import { useState } from "react";
import { Image, ImageSourcePropType, StyleSheet, Text, TextInput, View } from "react-native";

type InputProps = {
  placeholder?: string;
  placeholderTextColor?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  error?: string;
  icon?: ImageSourcePropType;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: any;
  textContentType?: any;
  onFocus?: () => void;
  onBlur?: () => void;
};

export default function Input({
  placeholder = "Email",
  placeholderTextColor = "#94A3B8",
  value = "",
  onChangeText,
  keyboardType = "default",
  error,
  icon,
  autoCapitalize,
  autoComplete,
  textContentType,
  onFocus,
  onBlur,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const resolvedIcon = icon || require("@/assets/icons/user.png");

  return (
    <View>
      <View
        style={[
          styles.container,
          isFocused ? styles.focusedContainer : null,
          error ? styles.errorContainer : null,
        ]}
      >
        <Image
          source={resolvedIcon}
          style={[styles.icon, isFocused ? styles.iconFocused : null]}
          resizeMode="contain"
        />

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          textContentType={textContentType}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
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
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    height: 54,
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
    height: 54,
    fontSize: 15.5,
    color: "#1E293B",
  },
  errorText: {
    marginTop: 6,
    color: "#F16A66",
    fontSize: 12,
  },
});
