'use client';

import Image from 'next/image';
import { LocaleSwitcher } from './locale-switcher';
import { UserMenu } from './user-menu';
import { Link } from '@/i18n/routing';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-1">
          <Image src="/logo.svg" alt="JadeAI" width={120} height={36} priority />
        </Link>
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
