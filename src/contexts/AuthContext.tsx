
import { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'admin' | 'supplier' | null;

type SupplierStatus = 'pending' | 'approved' | 'rejected';

type AuthContextType = {
  userRole: UserRole;
  supplierStatus: SupplierStatus;
  setUserRole: (role: UserRole) => void;
  setSupplierStatus: (status: SupplierStatus) => void;
  redirectToDashboard: () => string;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [supplierStatus, setSupplierStatus] = useState<SupplierStatus>('pending');

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
    supplierStatus,
    setUserRole,
    setSupplierStatus,
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
