
import { useState } from 'react';
import RoleSelection from '@/components/auth/RoleSelection';
import SupplierRegistrationForm from '@/components/auth/SupplierRegistrationForm';

const Auth = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleStartRegistration = () => {
    setIsRegistering(true);
  };

  const handleBackToSelection = () => {
    setIsRegistering(false);
  };

  return isRegistering ? (
    <SupplierRegistrationForm onBack={handleBackToSelection} />
  ) : (
    <RoleSelection onRegisterClick={handleStartRegistration} />
  );
};

export default Auth;
