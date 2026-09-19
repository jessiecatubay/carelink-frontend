import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import {
  getRefreshToken,
  setAuthTokens,
  clearAuthTokens,
  getAccessToken
} from "@/services/token";

const backendURL = process.env.EXPO_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: backendURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let isRefreshing = false;

let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  failedQueue = [];
};

// Attach access token
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Handle expired access token
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as RetryableRequestConfig | undefined;

    const status = error.response?.status;

    // No request config available
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Ignore cancelled requests
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // Only refresh on 401
    if (status !== 401) {
      if (error.response) {
        console.warn(`[API ${status} Error] ${originalRequest.method?.toUpperCase()} ${originalRequest.url}:`, error.response.data);
      } else if (!status || status >= 500) {
        console.error("[API System Error]", {
          method: originalRequest.method?.toUpperCase(),
          url: originalRequest.url,
          status: status ?? "NETWORK_ERROR",
          message: error.message,
        });
      }

      return Promise.reject(error);
    }

    // Prevent infinite retry
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // If another request is already refreshing,
    // wait until that refresh finishes.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      })
        .then(() => {
          return axiosInstance(originalRequest);
        })
        .catch((queueError) => {
          return Promise.reject(queueError);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      console.log("🔄 Refreshing access token...");

      // IMPORTANT:
      // Use plain axios here, NOT axiosInstance.
      // Otherwise this request could trigger the interceptor again.
      const refreshResponse = await axios.post(
        `${backendURL}/api/user/v1/refresh`,
        {
          refreshToken,
        },
      );

      console.log("✅ Token refresh successful");

      const {
        accessToken,
        refreshToken: newRefreshToken,
        user,
      } = refreshResponse.data.data;

      // Save the new tokens
      await setAuthTokens(
        {
          accessToken,
          refreshToken: newRefreshToken ?? refreshToken,
        },
        user,
        true,
      );

      // Tell all waiting requests that refresh succeeded
      processQueue(null);

      isRefreshing = false;

      // The request interceptor will attach the new access token.
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      console.error("❌ Token refresh failed:", refreshError);

      processQueue(refreshError);

      isRefreshing = false;

      await clearAuthTokens();

      return Promise.reject(refreshError);
    }
  },
);

export default axiosInstance;