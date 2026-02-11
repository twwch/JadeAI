import { useTranslations } from 'next-intl';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginButton } from '@/components/auth/login-button';

export default function LoginPage() {
  const t = useTranslations();

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50">
          <FileText className="h-6 w-6 text-pink-500" />
        </div>
        <CardTitle className="text-xl">{t('auth.welcomeBack')}</CardTitle>
        <CardDescription>{t('auth.loginDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <LoginButton />
      </CardContent>
    </Card>
  );
}
