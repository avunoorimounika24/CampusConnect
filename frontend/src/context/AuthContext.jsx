import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('cc_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user on startup if token exists
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('cc_token');
      const storedUser = localStorage.getItem('cc_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Verify with backend
          const res = await authService.getCurrentUser();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('cc_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success && res.data) {
      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('cc_token', token);
      localStorage.setItem('cc_user', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success && res.data) {
      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('cc_token', token);
      localStorage.setItem('cc_user', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_user');
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isStudent = user?.role === 'ROLE_STUDENT';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        isStudent,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
