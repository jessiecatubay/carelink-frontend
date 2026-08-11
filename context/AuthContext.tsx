import { useRouter } from "expo-router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { login } from "@/services/auth";
import {
  clearAuthTokens,
  loadAuthTokens,
  setAuthTokens,
  setAuthUser,
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
  updateUser: (user: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const bootstrapAuth = async () => {
      console.log("AuthContext: bootstrapping auth from storage...");
      const persistedAuth = await loadAuthTokens();
      console.log("AuthContext: persistedAuth=", persistedAuth);

      if (persistedAuth?.user) {
        console.log(
          "AuthContext: restoring user from persisted auth",
          persistedAuth.user,
        );
        setUser(persistedAuth.user);
      } else {
        console.log("AuthContext: no persisted user found");
      }

      setLoading(false);
      console.log("AuthContext: finished bootstrap, loading=false");
    };

    bootstrapAuth();
  }, []);

  const signIn = async ({ email, password, rememberMe }: SignInParams) => {
    const result = await login(email, password);
    const { accessToken, refreshToken, user: apiUser } = result.data.data;
    console.log("AuthContext: signIn received tokens", {
      accessToken: !!accessToken,
      refreshToken: !!refreshToken,
    });

    await setAuthTokens({ accessToken, refreshToken }, apiUser, rememberMe);
    console.log("AuthContext: tokens saved to storage");
    setUser(apiUser);

    console.log(apiUser);

    if (apiUser.onBoarded === false && apiUser.role === "USER") {
      router.replace("/user-onboarding");
      return;
    }

    if (apiUser.role === "CAREGIVER") {
      router.replace("/nonpatient/dashboard/(tabs)");
      return;
    }

    router.replace("/patient/dashboard/(tabs)");
  };

  const updateUser = async (updatedUser: AuthUser) => {
    setUser(updatedUser);
    await setAuthUser(updatedUser);
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
      updateUser,
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
