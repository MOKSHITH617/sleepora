import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = () => {
      if (token) {
        try {
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        } catch (e) {
          console.error('Failed to parse saved user credentials:', e);
          logout();
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post('/auth/login', { email, password });
      const { token: receivedToken, user: loggedUser } = response.data;

      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      
      setToken(receivedToken);
      setUser(loggedUser);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || 'Login failed. Verify admin credentials.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateCredentials = async (email, password) => {
    try {
      const response = await API.put('/auth/update', { email, password });
      const { token: updatedToken, user: updatedUser } = response.data;

      localStorage.setItem('token', updatedToken);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setToken(updatedToken);
      setUser(updatedUser);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed.';
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      error,
      isAuthenticated: !!token,
      login,
      logout,
      updateCredentials
    }}>
      {children}
    </AuthContext.Provider>
  );
};
