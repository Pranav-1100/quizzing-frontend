import { createContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await api.auth.getMe();
        setUser(userData);
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (credentials) => {
    const userData = await api.auth.login(credentials);
    setUser(userData);
    localStorage.setItem('authToken', userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  const register = async (userData) => {
    const newUser = await api.auth.register(userData);
    setUser(newUser);
    localStorage.setItem('authToken', newUser.token);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
}