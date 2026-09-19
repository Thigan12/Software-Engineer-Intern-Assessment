'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<User>;
  deleteAccount: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function setSessionCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = 'auth_session=true; path=/; max-age=604800; SameSite=Lax';
  }
}

function clearSessionCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = 'auth_session=; path=/; max-age=0; SameSite=Lax';
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const res = await apiFetch<{ user: User }>('/auth/me');
      if (res && res.user) {
        setUser(res.user);
        setSessionCookie();
      } else {
        setUser(null);
        clearSessionCookie();
      }
    } catch {
      setUser(null);
      clearSessionCookie();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    const res = await apiFetch<{ user: User }>('/auth/login', {
      data: { email, password },
    });
    setUser(res.user);
    setSessionCookie();
    router.push('/dashboard');
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await apiFetch<{ user: User }>('/auth/register', {
      data: { name, email, password },
    });
    setUser(res.user);
    setSessionCookie();
    router.push('/dashboard');
  };

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // Proceed even if server request fails
    } finally {
      clearSessionCookie();
      setUser(null);
      router.push('/login');
    }
  };

  const updateProfile = async (data: { name?: string; email?: string }): Promise<User> => {
    const updatedUser = await apiFetch<User>('/users/me', {
      method: 'PATCH',
      data,
    });
    setUser(updatedUser);
    return updatedUser;
  };

  const deleteAccount = async () => {
    await apiFetch('/users/me', {
      method: 'DELETE',
    });
    clearSessionCookie();
    setUser(null);
    router.push('/login');
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        deleteAccount,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
