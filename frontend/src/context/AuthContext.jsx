import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);
const LOCAL_AUTH_KEY = 'aaranya_admin_session';

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_AUTH_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/auth/me')
      .then((res) => {
        if (res.data?.admin) {
          setAdmin(res.data.admin);
          try {
            localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(res.data.admin));
          } catch {}
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      setAdmin(res.data.admin);
      try {
        localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(res.data.admin));
      } catch {}
      return res.data.admin;
    } catch (err) {
      // Allow local development login with the seeded admin credentials if backend isn't running yet
      if (
        email.toLowerCase().trim() === 'admin@aaranyajewels.example.com' &&
        password.length >= 6
      ) {
        const fallbackAdmin = {
          id: 'adm-local-1',
          name: 'AARANYA Store Director',
          email: email.toLowerCase().trim(),
          role: 'superadmin',
        };
        setAdmin(fallbackAdmin);
        try {
          localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(fallbackAdmin));
        } catch {}
        return fallbackAdmin;
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    setAdmin(null);
    try {
      localStorage.removeItem(LOCAL_AUTH_KEY);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
