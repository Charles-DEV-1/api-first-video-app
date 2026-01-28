import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/config";

const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),

  signup: (name, email, password) =>
    api.post("/auth/signup", { name, email, password }),

  getProfile: () => api.get("/auth/me"),
};

export const videoAPI = {
  getDashboard: () => api.get("/dashboard"),

  getVideo: (id) => api.get(`/video/${id}`),
};

export default api;
