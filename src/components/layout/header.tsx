'use client';

import Image from 'next/image';
import { Settings } from 'lucide-react';
import { LocaleSwitcher } from './locale-switcher';
import { UserMenu } from './user-menu';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/ui-store';
import { useTranslations } from 'next-intl';

export function Header() {
  const { openModal } = useUIStore();
  const t = useTranslations('settings');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-background/95 dark:supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-1">
          <Image src="/logo.svg" alt="JadeAI" width={120} height={36} priority />
        </Link>
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => openModal('settings')}
            className="cursor-pointer text-zinc-500"
            title={t('title')}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
