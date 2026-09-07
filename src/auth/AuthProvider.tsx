import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { login as loginRequest, logout as logoutRequest, restoreSession } from '../api/auth';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthContextValue = {
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    restoreSession()
      .then(isAuthenticated => {
        setStatus(isAuthenticated ? 'authenticated' : 'unauthenticated');
      })
      .catch(() => {
        setStatus('unauthenticated');
      });
  }, []);

  async function login(email: string, password: string) {
    await loginRequest(email, password);
    setStatus('authenticated');
  }

  async function logout() {
    await logoutRequest();
    setStatus('unauthenticated');
  }

  return (
    <AuthContext.Provider value={{ status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
