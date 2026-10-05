/**
 * Utility functions for name and string capitalization
 */

/**
 * Capitalizes the first letter of each word in a string (Title Case).
 * Handles multi-word names like "juan dela cruz" -> "Juan Dela Cruz"
 * and preserves proper capitalization.
 */
export function capitalizeWords(str?: string | null): string {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => {
      if (!word) return "";
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

/**
 * Formats a name while typing, ensuring the first letter of each word is capitalized.
 */
export function formatNameInput(str: string): string {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => {
      if (!word) return "";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
