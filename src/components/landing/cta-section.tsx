import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export function CTASection() {
  const t = useTranslations('landing.cta');

  return (
    <section className="px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl">
        <div
          className="landing-cta-bg relative px-6 py-16 text-center sm:px-12 sm:py-24"
        >
          {/* Decorative circles */}
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute left-1/4 top-1/2 h-20 w-20 rounded-full bg-white/5 animate-pulse" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              {t('title')}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base text-white/80 sm:text-lg">
              {t('subtitle')}
            </p>
            <Button
              asChild
              className="mt-10 h-12 cursor-pointer rounded-xl bg-white px-8 text-base font-semibold text-pink-600 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-zinc-50 hover:shadow-xl sm:h-11 sm:px-6 sm:text-sm"
            >
              <Link href="/dashboard">{t('button')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
