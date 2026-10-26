import { createContext, useContext, useState, useEffect } from "react";
import authApi from "../api/authApi";
import { STORAGE_KEY } from "../api/axiosInstance";

// Dummy credentials for Customer & Representative fallback/demo
export const DUMMY_USERS = {
  customer: {
    id: "usr_cust_001",
    email: "customer@machinesystems.com",
    password: "customer123",
    role: "customer",
    name: "Morgan Chen",
    company: "Chen Industrial Works",
    initials: "MC",
    avatarBg: "#27624c",
  },
  representative: {
    id: "usr_rep_001",
    email: "rep@machinesystems.com",
    password: "rep123",
    role: "representative",
    name: "Alex Morgan",
    company: "MACHINE Systems (UK Team)",
    initials: "AM",
    avatarBg: "#c94f2d",
  },
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to parse stored auth user:", e);
    }
    return null;
  });

  // Listen to storage changes across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch (err) {
          console.error("Error syncing storage:", err);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  /**
   * Log in with email, password, and optional expected role.
   */
  const login = async (email, password, roleHint = null) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    // 1. Try real backend login via authApi
    try {
      const response = await authApi.login({
        email: cleanEmail,
        password: cleanPassword,
        role: roleHint || undefined,
      });

      const accessToken =
        response?.token ||
        response?.data?.token ||
        response?.data?.accessToken ||
        response?.accessToken;

      if (accessToken) {
        let profile = response?.data?.user || response?.user || null;
        if (!profile && accessToken) {
          try {
            const meRes = await authApi.getMe();
            profile = meRes?.data?.user || meRes?.data || meRes?.user || null;
          } catch (meErr) {
            console.warn("Could not fetch profile after login:", meErr.message);
          }
        }

        const userName = profile?.name || cleanEmail.split("@")[0];
        const authUser = {
          ...(profile || {}),
          id: profile?._id || profile?.id || `usr_${Date.now()}`,
          token: accessToken,
          role: profile?.role || roleHint || "customer",
          email: profile?.email || cleanEmail,
          name: userName,
          initials: userName
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
          avatarBg:
            (profile?.role || roleHint) === "representative" ? "#c94f2d" : "#27624c",
          loginAt: new Date().toISOString(),
        };

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
        } catch (e) {
          console.error("Failed to save to localStorage:", e);
        }
        setUser(authUser);
        return { success: true, user: authUser };
      }
    } catch (apiError) {
      const errData = apiError.response?.data;
      if (errData?.code === "EMAIL_NOT_VERIFIED") {
        return {
          success: false,
          code: "EMAIL_NOT_VERIFIED",
          email: cleanEmail,
          message: errData.message || "Please verify your email using the OTP sent to your email.",
        };
      }
      if (errData?.code === "ACCOUNT_PENDING_APPROVAL") {
        return {
          success: false,
          code: "ACCOUNT_PENDING_APPROVAL",
          message: errData.message || "Your representative account is awaiting administrator approval.",
        };
      }
      console.warn("Backend login failed, checking demo credentials:", apiError.message);
    }

    // 2. Fallback to demo credentials
    const isCustomer =
      (cleanEmail === DUMMY_USERS.customer.email.toLowerCase() ||
        cleanEmail === "customer@example.com" ||
        cleanEmail === "morgan@machinesystems.com") &&
      cleanPassword === DUMMY_USERS.customer.password;

    const isRep =
      (cleanEmail === DUMMY_USERS.representative.email.toLowerCase() ||
        cleanEmail === "rep@example.com" ||
        cleanEmail === "alex@machinesystems.com") &&
      cleanPassword === DUMMY_USERS.representative.password;

    if (isCustomer) {
      const authUser = {
        ...DUMMY_USERS.customer,
        token: `dummy-token-cust-${Date.now()}`,
        loginAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      } catch (e) {}
      setUser(authUser);
      return { success: true, user: authUser };
    }

    if (isRep) {
      const authUser = {
        ...DUMMY_USERS.representative,
        token: `dummy-token-rep-${Date.now()}`,
        loginAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      } catch (e) {}
      setUser(authUser);
      return { success: true, user: authUser };
    }

    return {
      success: false,
      message: "Invalid email or password. Please verify your credentials.",
    };
  };

  /**
   * Register a new user via the backend API (triggers 6-digit OTP email)
   */
  const register = async (userData) => {
    try {
      const res = await authApi.register(userData);
      const data = res?.data || res;
      if (data?.success) {
        return {
          success: true,
          requiresOtp: Boolean(data?.requiresOtp),
          email: data?.email || userData.email,
          role: data?.role || userData.role,
          message: data?.message || "Verification code sent to your email.",
        };
      }
      return { success: false, message: data?.message || "Registration failed" };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Registration failed";
      return { success: false, message: msg };
    }
  };

  /**
   * Verify 6-digit OTP code to activate account
   */
  const verifyOtp = async (email, otp) => {
    try {
      const res = await authApi.verifyOtp({ email, otp: String(otp).trim() });
      const data = res?.data || res;

      if (data?.success) {
        // Customer verified: Token returned directly
        if (data?.token && data?.user) {
          const accessToken = data.token;
          const profile = data.user;
          const userName = profile?.name || email.split("@")[0];

          const authUser = {
            ...profile,
            id: profile?._id || profile?.id || `usr_${Date.now()}`,
            token: accessToken,
            role: profile?.role || "customer",
            email: profile?.email || email,
            name: userName,
            initials: userName
              .split(" ")
              .map((p) => p[0])
              .join("")
              .slice(0, 2)
              .toUpperCase(),
            avatarBg: profile?.role === "representative" ? "#c94f2d" : "#27624c",
            loginAt: new Date().toISOString(),
          };

          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
          } catch (e) {}
          setUser(authUser);
          return { success: true, user: authUser, message: data.message };
        }

        // Representative verified: Requires admin approval
        return {
          success: true,
          requiresApproval: Boolean(data?.requiresApproval),
          message: data?.message || "Email verified! Your representative account is pending administrator approval.",
          user: data?.user,
        };
      }

      return { success: false, message: data?.message || "Invalid or expired verification code." };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to verify code.";
      return { success: false, message: msg };
    }
  };

  /**
   * Resend 6-digit OTP code
   */
  const resendOtp = async (email) => {
    try {
      const res = await authApi.resendOtp({ email });
      const data = res?.data || res;
      return {
        success: true,
        message: data?.message || "A new verification code has been sent to your email.",
      };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to resend code.";
      return { success: false, message: msg };
    }
  };

  /**
   * Update user profile via the backend API (PUT /api/v1/auth/update-profile)
   */
  const updateProfile = async (profileData) => {
    try {
      const res = await authApi.updateProfile(profileData);
      const updatedFields = res?.data?.user || res?.data || res?.user || profileData;
      const mergedUser = {
        ...user,
        ...updatedFields,
        name: updatedFields.name || profileData.name || user?.name,
        company: updatedFields.company || profileData.company || user?.company,
        phone: updatedFields.phone || profileData.phone || user?.phone,
        country:
          updatedFields.country ||
          profileData.country ||
          profileData.region ||
          user?.country ||
          user?.region,
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedUser));
      } catch (e) {
        console.error("Failed to save updated profile to localStorage:", e);
      }
      setUser(mergedUser);
      return { success: true, data: res, user: mergedUser };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Failed to update profile",
      };
    }
  };

  /**
   * Quick role switch helper for testing between Customer and Representative
   */
  const switchRole = (targetRole) => {
    const targetUser =
      targetRole === "representative"
        ? {
            ...DUMMY_USERS.representative,
            token: `dummy-token-rep-${Date.now()}`,
            loginAt: new Date().toISOString(),
          }
        : {
            ...DUMMY_USERS.customer,
            token: `dummy-token-cust-${Date.now()}`,
            loginAt: new Date().toISOString(),
          };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(targetUser));
    } catch (e) {
      console.error("Failed to save switched role to localStorage:", e);
    }
    setUser(targetUser);
    return targetUser;
  };

  /**
   * Log out and clear state and localStorage
   */
  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear auth from localStorage:", e);
    }
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isCustomer: user?.role === "customer",
    isRepresentative: user?.role === "representative",
    login,
    register,
    verifyOtp,
    resendOtp,
    updateProfile,
    getMe: () => authApi.getMe(),
    logout,
    switchRole,
    dummyCredentials: DUMMY_USERS,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
