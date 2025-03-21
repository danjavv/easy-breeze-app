
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleSelection from '@/components/auth/RoleSelection';
import SupplierRegistrationForm from '@/components/auth/SupplierRegistrationForm';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { userRole } = useAuth();
  const navigate = useNavigate();

  // Check authentication state and redirect if necessary
  useEffect(() => {
    if (userRole) {
      const dashboardRoute = userRole === 'admin' ? '/admin-dashboard' : '/supplier-dashboard';
      navigate(dashboardRoute);
    }
  }, [userRole, navigate]);

  const handleStartRegistration = () => {
    setIsRegistering(true);
    setIsLoggingIn(false);
  };

  const handleStartLogin = () => {
    setIsLoggingIn(true);
    setIsRegistering(false);
  };

  const handleBackToSelection = () => {
    setIsRegistering(false);
    setIsLoggingIn(false);
  };

  if (isRegistering) {
    return <SupplierRegistrationForm 
      onBack={handleBackToSelection} 
      onLoginClick={handleStartLogin}
    />;
  }

  if (isLoggingIn) {
    return <LoginForm 
      onBack={handleBackToSelection} 
      onRegisterClick={handleStartRegistration}
    />;
  }

  return (
    <RoleSelection 
      onRegisterClick={handleStartRegistration}
      onLoginClick={handleStartLogin} 
    />
  );
};

export default Auth;
