import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
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

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
  }, []);

  const refreshTokenAsync = useCallback(async () => {
    try {
      const response = await api.refreshToken();

      if (response.success && response.data) {
        setToken(response.data.accessToken);
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('tokenExpiry', String(Date.now() + response.data.expiresIn * 1000));
      } else {
        logout();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  }, [logout]);

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
  }, [refreshTokenAsync]);

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

    const oneMinute = 60000;
    let refreshTime: number;

    if (timeUntilExpiry > oneMinute) {
      refreshTime = timeUntilExpiry - oneMinute;
    } else {
      refreshTime = timeUntilExpiry * 0.2;
    }

    console.log(`Setting refresh timeout: ${refreshTime}ms (expires in ${timeUntilExpiry}ms)`);

    const timeout = setTimeout(() => {
      console.log('Executing token refresh now');
      refreshTokenAsync();
    }, refreshTime);

    return () => clearTimeout(timeout);
  }, [token, refreshTokenAsync]);

  const login = async (loginResponse: LoginResponse) => {
    const { accessToken, expiresIn } = loginResponse;
    setToken(accessToken);
    localStorage.setItem('token', accessToken);
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
