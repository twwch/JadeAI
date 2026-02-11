'use client';

import { useAuth } from '@/hooks/use-auth';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export function LoginButton() {
  const { signIn } = useAuth();
  const t = useTranslations('auth');

  return (
    <Button onClick={signIn} className="cursor-pointer bg-pink-500 hover:bg-pink-600">
      {t('loginWithGoogle')}
    </Button>
  );
}
