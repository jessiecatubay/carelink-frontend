import axios from "axios";

const backendURL = process.env.BACKEND_URL || "http://192.168.1.25:8000";

const axiosInstance = axios.create({
  baseURL: backendURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  },
})

export default axiosInstance;