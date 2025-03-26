'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function LoginButton() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <Button
      onClick={isAuthenticated ? logout : login}
      variant={isAuthenticated ? "outline" : "default"}
    >
      {isAuthenticated ? 'Logout from Inoreader' : 'Login with Inoreader'}
    </Button>
  );
} 