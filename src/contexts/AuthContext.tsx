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

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
  }, []);

  const refreshTokenAsync = async () => {
    console.log('Refreshing token...');
    try {
      const response = await api.refreshToken();

      if (response.success && response.data) {
        console.log('Token refreshed successfully, new expiry:', response.data.expiresIn);
        const newToken = response.data.accessToken;
        const newExpiry = Date.now() + response.data.expiresIn * 1000;

        setToken(newToken);
        localStorage.setItem('token', newToken);
        localStorage.setItem('tokenExpiry', String(newExpiry));
      } else {
        console.error('Token refresh failed:', response.error);
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiry');
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
          console.log('Token expired on init, refreshing');
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
    if (!token) {
      console.log('No token, skipping refresh timer');
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
      return;
    }

    const scheduleRefresh = () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }

      const tokenExpiry = localStorage.getItem('tokenExpiry');
      if (!tokenExpiry) {
        console.log('No tokenExpiry found');
        return;
      }

      const expiryTime = parseInt(tokenExpiry, 10);
      const now = Date.now();
      const timeUntilExpiry = expiryTime - now;

      console.log(`Token expires in ${timeUntilExpiry}ms (${Math.floor(timeUntilExpiry/1000)}s)`);

      if (timeUntilExpiry <= 0) {
        console.log('Token already expired, refreshing immediately');
        refreshTokenAsync();
        return;
      }

      const oneMinute = 60000;
      let refreshTime: number;

      if (timeUntilExpiry > oneMinute) {
        refreshTime = timeUntilExpiry - oneMinute;
      } else {
        refreshTime = Math.max(timeUntilExpiry * 0.8, 1000);
      }

      console.log(`Setting refresh timeout for ${refreshTime}ms (${Math.floor(refreshTime/1000)}s)`);

      refreshTimeoutRef.current = setTimeout(() => {
        console.log('Timeout triggered, refreshing token now');
        refreshTokenAsync();
      }, refreshTime);
    };

    scheduleRefresh();

    return () => {
      if (refreshTimeoutRef.current) {
        console.log('Clearing refresh timeout on unmount/token change');
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
  }, [token]);

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
