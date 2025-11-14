import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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

  const refreshTokenAsync = async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (!storedRefreshToken) {
      logout();
      return;
    }

    try {
      const response = await api.refreshToken({ refreshToken: storedRefreshToken });

      if (response.success && response.data) {
        setToken(response.data.accessToken);
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('tokenExpiry', String(Date.now() + response.data.expiresIn * 1000));
      } else {
        logout();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  useEffect(() => {
    const initAuth = async () => {
    const storedToken = localStorage.getItem('token');
      const tokenExpiry = localStorage.getItem('tokenExpiry');

      if (storedToken && tokenExpiry) {
        const expiryTime = parseInt(tokenExpiry, 10);
        const now = Date.now();

        if (now >= expiryTime) {
          await refreshTokenAsync();
        } else {
      try {
          const response = await api.getCurrentUser(storedToken);
          if (response.success && response.data) {
            setUser(response.data);
      setToken(storedToken);
          } else {
              await refreshTokenAsync();
          }
      } catch (error) {
          console.error('Failed to fetch user data:', error);
            await refreshTokenAsync();
          }
      }
    }
      setLoading(false);
    };

    initAuth();
  }, []);

  useEffect(() => {
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    if (!tokenExpiry || !token) return;

    const expiryTime = parseInt(tokenExpiry, 10);
    const now = Date.now();
    const timeUntilExpiry = expiryTime - now;

    if (timeUntilExpiry <= 0) {
      refreshTokenAsync();
      return;
    }

    const refreshTime = timeUntilExpiry - 60000;
    const timeout = setTimeout(() => {
      refreshTokenAsync();
    }, refreshTime);

    return () => clearTimeout(timeout);
  }, [token]);

  const login = async (loginResponse: LoginResponse) => {
    const { accessToken, refreshToken: refresh, expiresIn } = loginResponse;
    setToken(accessToken);
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('tokenExpiry', String(Date.now() + expiresIn * 1000));

    try {
      const userResponse = await api.getCurrentUser(accessToken);
      if (userResponse.success && userResponse.data) {
        setUser(userResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch user after login:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
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
