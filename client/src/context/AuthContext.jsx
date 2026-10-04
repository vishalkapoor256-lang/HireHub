import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // GET CURRENT LOGGED-IN USER
  // ==========================================

  const fetchCurrentUser = async () => {
    const token =
      localStorage.getItem("hirehub_token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(
        "/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data.user);
    } catch (error) {
      console.error(
        "Failed to fetch current user"
      );

      localStorage.removeItem(
        "hirehub_token"
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // ==========================================
  // LOGIN
  // ==========================================

  const login = async (
    email,
    password
  ) => {
    const response = await api.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    const { token, user } =
      response.data;

    localStorage.setItem(
      "hirehub_token",
      token
    );

    setUser(user);

    return response.data;
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const register = async (
    name,
    email,
    password,
    role,
    otp
  ) => {
    const response = await api.post(
      "/auth/register",
      {
        name,
        email,
        password,
        role,
        otp,
      }
    );

    const { token, user } =
      response.data;

    localStorage.setItem(
      "hirehub_token",
      token
    );

    setUser(user);

    return response.data;
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem(
      "hirehub_token"
    );

    setUser(null);
    setLoading(false);
  };

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ==========================================
// USE AUTH HOOK
// ==========================================

export const useAuth = () => {
  return useContext(AuthContext);
};