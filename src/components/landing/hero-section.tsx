import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TemplateThumbnail } from '@/components/dashboard/template-thumbnail';

export function HeroSection() {
  const t = useTranslations('landing.hero');

  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-4 pt-16 sm:px-6 lg:px-8">
      {/* Background effects */}
      <div
        className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full opacity-20 blur-[100px] dark:opacity-10"
        style={{ background: 'radial-gradient(circle, #ec4899, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full opacity-15 blur-[100px] dark:opacity-10"
        style={{ background: 'radial-gradient(circle, #f472b6, transparent 70%)' }}
      />
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle, #71717a 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <Badge
          variant="secondary"
          className="mb-6 border-pink-200 bg-pink-50 px-4 py-1.5 text-sm text-pink-700 dark:border-pink-800 dark:bg-pink-950/50 dark:text-pink-300"
        >
          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          AI-Powered
        </Badge>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-pink-500 bg-clip-text text-transparent dark:from-zinc-100 dark:via-zinc-300 dark:to-pink-400">
            {t('title')}
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg md:text-xl dark:text-zinc-400">
          {t('subtitle')}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            className="h-12 w-full cursor-pointer rounded-xl bg-pink-500 px-8 text-base font-semibold text-white shadow-lg shadow-pink-500/25 transition-all hover:-translate-y-0.5 hover:bg-pink-600 hover:shadow-xl hover:shadow-pink-500/30 sm:h-11 sm:w-auto sm:px-6 sm:text-sm"
          >
            <Link href="/dashboard">{t('cta')}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 w-full cursor-pointer rounded-xl border-zinc-300 px-8 text-base font-semibold transition-all hover:-translate-y-0.5 dark:border-zinc-700 sm:h-11 sm:w-auto sm:px-6 sm:text-sm"
          >
            <Link href="/templates">{t('secondaryCta')}</Link>
          </Button>
        </div>

        {/* Floating template cards */}
        <div className="mt-16 flex items-center justify-center gap-4 sm:gap-6 lg:mt-20">
          <div className="animate-float h-48 w-36 -rotate-6 overflow-hidden rounded-xl border border-zinc-200 shadow-2xl shadow-zinc-200/50 dark:border-zinc-700 dark:shadow-zinc-900/50 sm:h-56 sm:w-40 lg:h-64 lg:w-48">
            <TemplateThumbnail template="modern" className="h-full w-full" />
          </div>
          <div className="animate-float-delayed h-56 w-40 overflow-hidden rounded-xl border border-pink-200 shadow-2xl shadow-pink-200/30 dark:border-pink-800 dark:shadow-pink-900/30 sm:h-64 sm:w-48 lg:h-72 lg:w-52">
            <TemplateThumbnail template="classic" className="h-full w-full" />
          </div>
          <div
            className="animate-float h-48 w-36 rotate-6 overflow-hidden rounded-xl border border-zinc-200 shadow-2xl shadow-zinc-200/50 dark:border-zinc-700 dark:shadow-zinc-900/50 sm:h-56 sm:w-40 lg:h-64 lg:w-48"
            style={{ animationDelay: '2s' }}
          >
            <TemplateThumbnail template="minimal" className="h-full w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
