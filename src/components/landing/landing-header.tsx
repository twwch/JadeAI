'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';

const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true';

export function LandingHeader() {
  const t = useTranslations('landing.header');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const isLoggedIn = AUTH_ENABLED && !!session?.user;
  const ctaLabel = isLoggedIn ? t('dashboard') : t('getStarted');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? 'border-zinc-200 bg-white/80 backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-950/80'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="JadeAI" width={120} height={36} priority />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            {t('features')}
          </a>
          <a
            href="#templates"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            {t('templates')}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <Button
            asChild
            className="hidden cursor-pointer bg-pink-500 text-white hover:bg-pink-600 sm:inline-flex"
          >
            <Link href="/dashboard">{ctaLabel}</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <nav className="mt-8 flex flex-col gap-4">
                <a
                  href="#features"
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  {t('features')}
                </a>
                <a
                  href="#templates"
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  {t('templates')}
                </a>
                <Button
                  asChild
                  className="mt-4 cursor-pointer bg-pink-500 text-white hover:bg-pink-600"
                >
                  <Link href="/dashboard">{ctaLabel}</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
