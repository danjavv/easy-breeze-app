import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleSelection from '@/components/auth/RoleSelection';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { userRole } = useAuth();
  const navigate = useNavigate();

  // Check authentication state and redirect if necessary
  useEffect(() => {
    if (userRole) {
      navigate('/admin-dashboard');
    }
  }, [userRole, navigate]);

  const handleStartLogin = () => {
    setIsLoggingIn(true);
  };

  const handleBackToSelection = () => {
    setIsLoggingIn(false);
  };

  if (isLoggingIn) {
    return <LoginForm 
      onBack={handleBackToSelection} 
      onRegisterClick={() => {}}
    />;
  }

  return (
    <RoleSelection 
      onRegisterClick={() => {}}
      onLoginClick={handleStartLogin} 
    />
  );
};

export default Auth;
