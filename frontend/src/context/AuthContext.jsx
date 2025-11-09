// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = async ({ email, password, role } = {}) => {
    const path =
      role === "recruiter" ? "/api/recruiters/login" : "/api/candidates/login";
    const res = await api.post(path, { email, password });
    const { token: accessToken, user: userObj } = res.data;
    setToken(accessToken);
    setUser(userObj);
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, setUser, setToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ← named export MUST be available for imports like: import { useAuth } from '...'
export function useAuth() {
  return useContext(AuthContext);
}
