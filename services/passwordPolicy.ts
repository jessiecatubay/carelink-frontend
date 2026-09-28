import AsyncStorage from "@react-native-async-storage/async-storage";

const COOLDOWN_DAYS = 30;
const COOLDOWN_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

const getStorageKey = (userId: string) => `@carelink_last_pw_change_${userId}`;

export type PasswordPolicyResult = {
  allowed: boolean;
  daysRemaining: number;
  lastChangedDate: Date | null;
  nextAllowedDate: Date | null;
};

/**
 * Checks if the user is allowed to change their password based on the 1-month (30-day) policy.
 */
export async function checkPasswordChangeEligibility(
  userId: string,
): Promise<PasswordPolicyResult> {
  if (!userId) {
    return {
      allowed: true,
      daysRemaining: 0,
      lastChangedDate: null,
      nextAllowedDate: null,
    };
  }

  try {
    const raw = await AsyncStorage.getItem(getStorageKey(userId));
    if (!raw) {
      return {
        allowed: true,
        daysRemaining: 0,
        lastChangedDate: null,
        nextAllowedDate: null,
      };
    }

    const lastChanged = new Date(raw);
    const lastChangedMs = lastChanged.getTime();
    if (isNaN(lastChangedMs)) {
      return {
        allowed: true,
        daysRemaining: 0,
        lastChangedDate: null,
        nextAllowedDate: null,
      };
    }

    const nowMs = Date.now();
    const elapsedMs = nowMs - lastChangedMs;

    if (elapsedMs < COOLDOWN_MS) {
      const remainingMs = COOLDOWN_MS - elapsedMs;
      const daysRemaining = Math.max(1, Math.ceil(remainingMs / (24 * 60 * 60 * 1000)));
      const nextAllowedDate = new Date(lastChangedMs + COOLDOWN_MS);

      return {
        allowed: false,
        daysRemaining,
        lastChangedDate: lastChanged,
        nextAllowedDate,
      };
    }

    return {
      allowed: true,
      daysRemaining: 0,
      lastChangedDate: lastChanged,
      nextAllowedDate: null,
    };
  } catch (e) {
    console.error("Error checking password change eligibility:", e);
    return {
      allowed: true,
      daysRemaining: 0,
      lastChangedDate: null,
      nextAllowedDate: null,
    };
  }
}

/**
 * Records the current timestamp as the user's latest password change.
 */
export async function recordPasswordChangeTimestamp(userId: string): Promise<void> {
  if (!userId) return;
  try {
    await AsyncStorage.setItem(getStorageKey(userId), new Date().toISOString());
  } catch (e) {
    console.error("Error saving password change timestamp:", e);
  }
}
