/**
 * Utility functions for Philippine (+63) phone numbers
 */

/**
 * Extracts raw 10-digit mobile number starting with 9 from any Philippine phone format.
 * (e.g. "+63 912 345 6789" -> "9123456789", "09123456789" -> "9123456789")
 */
export function extractPhilippineMobileDigits(input: string): string {
  if (!input) return "";

  // Remove all non-digit characters
  let digits = input.replace(/\D/g, "");

  // If starts with 63 (e.g. from +63), strip country code 63
  if (digits.startsWith("63")) {
    digits = digits.slice(2);
  }

  // If starts with 0 (e.g. 0917...), strip leading 0
  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  // Limit to 10 digits (Philippine mobile numbers are 10 digits starting with 9)
  return digits.slice(0, 10);
}

/**
 * Formats user input dynamically as a Philippine mobile phone number: +63 9XX XXX XXXX
 */
export function formatPhilippinePhoneNumber(input: string): string {
  if (!input) return "";

  // Check if input was cleared or just backspaced prefix
  const trimmed = input.trim();
  if (trimmed === "" || trimmed === "+" || trimmed === "+6" || trimmed === "+63") {
    return "";
  }

  const mobileDigits = extractPhilippineMobileDigits(input);

  if (!mobileDigits) {
    return "";
  }

  // Format as: +63 9XX XXX XXXX
  let formatted = "+63 " + mobileDigits.slice(0, 3);

  if (mobileDigits.length > 3) {
    formatted += " " + mobileDigits.slice(3, 6);
  }

  if (mobileDigits.length > 6) {
    formatted += " " + mobileDigits.slice(6, 10);
  }

  return formatted;
}

/**
 * Validates if the given string represents a complete and valid Philippine mobile phone number.
 * Must be 10 digits starting with 9 (i.e. +63 9XX XXX XXXX or 09XX XXX XXXX).
 */
export function isValidPhilippinePhoneNumber(input: string): boolean {
  if (!input) return false;
  const mobileDigits = extractPhilippineMobileDigits(input);
  return mobileDigits.length === 10 && mobileDigits.startsWith("9");
}
