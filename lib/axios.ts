import axios from "axios";

const backendURL = process.env.EXPO_PUBLIC_BACKEND_URL;
console.log("Backend URL:", backendURL); // Log the backend URL to verify it's being read correctly

const axiosInstance = axios.create({
  baseURL: backendURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  },
})

export default axiosInstance;