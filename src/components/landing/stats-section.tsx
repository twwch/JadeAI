import { useTranslations } from 'next-intl';

const STATS = ['templates', 'exportFormats', 'languages', 'free'] as const;

export function StatsSection() {
  const t = useTranslations('landing.stats');

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="mb-12 text-center text-sm font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          {t('title')}
        </p>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-zinc-200 dark:sm:divide-zinc-800">
          {STATS.map((key) => (
            <div key={key} className="flex flex-col items-center justify-center sm:px-8">
              <span className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-100">
                {t(`${key}.value`)}
              </span>
              <span className="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {t(`${key}.label`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
