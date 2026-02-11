// hooks/useAuth.ts
'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/services/authService';

interface User {
  userId: number;
  email: string;
  nickname: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const data = await authService.getMe();
      if (data.isAuthenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return { 
    user, 
    loading, 
    isAuthenticated: !!user,
    logout,
    refetch: checkAuth 
  };
};