import axiosInstance from "./axiosInstance";

/**
 * Authentication API Service
 * Maps to backend endpoints:
 * - POST /api/v1/auth/register : Register a new customer account
 * - POST /api/v1/auth/login    : Login customer, representative, or admin
 * - GET  /api/v1/auth/me       : Get current logged-in user details
 * - PUT  /api/v1/auth/update-profile : Update user profile (name, company, phone, country)
 */
export const authApi = {
  /**
   * Register a new customer account
   * @param {Object} userData - { name, email, password, company, role, ... }
   * @returns {Promise<any>} Response data
   */
  register: (userData) => {
    return axiosInstance.post("/api/v1/auth/register", userData);
  },

  /**
   * Login customer, representative, or admin
   * @param {Object} credentials - { email, password }
   * @returns {Promise<any>} Response data
   */
  login: (credentials) => {
    return axiosInstance.post("/api/v1/auth/login", credentials);
  },

  /**
   * Get current logged-in user details
   * Requires Authorization Bearer token (handled by request interceptor)
   * @returns {Promise<any>} Response data
   */
  getMe: () => {
    return axiosInstance.get("/api/v1/auth/me");
  },

  /**
   * Update user profile (name, company, phone, country)
   * Requires Authorization Bearer token (handled by request interceptor)
   * @param {Object} profileData - { name, company, phone, country }
   * @returns {Promise<any>} Response data
   */
  updateProfile: (profileData) => {
    // Map region to country if country is not explicitly provided
    const payload = {
      ...profileData,
      country: profileData.country || profileData.region || "",
    };
    return axiosInstance.put("/api/v1/auth/update-profile", payload);
  },
};

export default authApi;
