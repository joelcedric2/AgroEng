import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserRole = 'admin' | 'moderator' | 'user' | null;

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching role for user:', user.id);
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .order('role')
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          console.log('Setting default role to user');
          setRole('user'); // Default to user role if no role found
        } else {
          console.log('Fetched role data:', data);
          const userRole = data?.role || 'user';
          console.log('Setting role to:', userRole);
          setRole(userRole);
        }
      } catch (err) {
        console.error('Error in fetchUserRole:', err);
        setRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const isAdmin = role === 'admin';
  const isModerator = role === 'moderator';
  const isUser = role === 'user';

  return {
    role,
    loading,
    isAdmin,
    isModerator,
    isUser,
    hasRole: (requiredRole: UserRole) => role === requiredRole,
    hasAnyRole: (roles: UserRole[]) => roles.includes(role)
  };
};