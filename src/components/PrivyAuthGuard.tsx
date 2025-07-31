import React, { useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import Loader from './ui/loader';

interface PrivyAuthGuardProps {
  children: React.ReactNode;
}

const PrivyAuthGuard: React.FC<PrivyAuthGuardProps> = ({ children }) => {
  const { authenticated, ready } = usePrivy();
  const navigate = useNavigate();

  const redirectToAuth = useCallback(() => {
    if (ready && !authenticated) {
      navigate('/auth');
    }
  }, [ready, authenticated, navigate]);

  React.useEffect(() => {
    redirectToAuth();
  }, [redirectToAuth]);

  if (!ready) {
    return <Loader />;
  }

  if (!authenticated) {
    return null; // Will redirect to auth page
  }

  return <>{children}</>;
};

export default PrivyAuthGuard; 