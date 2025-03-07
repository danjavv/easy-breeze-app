
import { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'admin' | 'supplier' | null;

type AuthContextType = {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  redirectToDashboard: () => string;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null);

  // Function to determine which dashboard to redirect to based on user role
  const redirectToDashboard = () => {
    if (userRole === 'supplier') {
      return '/supplier-dashboard';
    } else if (userRole === 'admin') {
      return '/admin-dashboard';
    }
    return '/auth'; // Fallback to auth page if no role or unknown role
  };

  // Function to sign out the user
  const signOut = () => {
    setUserRole(null);
  };

  const value = {
    userRole,
    setUserRole,
    redirectToDashboard,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
