import axios from "axios";

// Default base URL to live backend API
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://node.aitechnotech.in/machine";

export const API_BASE_URL = rawBaseUrl;
  
// Normalize baseURL so endpoints starting with /api/v1 do not get duplicated if base already has /api/v1
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, "");
export const BASE_URL = normalizedBaseUrl.endsWith("/api/v1")
  ? normalizedBaseUrl.slice(0, -7)
  : normalizedBaseUrl;


export const STORAGE_KEY = "machine_system_auth";

/**
 * Helper to retrieve the current auth token from localStorage
 */
export const getAuthToken = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.token || parsed.accessToken || null;
    }
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      null
    );
  } catch (e) {
    console.error("Error reading token from localStorage:", e);
    return null;
  }
};

/**
 * Configured Axios Instance
 */
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

// Request interceptor: Automatically attach Bearer token if present
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Extract data or format standardized errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Return response body directly for clean consumer code
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized request (401). Token may be invalid or expired.");
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected server error occurred.";

    const customError = new Error(message);
    customError.status = error.response?.status;
    customError.data = error.response?.data;
    customError.originalError = error;

    return Promise.reject(customError);
  }
);

export default axiosInstance;
