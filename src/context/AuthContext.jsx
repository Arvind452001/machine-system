import { createContext, useContext, useState, useEffect } from "react";

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
   * Synchronously writes to localStorage and state.
   */
  const login = async (email, password, roleHint = null) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    // Check against customer dummy
    const isCustomer =
      (cleanEmail === DUMMY_USERS.customer.email.toLowerCase() ||
        cleanEmail === "customer@example.com" ||
        cleanEmail === "morgan@machinesystems.com") &&
      cleanPassword === DUMMY_USERS.customer.password;

    // Check against representative dummy
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
      message: "Invalid email or password. Please use the demo credentials provided.",
    };
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
