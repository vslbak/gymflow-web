import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import type { User, LoginResponse } from '../types';
import { api } from '../api/apiFactory';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (loginResponse: LoginResponse) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
  };

  const logout = useCallback(() => {
    clearAuth();
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
  }, []);

  const refreshToken = async () => {
    try {
      const response = await api.refreshToken();
      if (response.success && response.data) {
        const newToken = response.data.accessToken;
        const newExpiry = Date.now() + response.data.expiresIn;
        setToken(newToken);
        localStorage.setItem('token', newToken);
        localStorage.setItem('tokenExpiry', String(newExpiry));
      } else {
        clearAuth();
      }
    } catch {
      clearAuth();
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const tokenExpiry = localStorage.getItem('tokenExpiry');

      if (storedToken && tokenExpiry) {
        const expiryTime = parseInt(tokenExpiry, 10);

        if (Date.now() >= expiryTime) {
          await refreshToken();
        } else {
          const response = await api.getCurrentUser(storedToken);
          if (response.success && response.data) {
            setUser(response.data);
            setToken(storedToken);
          } else {
            await refreshToken();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }

    if (!token) return;

    const tokenExpiry = localStorage.getItem('tokenExpiry');
    if (!tokenExpiry) return;

    const timeUntilExpiry = parseInt(tokenExpiry, 10) - Date.now();
    if (timeUntilExpiry <= 0) {
      refreshToken();
      return;
    }

    const refreshTime = timeUntilExpiry > 60000
      ? timeUntilExpiry - 60000
      : Math.max(timeUntilExpiry * 0.8, 1000);

    refreshTimeoutRef.current = setTimeout(refreshToken, refreshTime);

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
  }, [token]);

  const login = async (loginResponse: LoginResponse) => {
    const { accessToken, expiresIn } = loginResponse;
    setToken(accessToken);
    localStorage.setItem('token', accessToken);
    localStorage.setItem('tokenExpiry', String(Date.now() + expiresIn));

    const userResponse = await api.getCurrentUser(accessToken);
    if (userResponse.success && userResponse.data) {
      setUser(userResponse.data);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user && !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
