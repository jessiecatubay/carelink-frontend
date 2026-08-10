import type { AuthUser } from "@/types/user";

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

let authTokens: AuthTokens | null = null;

export const setAuthTokens = async (
  tokens: { accessToken: string; refreshToken: string },
  user: AuthUser,
) => {
  authTokens = { ...tokens, user };
};

export const getAccessToken = () => authTokens?.accessToken;

export const getRefreshToken = () => authTokens?.refreshToken;

export const getUser = () => authTokens?.user ?? null;

export const clearAuthTokens = async () => {
  authTokens = null;
};

export const hasAuthTokens = () =>
  Boolean(
    authTokens?.accessToken && authTokens?.refreshToken && authTokens?.user,
  );
