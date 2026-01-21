import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const response = await api.get("/auth/me");
        setCurrentUser(response.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setCurrentUser(null);
      }
    }
    setLoading(false);
  };

  const signup = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);

      return user;
    } catch (error) {
      throw error;
    }
  };

  const signin = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);

      return user;
    } catch (error) {
      throw error;
    }
  };

  const signout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      const response = await api.put("/auth/update-password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    currentUser,
    signup,
    signin,
    signout,
    updatePassword,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
