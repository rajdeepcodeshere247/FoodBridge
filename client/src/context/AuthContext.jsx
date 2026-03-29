// AuthContext — stores logged-in user globally, available across all pages
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, login, logout, register } from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('fb-user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        const nextUser = res.data.user || null;
        setUser(nextUser);
        if (nextUser) localStorage.setItem('fb-user', JSON.stringify(nextUser));
      })
      .catch(() => {
        // Keep cached user for stateless fallback when session cookie is unavailable.
      })
      .finally(() => setLoading(false));
  }, []);

  const loginWithEmail = async (payload) => {
    const response = await login(payload);
    setUser(response.data.user);
    if (response.data.user) localStorage.setItem('fb-user', JSON.stringify(response.data.user));
    return response.data.user;
  };

  const registerWithEmail = async (payload) => {
    const response = await register(payload);
    setUser(response.data.user);
    if (response.data.user) localStorage.setItem('fb-user', JSON.stringify(response.data.user));
    return response.data.user;
  };

  const logoutUser = async () => {
    await logout();
    setUser(null);
    localStorage.removeItem('fb-user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      loading,
      loginWithEmail,
      registerWithEmail,
      logoutUser
    }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
