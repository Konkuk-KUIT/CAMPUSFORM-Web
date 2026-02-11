// hooks/useAuth.ts
'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import type { User } from '@/types/auth'; // 타입 import 추가

// interface User {  // 이 부분 삭제
//   userId: number;
//   email: string;
//   nickname: string;
// }

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const data = await authService.getCurrentUser();
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