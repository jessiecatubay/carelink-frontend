import axios from "axios";

const backendURL = process.env.BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: backendURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  },
})

export default axiosInstance;