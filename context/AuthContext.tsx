import { useRouter } from "expo-router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import CustomAlertModal, { AlertModalType } from "@/components/ui/CustomAlertModal";
import { closeSocket, initSocket } from "@/hooks/lib/socket";
import { getMe, googleAuth, login } from "@/services/auth";
import {
  signInWithGoogle as googleSignIn,
  signOutFromGoogle,
} from "@/services/googleAuthService";
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

type ModalConfig = {
  visible: boolean;
  title: string;
  message: string;
  buttonText?: string;
  hideButton?: boolean;
  autoDismissMs?: number;
  type?: AlertModalType;
  onConfirm: () => void;
};

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (params: SignInParams) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  updateUser: (user: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const router = useRouter();

  useEffect(() => {
    const bootstrapAuth = async () => {
      console.log("AuthContext: bootstrapping auth from storage...");
      const persistedAuth = await loadAuthTokens();
      console.log("AuthContext: persistedAuth=", persistedAuth);

      if (persistedAuth?.user) {
        try {
          console.log(
            "AuthContext: restoring user from persisted auth",
            persistedAuth.user,
          );

          const response = await getMe();
          if (response.data.code !== 200) {
            throw new Error("Session invalid");
          }

          setUser(persistedAuth.user);
          console.log("Nonpatient user", persistedAuth.user);

          initSocket();
        } catch (e: any) {
          const status = e.response?.status;
          if (status === 401 || status === 403) {
            setUser(null);
            clearAuthTokens();
          }
        }
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
    closeSocket();
    initSocket();

    console.log("currently logged in", apiUser);

    if (apiUser.onBoarded === false && apiUser.role === "USER") {
      router.replace("/user-onboarding");
      return;
    }

    if (apiUser.role === "NON_PATIENT") {
      router.replace("/nonpatient/dashboard");
      return;
    }

    if (apiUser.role === "PATIENT") {
      router.replace("/patient/dashboard");
      return;
    }

    router.replace("/(auth)/register");
  };

  const loginWithGoogle = async () => {
    try {
      console.log("AuthContext: Starting Google Sign-In flow...");
      const { firebaseIdToken } = await googleSignIn();

      console.log(
        "AuthContext: Received Firebase ID Token, verifying with backend...",
      );
      const result = await googleAuth(firebaseIdToken);
      const { accessToken, refreshToken, user: apiUser } = result.data.data;

      await setAuthTokens({ accessToken, refreshToken }, apiUser, true);
      setUser(apiUser);
      closeSocket();
      initSocket();

      if (apiUser.onBoarded === false && apiUser.role === "USER") {
        router.replace("/user-onboarding");
        return;
      }

      if (apiUser.role === "NON_PATIENT") {
        router.replace("/nonpatient/dashboard");
        return;
      }

      if (apiUser.role === "PATIENT") {
        router.replace("/patient/dashboard");
        return;
      }

      router.replace("/(auth)/register");
    } catch (error) {
      throw error;
    }
  };

  const updateUser = async (updatedUser: AuthUser) => {
    setUser(updatedUser);
    await setAuthUser(updatedUser);
  };

  const signOut = async () => {
    try {
      await signOutFromGoogle();
    } catch (e) {
      console.log("Error signing out of Google:", e);
    }
    await clearAuthTokens();
    closeSocket();
    setUser(null);
    await router.replace("/login");
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      signIn,
      loginWithGoogle,
      updateUser,
      signOut,
    }),
    [user, loading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}

      {/* General Alert Modal */}
      {modalConfig ? (
        <CustomAlertModal
          visible={modalConfig.visible}
          title={modalConfig.title}
          message={modalConfig.message}
          buttonText={modalConfig.buttonText}
          hideButton={modalConfig.hideButton}
          autoDismissMs={modalConfig.autoDismissMs}
          type={modalConfig.type}
          onConfirm={modalConfig.onConfirm}
        />
      ) : null}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
