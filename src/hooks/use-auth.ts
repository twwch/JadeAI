'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { config } from '@/lib/config';
import { useFingerprint } from './use-fingerprint';

export function useAuth() {
  const session = useSession();
  const { fingerprint, isLoading: fpLoading } = useFingerprint();

  if (config.auth.enabled) {
    return {
      user: session.data?.user
        ? {
            id: session.data.user.id || '',
            name: session.data.user.name,
            email: session.data.user.email,
            avatarUrl: session.data.user.image,
            authType: 'oauth' as const,
          }
        : null,
      isLoading: session.status === 'loading',
      isAuthenticated: session.status === 'authenticated',
      signIn: () => signIn('google'),
      signOut: () => signOut(),
    };
  }

  return {
    user: fingerprint
      ? {
          id: `fp_${fingerprint}`,
          name: 'Anonymous User',
          email: null,
          avatarUrl: null,
          authType: 'fingerprint' as const,
        }
      : null,
    isLoading: fpLoading,
    isAuthenticated: !!fingerprint,
    signIn: () => {},
    signOut: () => {},
  };
}
