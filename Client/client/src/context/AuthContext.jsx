import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("cybershield_user");
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("cybershield_token") || null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      api
        .getProfile()
        .then((profile) => {
          setUser(profile);
          localStorage.setItem("cybershield_user", JSON.stringify(profile));
        })
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.login({ email, password });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("cybershield_token", data.token);
      localStorage.setItem("cybershield_user", JSON.stringify(data.user));
      return data;
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.adminLogin({ email, password });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("cybershield_token", data.token);
      localStorage.setItem("cybershield_user", JSON.stringify(data.user));
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await api.register({ name, email, password });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("cybershield_token", data.token);
      localStorage.setItem("cybershield_user", JSON.stringify(data.user));
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("cybershield_token");
    localStorage.removeItem("cybershield_user");
  };

  const updateUserState = (updatedUser) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedUser };
      localStorage.setItem("cybershield_user", JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isAdmin: user?.role === "admin",
        loading,
        login,
        adminLogin,
        register,
        logout,
        updateUserState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
