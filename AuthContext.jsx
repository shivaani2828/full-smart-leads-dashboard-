import { createContext, useContext, useEffect, useState } from "react";
import API from "../utils/api.js";
import socket from "../socket.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await API.get("/auth/me");
      if (res.success) {
        setUser(res.user);
        setIsAuthenticated(true);
        socket.connect();
        socket.emit("join", res.user.id);
      }
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  async function login(credentials) {
    setLoading(true);
    setError(null);
    try {
      const res = await API.post("/auth/login", credentials);
      setUser(res.user);
      setIsAuthenticated(true);
      socket.connect();
      socket.emit("join", res.user.id);
      return res;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function register(userData) {
    setLoading(true);
    setError(null);
    try {
      const res = await API.post("/auth/register", userData);
      setUser(res.user);
      setIsAuthenticated(true);
      return res;
    } catch (err) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await API.post("/auth/logout");
    } finally {
      socket.disconnect(); 
      setUser(null);
      setIsAuthenticated(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, error, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);