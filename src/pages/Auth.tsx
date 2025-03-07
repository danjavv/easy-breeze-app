
import { useState } from 'react';
import RoleSelection from '@/components/auth/RoleSelection';
import SupplierRegistrationForm from '@/components/auth/SupplierRegistrationForm';
import LoginForm from '@/components/auth/LoginForm';

const Auth = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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
