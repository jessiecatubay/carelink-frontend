import type { AuthUser } from "@/types/user";
import * as SecureStore from "expo-secure-store";

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  persisted: boolean;
};

const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const AUTH_USER_KEY = "auth_user";

const isSecureStoreAvailable = async (): Promise<boolean> => {
  if (typeof SecureStore?.isAvailableAsync !== "function") {
    return false;
  }

  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
};

const secureSetItem = async (key: string, value: string) => {
  if (await isSecureStoreAvailable()) {
    try {
      console.log("SecureStore: saving key", key);
      return await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.log(
        "SecureStore save failed, falling back to localStorage",
        key,
        error,
      );
    }
  }

  if (typeof window !== "undefined" && window.localStorage) {
    console.log("localStorage: saving key", key);
    window.localStorage.setItem(key, value);
  }
};

const secureGetItem = async (key: string) => {
  if (await isSecureStoreAvailable()) {
    try {
      const value = await SecureStore.getItemAsync(key);
      console.log("SecureStore: loaded key", key, value != null);
      return value;
    } catch (error) {
      console.log(
        "SecureStore load failed, falling back to localStorage",
        key,
        error,
      );
    }
  }

  if (typeof window !== "undefined" && window.localStorage) {
    const value = window.localStorage.getItem(key);
    console.log("localStorage: loaded key", key, value != null);
    return value;
  }

  console.log("No storage available for key", key);
  return null;
};

const secureDeleteItem = async (key: string) => {
  if (await isSecureStoreAvailable()) {
    try {
      console.log("SecureStore: deleting key", key);
      return await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.log(
        "SecureStore delete failed, falling back to localStorage",
        key,
        error,
      );
    }
  }

  if (typeof window !== "undefined" && window.localStorage) {
    console.log("localStorage: deleting key", key);
    window.localStorage.removeItem(key);
  }
};

let authTokens: AuthTokens | null = null;

export const setAuthTokens = async (
  tokens: { accessToken: string; refreshToken: string },
  user: AuthUser,
  rememberMe = true,
) => {
  authTokens = { ...tokens, user, persisted: rememberMe };
  console.log("setAuthTokens: storing auth tokens", { tokens });

  await Promise.all([
    secureSetItem(ACCESS_TOKEN_KEY, tokens.accessToken),
    secureSetItem(REFRESH_TOKEN_KEY, tokens.refreshToken),
    secureSetItem(AUTH_USER_KEY, JSON.stringify(user)),
  ]);
};

export const loadAuthTokens = async () => {
  console.log("loadAuthTokens: checking stored auth tokens");
  const [accessToken, refreshToken, userJson] = await Promise.all([
    secureGetItem(ACCESS_TOKEN_KEY),
    secureGetItem(REFRESH_TOKEN_KEY),
    secureGetItem(AUTH_USER_KEY),
  ]);

  if (!accessToken || !refreshToken || !userJson) {
    return null;
  }

  try {
    const user = JSON.parse(userJson) as AuthUser;
    authTokens = {
      accessToken,
      refreshToken,
      user,
      persisted: true,
    };
    return authTokens;
  } catch (error) {
    await clearAuthTokens();
    return null;
  }
};

export const getAccessToken = () => authTokens?.accessToken;

export const getRefreshToken = () => authTokens?.refreshToken;

export const getUser = () => authTokens?.user ?? null;

export const setAuthUser = async (user: AuthUser) => {
  if (!authTokens) {
    return;
  }

  authTokens = {
    ...authTokens,
    user,
  };

  await secureSetItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const clearAuthTokens = async () => {
  authTokens = null;
  await Promise.all([
    secureDeleteItem(ACCESS_TOKEN_KEY),
    secureDeleteItem(REFRESH_TOKEN_KEY),
    secureDeleteItem(AUTH_USER_KEY),
  ]);
};

export const hasAuthTokens = () =>
  Boolean(
    authTokens?.accessToken && authTokens?.refreshToken && authTokens?.user,
  );
