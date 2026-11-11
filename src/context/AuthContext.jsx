/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import authApi from "../api/authApi";
import { axiosInstance, STORAGE_KEY } from "../api/axiosInstance";

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

  /**
   * Log out and clear state and localStorage
   */
  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
    } catch (e) {
      console.error("Failed to clear auth from localStorage:", e);
    }
    setUser(null);
  }, []);

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

  // Verify token on mount and refresh with real backend profile data
  useEffect(() => {
    let mounted = true;

    const verifyAndRefreshProfile = async () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      try {
        const parsed = JSON.parse(stored);
        if (!parsed?.token) return;

        // Fetch live user profile from backend database
        const meRes = await authApi.getMe();
        const profile = meRes?.data?.user || meRes?.data || meRes?.user || meRes;

        if (mounted && profile && (profile._id || profile.email)) {
          const userName =
            profile.name ||
            [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
            (profile.email ? profile.email.split("@")[0] : parsed.name);

          const updatedUser = {
            ...parsed,
            ...profile,
            id: profile._id || profile.id || parsed.id,
            _id: profile._id || profile.id || parsed._id,
            token: parsed.token,
            role: profile.role || parsed.role || "customer",
            email: profile.email || parsed.email,
            name: userName,
            firstName: profile.firstName || userName.split(" ")[0] || "",
            lastName: profile.lastName || userName.split(" ").slice(1).join(" ") || "",
            company: profile.company ?? parsed.company ?? "",
            phone: profile.phone ?? parsed.phone ?? "",
            country: profile.country ?? profile.region ?? parsed.country ?? "",
            region: profile.region ?? profile.country ?? parsed.region ?? "",
            initials:
              userName
                .split(" ")
                .filter(Boolean)
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "US",
            avatarBg:
              (profile.role || parsed.role) === "representative"
                ? "#c94f2d"
                : "#27624c",
          };

          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
      } catch (err) {
        console.warn("Session check:", err.message);
        if (err.status === 401 || err.response?.status === 401) {
          // Token expired or invalid on backend: log out cleanly
          console.warn("Session token expired or unauthorized. Logging out.");
          logout();
        }
      }
    };

    verifyAndRefreshProfile();

    return () => {
      mounted = false;
    };
  }, [logout]);

  /**
   * Log in with email, password, and optional expected role against the real backend API
   */
  const login = async (email, password, roleHint = null) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

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

      if (!accessToken) {
        const errorMsg =
          response?.message ||
          response?.data?.message ||
          "Authentication failed: No access token received from server.";
        return { success: false, message: errorMsg };
      }

      // Extract profile returned by login
      let profile = response?.data?.user || response?.user || null;

      // If profile is partial, fetch complete live profile from GET /api/v1/auth/me
      try {
        const meRes = await axiosInstance.get("/api/v1/auth/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const freshProfile = meRes?.data?.user || meRes?.data || meRes?.user || meRes;
        if (freshProfile && (freshProfile._id || freshProfile.email)) {
          profile = { ...(profile || {}), ...freshProfile };
        }
      } catch (meErr) {
        console.warn("Could not fetch extended profile after login:", meErr.message);
      }

      const userName =
        profile?.name ||
        [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
        cleanEmail.split("@")[0];

      const authUser = {
        ...(profile || {}),
        id: profile?._id || profile?.id || `usr_${Date.now()}`,
        _id: profile?._id || profile?.id,
        token: accessToken,
        role: profile?.role || roleHint || "customer",
        email: profile?.email || cleanEmail,
        name: userName,
        firstName: profile?.firstName || userName.split(" ")[0] || "",
        lastName: profile?.lastName || userName.split(" ").slice(1).join(" ") || "",
        company: profile?.company || "",
        phone: profile?.phone || "",
        country: profile?.country || profile?.region || "",
        region: profile?.region || profile?.country || "",
        initials:
          userName
            .split(" ")
            .filter(Boolean)
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "US",
        avatarBg:
          (profile?.role || roleHint) === "representative" ? "#c94f2d" : "#27624c",
        loginAt: new Date().toISOString(),
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      } catch (e) {
        console.error("Failed to save auth to localStorage:", e);
      }

      setUser(authUser);
      return { success: true, user: authUser };
    } catch (apiError) {
      const errData = apiError.data || apiError.response?.data;

      if (errData?.code === "EMAIL_NOT_VERIFIED") {
        return {
          success: false,
          code: "EMAIL_NOT_VERIFIED",
          email: cleanEmail,
          message:
            errData.message ||
            "Please verify your email using the OTP sent to your email address.",
        };
      }

      if (errData?.code === "ACCOUNT_PENDING_APPROVAL") {
        return {
          success: false,
          code: "ACCOUNT_PENDING_APPROVAL",
          message:
            errData.message ||
            "Your representative account is awaiting administrator approval.",
        };
      }

      const errorMsg =
        errData?.message ||
        errData?.error ||
        apiError.message ||
        "Invalid email or password. Please verify your credentials.";

      return {
        success: false,
        message: errorMsg,
      };
    }
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
        // Customer verified: Token and real user returned directly
        if (data?.token && data?.user) {
          const accessToken = data.token;
          const profile = data.user;
          const userName =
            profile?.name ||
            [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
            email.split("@")[0];

          const authUser = {
            ...profile,
            id: profile?._id || profile?.id || `usr_${Date.now()}`,
            _id: profile?._id || profile?.id,
            token: accessToken,
            role: profile?.role || "customer",
            email: profile?.email || email,
            name: userName,
            firstName: profile?.firstName || userName.split(" ")[0] || "",
            lastName: profile?.lastName || userName.split(" ").slice(1).join(" ") || "",
            company: profile?.company || "",
            phone: profile?.phone || "",
            country: profile?.country || profile?.region || "",
            region: profile?.region || profile?.country || "",
            initials:
              userName
                .split(" ")
                .filter(Boolean)
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "US",
            avatarBg:
              profile?.role === "representative" ? "#c94f2d" : "#27624c",
            loginAt: new Date().toISOString(),
          };

          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
          } catch (e) {
            console.error("Failed to save auth to localStorage:", e);
          }

          setUser(authUser);
          return { success: true, user: authUser, message: data.message };
        }

        // Representative verified: Requires admin approval
        return {
          success: true,
          requiresApproval: Boolean(data?.requiresApproval),
          message:
            data?.message ||
            "Email verified! Your representative account is pending administrator approval.",
          user: data?.user,
        };
      }

      return {
        success: false,
        message: data?.message || "Invalid or expired verification code.",
      };
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
        message:
          data?.message || "A new verification code has been sent to your email.",
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
      const updatedFields =
        res?.data?.user || res?.data || res?.user || profileData;

      const userName =
        updatedFields.name ||
        [updatedFields.firstName, updatedFields.lastName].filter(Boolean).join(" ") ||
        user?.name;

      const mergedUser = {
        ...user,
        ...updatedFields,
        name: userName,
        company: updatedFields.company ?? user?.company ?? "",
        phone: updatedFields.phone ?? user?.phone ?? "",
        country:
          updatedFields.country ??
          updatedFields.region ??
          user?.country ??
          user?.region ??
          "",
        region:
          updatedFields.region ??
          updatedFields.country ??
          user?.region ??
          user?.country ??
          "",
        initials:
          userName
            .split(" ")
            .filter(Boolean)
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || user?.initials || "US",
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
        message:
          err.response?.data?.message || err.message || "Failed to update profile",
      };
    }
  };

  const value = {
    user,
    isAuthenticated: Boolean(user && user.token),
    isCustomer: user?.role === "customer",
    isRepresentative: user?.role === "representative",
    login,
    register,
    verifyOtp,
    resendOtp,
    updateProfile,
    getMe: () => authApi.getMe(),
    logout,
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

export default AuthContext;
