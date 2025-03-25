import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'supplier';
}

const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const { userRole } = useAuth();

  if (!userRole) {
    // Not logged in, redirect to auth page
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Wrong role, redirect to appropriate dashboard
    const redirectPath = userRole === 'admin' ? '/admin-dashboard' : '/supplier-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard; 