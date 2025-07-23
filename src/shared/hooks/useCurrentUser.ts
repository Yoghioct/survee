import { useState, useEffect } from 'react';
import { getFetch } from '../../../lib/axiosConfig';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  companyId?: string;
  createdAt: string;
  updatedAt: string;
  image?: string;
}

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsLoading(true);
        const user = await getFetch<User>('/api/current');
        setCurrentUser(user);
        setError(null);
      } catch (err) {
        setError('Failed to fetch user data');
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return {
    currentUser,
    isLoading,
    error,
    isAdmin: currentUser?.role === 'ADMIN',
    isUser: currentUser?.role === 'USER',
  };
};
