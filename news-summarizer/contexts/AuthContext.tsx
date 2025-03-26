'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing token in localStorage
    const token = localStorage.getItem('inoreader_access_token');
    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true);
    }

    // Check for tokens in URL (after OAuth callback)
    const params = new URLSearchParams(window.location.search);
    const newAccessToken = params.get('access_token');
    const newRefreshToken = params.get('refresh_token');

    if (newAccessToken && newRefreshToken) {
      localStorage.setItem('inoreader_access_token', newAccessToken);
      localStorage.setItem('inoreader_refresh_token', newRefreshToken);
      setAccessToken(newAccessToken);
      setIsAuthenticated(true);
      
      // Clean up URL
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const login = () => {
    const clientId = process.env.NEXT_PUBLIC_INOREADER_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_INOREADER_REDIRECT_URI;
    const state = Math.random().toString(36).substring(7);
    
    // Store state for CSRF protection
    localStorage.setItem('oauth_state', state);
    
    // Redirect to Inoreader OAuth page
    const authUrl = `https://www.inoreader.com/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=read&state=${state}`;
    window.location.href = authUrl;
  };

  const logout = () => {
    localStorage.removeItem('inoreader_access_token');
    localStorage.removeItem('inoreader_refresh_token');
    localStorage.removeItem('oauth_state');
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, accessToken, login, logout }}>
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