import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Set up global axios request interceptor for token authentication
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('shopez_token');
  if (token && token !== 'undefined') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only clear auth state when the token itself is invalid/expired,
    // not for every 401 (e.g. a cart or product endpoint 401).
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || '';
      const isAuthEndpoint = url.includes('/api/auth') || url.includes('/api/orders');
      const msg = error.response.data?.message || '';
      const isTokenError = msg.toLowerCase().includes('token') || msg.toLowerCase().includes('not authorized');
      if (isAuthEndpoint || isTokenError) {
        localStorage.removeItem('shopez_token');
        localStorage.removeItem('shopez_user');
        delete axios.defaults.headers.common['Authorization'];
      }
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('shopez_token');
    const storedUser = localStorage.getItem('shopez_user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = useCallback((token, userData) => {
    localStorage.setItem('shopez_token', token);
    localStorage.setItem('shopez_user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('shopez_token');
    localStorage.removeItem('shopez_user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
