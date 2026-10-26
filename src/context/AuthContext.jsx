/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/authApi";
import { getAuthToken } from "../api/axiosInstance";

// Dummy credentials for Customer & Representative
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

const STORAGE_KEY = "machine_system_auth";

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

  // Verify and sync latest user profile from server if token exists
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      authApi
        .getMe()
        .then((res) => {
          const freshUser = res?.data?.user || res?.data || res?.user;
          if (freshUser) {
            setUser((prev) => {
              const updated = {
                ...(prev || {}),
                ...freshUser,
                id: freshUser._id || freshUser.id || prev?.id,
                token: token,
                initials: freshUser.name
                  ? freshUser.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : prev?.initials || "US",
                avatarBg:
                  freshUser.role === "representative" ? "#c94f2d" : "#27624c",
              };
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
              } catch (e) {
                console.error("Failed to sync storage user:", e);
              }
              return updated;
            });
          }
        })
        .catch((err) => {
          console.warn("Could not sync getMe profile from server:", err.message);
        });
    }
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

  /**
   * Log in with email and password via backend API with fallback to demo users
   */
  const login = async (email, password) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    // 1. Try real backend API first
    try {
      const response = await authApi.login({
        email: cleanEmail,
        password: cleanPassword,
      });

      const accessToken =
        response?.token ||
        response?.data?.token ||
        response?.data?.accessToken ||
        response?.accessToken;

      if (accessToken || response?.success) {
        // Temporarily store token so request interceptor includes Authorization header
        if (accessToken) {
          try {
            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({ token: accessToken })
            );
          } catch (e) {
            console.error("Failed to store initial token:", e);
          }
        }

        // Fetch user profile from getMe
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
          role: profile?.role || "customer",
          email: profile?.email || cleanEmail,
          name: userName,
          initials: userName
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
          avatarBg:
            profile?.role === "representative" ? "#c94f2d" : "#27624c",
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
      console.warn(
        "Backend login failed or server unreachable, checking demo credentials:",
        apiError.message
      );
    }

    // 2. Fallback to demo users
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
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
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
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
      setUser(authUser);
      return { success: true, user: authUser };
    }

    return {
      success: false,
      message:
        "Invalid email or password. Please use registered or demo credentials.",
    };
  };

  /**
   * Register a new user via the backend API
   */
  const register = async (userData) => {
    try {
      const res = await authApi.register(userData);
      const accessToken =
        res?.token ||
        res?.data?.token ||
        res?.data?.accessToken ||
        res?.accessToken;

      if (accessToken || res?.success) {
        // Save token to localStorage for subsequent getMe call
        if (accessToken) {
          try {
            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({ token: accessToken })
            );
          } catch (e) {
            console.error("Failed to store initial token:", e);
          }
        }

        let profile = res?.data?.user || res?.user || null;
        if (!profile && accessToken) {
          try {
            const meRes = await authApi.getMe();
            profile = meRes?.data?.user || meRes?.data || meRes?.user || null;
          } catch (meErr) {
            console.warn("Could not fetch profile after register:", meErr.message);
          }
        }

        const userName =
          profile?.name ||
          userData.name ||
          [userData.firstName, userData.lastName].filter(Boolean).join(" ") ||
          userData.email.split("@")[0];

        const authUser = {
          ...(userData || {}),
          ...(profile || {}),
          id: profile?._id || profile?.id || `usr_${Date.now()}`,
          token: accessToken,
          role: profile?.role || userData?.role || "customer",
          email: profile?.email || userData.email,
          name: userName,
          initials: userName
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
          avatarBg:
            (profile?.role || userData?.role) === "representative"
              ? "#c94f2d"
              : "#27624c",
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
      return { success: false, message: res?.message || "Registration failed" };
    } catch (err) {
      return { success: false, message: err.message || "Registration failed" };
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
        message: err.message || "Failed to update profile",
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
