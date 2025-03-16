
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type UserRole = 'admin' | 'supplier' | null;

type SupplierStatus = 'pending' | 'approved' | 'rejected';

type AuthContextType = {
  userRole: UserRole;
  supplierStatus: SupplierStatus;
  supplierID: string | null;
  setUserRole: (role: UserRole) => void;
  setSupplierStatus: (status: SupplierStatus) => void;
  setSupplierID: (id: string | null) => void;
  redirectToDashboard: () => string;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage if available
  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('userRole');
    return (savedRole as UserRole) || null;
  });
  
  const [supplierStatus, setSupplierStatusState] = useState<SupplierStatus>(() => {
    const savedStatus = localStorage.getItem('supplierStatus');
    return (savedStatus as SupplierStatus) || 'pending';
  });
  
  const [supplierID, setSupplierIDState] = useState<string | null>(() => {
    return localStorage.getItem('supplierID');
  });

  // Persist state changes to localStorage
  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }
  };

  const setSupplierStatus = (status: SupplierStatus) => {
    setSupplierStatusState(status);
    localStorage.setItem('supplierStatus', status);
  };

  const setSupplierID = (id: string | null) => {
    setSupplierIDState(id);
    if (id) {
      localStorage.setItem('supplierID', id);
      console.log("Stored supplierID in localStorage:", id);
    } else {
      localStorage.removeItem('supplierID');
    }
  };

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
    setSupplierID(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('supplierID');
    localStorage.removeItem('supplierStatus');
  };

  // Log the current supplierID on component mount for debugging
  useEffect(() => {
    console.log("Current supplierID in context:", supplierID);
  }, [supplierID]);

  const value = {
    userRole,
    supplierStatus,
    supplierID,
    setUserRole,
    setSupplierStatus,
    setSupplierID,
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
