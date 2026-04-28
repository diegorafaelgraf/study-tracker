import { createContext, useContext, useState } from 'react';

type AuthContextType = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  userId: string | undefined;
  role: string | undefined;
};

type JwtPayload = {
  sub: string;
  exp: number;
  role: string;
};

const parseJwt = (token: string): JwtPayload | null => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState(
    localStorage.getItem('token')
  );

  const handleLogin = (token: string) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const payload = token ? parseJwt(token) : null;
  const userId = payload?.sub;
  const role = payload?.role;

  return (
    <AuthContext.Provider value={{ token, login: handleLogin, logout, userId, role }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};