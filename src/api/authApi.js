import axiosInstance from "./axiosInstance";

/**
 * Authentication API Service
 * Maps to backend endpoints:
 * - POST /api/v1/auth/register       : Register a new customer or representative (sends 6-digit OTP)
 * - POST /api/v1/auth/verify-otp     : Verify 6-digit OTP code to complete registration
 * - POST /api/v1/auth/resend-otp     : Resend 6-digit OTP code to email
 * - POST /api/v1/auth/login          : Login customer, representative, or admin
 * - GET  /api/v1/auth/me             : Get current logged-in user details
 * - PUT  /api/v1/auth/update-profile : Update user profile (name, company, phone, country)
 */
export const authApi = {
  /**
   * Register a new customer or representative account
   * @param {Object} userData - { name, firstName, lastName, email, password, company, role, termsAccepted }
   * @returns {Promise<any>}
   */
  register: (userData) => {
    return axiosInstance.post("/api/v1/auth/register", userData);
  },

  /**
   * Verify 6-digit registration OTP
   * @param {Object} data - { email, otp }
   * @returns {Promise<any>}
   */
  verifyOtp: (data) => {
    return axiosInstance.post("/api/v1/auth/verify-otp", data);
  },

  /**
   * Resend 6-digit registration OTP
   * @param {Object} data - { email }
   * @returns {Promise<any>}
   */
  resendOtp: (data) => {
    return axiosInstance.post("/api/v1/auth/resend-otp", data);
  },

  /**
   * Login customer, representative, or admin
   * @param {Object} credentials - { email, password, role }
   * @returns {Promise<any>}
   */
  login: (credentials) => {
    return axiosInstance.post("/api/v1/auth/login", credentials);
  },

  /**
   * Get current logged-in user details
   * @returns {Promise<any>}
   */
  getMe: () => {
    return axiosInstance.get("/api/v1/auth/me");
  },

  /**
   * Update user profile (name, company, phone, country)
   * @param {Object} profileData
   * @returns {Promise<any>}
   */
  updateProfile: (profileData) => {
    const payload = {
      ...profileData,
      country: profileData.country || profileData.region || "",
    };
    return axiosInstance.put("/api/v1/auth/update-profile", payload);
  },
};

export default authApi;
