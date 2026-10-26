import { createContext, useContext, useState, useEffect } from "react";

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

const STORAGE_KEY = "machine_system_auth";
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://node.aitechnotech.in/machine/api/v1";

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

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword, role: roleHint }),
      });

      const data = await response.json();

      if (response.ok && data.token && data.user) {
        const authUser = {
          ...data.user,
          token: data.token,
          loginAt: new Date().toISOString(),
          initials: (data.user.name || "User")
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
        };

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
        } catch (e) {
          console.error("Failed to save to localStorage:", e);
        }
        setUser(authUser);
        return { success: true, user: authUser };
      }

      if (data.code === "EMAIL_NOT_VERIFIED") {
        return {
          success: false,
          code: "EMAIL_NOT_VERIFIED",
          email: cleanEmail,
          message: data.message || "Please verify your email using the OTP sent to your email.",
        };
      }

      if (data.code === "ACCOUNT_PENDING_APPROVAL") {
        return {
          success: false,
          code: "ACCOUNT_PENDING_APPROVAL",
          message: data.message || "Your representative account is awaiting administrator review.",
        };
      }

      if (data.code === "ACCOUNT_REJECTED") {
        return {
          success: false,
          code: "ACCOUNT_REJECTED",
          message: data.message || "Your representative account application was rejected.",
        };
      }
    } catch (apiErr) {
      console.warn("Backend API login unreachable, trying local demo credentials:", apiErr.message);
    }

    // Fallback check against customer dummy
    const isCustomer =
      (cleanEmail === DUMMY_USERS.customer.email.toLowerCase() ||
        cleanEmail === "customer@example.com" ||
        cleanEmail === "morgan@machinesystems.com") &&
      cleanPassword === DUMMY_USERS.customer.password;

    // Fallback check against representative dummy
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
      message: "Invalid email or password. Please check your credentials.",
    };
  };

  /**
   * Register a new customer or representative (sends 6-digit OTP to email)
   */
  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          requiresOtp: Boolean(data.requiresOtp),
          email: data.email || userData.email,
          role: data.role || userData.role,
          message: data.message || "Verification code sent to your email.",
        };
      }

      return {
        success: false,
        message: data.message || "Registration failed. Please check your details and try again.",
      };
    } catch (err) {
      return {
        success: false,
        message: "Unable to connect to server. Please check your connection.",
      };
    }
  };

  /**
   * Verify 6-digit OTP
   */
  const verifyOtp = async (email, otp) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: String(otp).trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Customer verified: Token returned directly
        if (data.token && data.user) {
          const authUser = {
            ...data.user,
            token: data.token,
            loginAt: new Date().toISOString(),
            initials: (data.user.name || "User")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase(),
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
          requiresApproval: Boolean(data.requiresApproval),
          message: data.message || "Email verified! Your representative account is pending administrator approval.",
          user: data.user,
        };
      }

      return {
        success: false,
        message: data.message || "Invalid or expired verification code.",
      };
    } catch (err) {
      return {
        success: false,
        message: "Network error while verifying OTP.",
      };
    }
  };

  /**
   * Resend 6-digit OTP code
   */
  const resendOtp = async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          message: data.message || "A new verification code has been sent to your email.",
        };
      }

      return {
        success: false,
        message: data.message || "Failed to resend code. Please try again.",
      };
    } catch (err) {
      return {
        success: false,
        message: "Network error while resending OTP.",
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
