import { useRouter } from "expo-router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { login } from "@/services/auth";
import {
  clearAuthTokens,
  getUser,
  hasAuthTokens,
  setAuthTokens,
} from "@/services/token";
import type { AuthUser } from "@/types/user";

type SignInParams = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (params: SignInParams) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (hasAuthTokens()) {
      const persistedUser = getUser();
      if (persistedUser) {
        setUser(persistedUser);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async ({ email, password, rememberMe }: SignInParams) => {
    const result = await login(email, password);
    const { accessToken, refreshToken, user: apiUser } = result.data.data;

    await setAuthTokens({ accessToken, refreshToken }, apiUser);
    setUser(apiUser);

    if (apiUser.onBoarded === false) {
      await router.replace("/user-onboarding");
      return;
    }

    if (apiUser.role === "CAREGIVER") {
      await router.replace("/non-patient");
      return;
    }

    await router.replace("/patient");
  };

  const signOut = async () => {
    await clearAuthTokens();
    setUser(null);
    await router.replace("/login");
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      signIn,
      signOut,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
