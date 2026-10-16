import React, { forwardRef, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { extractPhilippineMobileDigits, formatPhilippinePhoneNumber } from "@/utils/phone";

export type PhoneInputProps = Omit<TextInputProps, "style" | "value" | "onChangeText"> & {
  value?: string;
  onChangeText?: (formattedText: string) => void;
  placeholder?: string;
  error?: string;
  editable?: boolean;
  countryCode?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

const PhoneInput = forwardRef<TextInput, PhoneInputProps>(
  (
    {
      value = "",
      onChangeText,
      placeholder = "900 000 0000",
      error,
      editable = true,
      countryCode = "+63",
      style,
      inputStyle,
      onFocus,
      onBlur,
      ...restProps
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    // Extract only the mobile digits (without +63 prefix) for the internal text field
    const rawDigits = extractPhilippineMobileDigits(value);

    // Format the display digits (e.g. 912 345 6789)
    const getDisplayValue = () => {
      if (!rawDigits) return "";
      let formatted = rawDigits.slice(0, 3);
      if (rawDigits.length > 3) {
        formatted += " " + rawDigits.slice(3, 6);
      }
      if (rawDigits.length > 6) {
        formatted += " " + rawDigits.slice(6, 10);
      }
      return formatted;
    };

    const handleChangeText = (text: string) => {
      const digits = extractPhilippineMobileDigits(text);
      if (!digits) {
        onChangeText?.("");
        return;
      }
      const fullFormatted = formatPhilippinePhoneNumber(digits);
      onChangeText?.(fullFormatted);
    };

    return (
      <View style={[styles.wrapper, style]}>
        <View
          style={[
            styles.container,
            isFocused && styles.containerFocused,
            error ? styles.containerError : null,
            !editable && styles.containerDisabled,
          ]}
        >
          {/* Country Code Prefix Box */}
          <View style={styles.countryPrefixBox}>
            <Text style={styles.countryCodeText}>{countryCode}</Text>
          </View>

          {/* Subtle Vertical Divider */}
          <View style={styles.divider} />

          {/* Number Input Field */}
          <TextInput
            ref={ref}
            value={getDisplayValue()}
            onChangeText={handleChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            editable={editable}
            maxLength={12} // 10 digits + 2 spaces
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e as any);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e as any);
            }}
            style={[styles.input, inputStyle]}
            autoComplete="tel"
            textContentType="telephoneNumber"
            {...restProps}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  containerFocused: {
    borderColor: "#12A5B5",
    backgroundColor: "#FFFFFF",
    shadowColor: "#12A5B5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  containerError: {
    borderColor: "#EF4444",
    backgroundColor: "#FFF8F8",
  },
  containerDisabled: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    opacity: 0.75,
  },
  countryPrefixBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    height: "100%",
    backgroundColor: "#F8FAFC",
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    height: 26,
    backgroundColor: "#CBD5E1",
  },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: "500",
    color: "#1E293B",
    letterSpacing: 0.4,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 4,
  },
});

export default PhoneInput;
