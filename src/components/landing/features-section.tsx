'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
  Sparkles,
  Layout,
  GripVertical,
  Download,
  Share2,
  FileSearch,
  Languages,
  FileText,
  SpellCheck,
  type LucideIcon,
} from 'lucide-react';

const FEATURES = [
  { key: 'aiChat', icon: Sparkles },
  { key: 'templates', icon: Layout },
  { key: 'dragDrop', icon: GripVertical },
  { key: 'export', icon: Download },
  { key: 'sharing', icon: Share2 },
  { key: 'jdMatch', icon: FileSearch },
  { key: 'translate', icon: Languages },
  { key: 'coverLetter', icon: FileText },
  { key: 'grammarCheck', icon: SpellCheck },
] as const;

const AUTO_CYCLE_MS = 5000;

/* ── Demo components ── */

function DemoAiChat() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-6">
      {/* User message */}
      <div className="flex justify-end" style={{ animation: 'demo-slide-up 0.5s ease-out both' }}>
        <div className="max-w-[70%] rounded-2xl rounded-br-md bg-pink-500 px-4 py-2.5 text-sm text-white">
          Help me rewrite this bullet point to be more impactful
        </div>
      </div>
      {/* AI response */}
      <div className="flex justify-start" style={{ animation: 'demo-slide-up 0.5s ease-out 0.6s both' }}>
        <div className="max-w-[80%] rounded-2xl rounded-bl-md border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          <span className="font-medium text-pink-500">&#10024;</span>{' '}
          &ldquo;Spearheaded migration to microservices, reducing latency by 40% and enabling 2M+ DAU scaling&rdquo;
        </div>
      </div>
      {/* Typing indicator */}
      <div className="flex justify-start" style={{ animation: 'demo-slide-up 0.5s ease-out 1.2s both' }}>
        <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
          <span className="h-2 w-2 rounded-full bg-zinc-400" style={{ animation: 'demo-typing-dot 1.4s infinite 0s' }} />
          <span className="h-2 w-2 rounded-full bg-zinc-400" style={{ animation: 'demo-typing-dot 1.4s infinite 0.2s' }} />
          <span className="h-2 w-2 rounded-full bg-zinc-400" style={{ animation: 'demo-typing-dot 1.4s infinite 0.4s' }} />
        </div>
      </div>
    </div>
  );
}

function DemoTemplates() {
  return (
    <div className="flex h-full items-center justify-center gap-4 p-6">
      {[
        { bg: 'linear-gradient(135deg, #1a1a2e, #0f3460)', label: 'Modern' },
        { bg: 'linear-gradient(135deg, #7c3aed, #f97316)', label: 'Creative' },
        { bg: '#2d3436', label: 'Executive' },
      ].map((tpl, i) => (
        <div
          key={tpl.label}
          className="relative w-28 rounded-lg border border-zinc-200 bg-white shadow-lg transition-transform dark:border-zinc-700 dark:bg-zinc-800"
          style={{
            animation: `demo-slide-up 0.4s ease-out ${i * 0.15}s both`,
            transform: i === 1 ? 'scale(1.08)' : 'scale(0.95)',
          }}
        >
          <div className="h-8 rounded-t-lg" style={{ background: tpl.bg }} />
          <div className="space-y-1.5 p-2">
            <div className="h-1 w-10 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-1 w-full rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-1 w-4/5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-1 w-full rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-1 w-3/5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          </div>
          <div className="px-2 pb-2 text-center text-[10px] font-medium text-zinc-500 dark:text-zinc-400">{tpl.label}</div>
        </div>
      ))}
    </div>
  );
}

function DemoDragDrop() {
  const items = ['Personal Info', 'Work Experience', 'Education', 'Skills'];
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
      {items.map((item, i) => (
        <div
          key={item}
          className="flex w-56 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
          style={{
            animation:
              i === 2
                ? 'demo-drag-item 3s ease-in-out infinite'
                : i === 1
                  ? 'demo-drag-displaced 3s ease-in-out infinite'
                  : undefined,
          }}
        >
          <GripVertical className="h-3.5 w-3.5 text-zinc-400" />
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{item}</span>
          {i === 2 && (
            <span className="ml-auto text-[10px] text-pink-500">dragging...</span>
          )}
        </div>
      ))}
    </div>
  );
}

function DemoExport() {
  const formats = [
    { label: 'PDF', color: 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400' },
    { label: 'DOCX', color: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400' },
    { label: 'HTML', color: 'bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400' },
    { label: 'TXT', color: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' },
    { label: 'JSON', color: 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400' },
  ];
  return (
    <div className="flex h-full items-center justify-center gap-6 p-6">
      {/* Document icon */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative h-24 w-20 rounded-lg border-2 border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-800">
          <div className="absolute right-0 top-0 h-4 w-4 border-b-2 border-l-2 border-zinc-300 bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-700" />
          <div className="mt-6 space-y-1 px-2">
            <div className="h-1 w-full rounded-full bg-zinc-200 dark:bg-zinc-600" />
            <div className="h-1 w-3/4 rounded-full bg-zinc-200 dark:bg-zinc-600" />
            <div className="h-1 w-full rounded-full bg-zinc-200 dark:bg-zinc-600" />
          </div>
        </div>
        <Download
          className="h-5 w-5 text-pink-500"
          style={{ animation: 'demo-download-arrow 2s ease-in-out infinite' }}
        />
      </div>
      {/* Format badges */}
      <div className="flex flex-col gap-2">
        {formats.map((f, i) => (
          <span
            key={f.label}
            className={`rounded-md px-3 py-1 text-xs font-semibold ${f.color}`}
            style={{ animation: `demo-slide-up 0.3s ease-out ${i * 0.12}s both` }}
          >
            .{f.label.toLowerCase()}
          </span>
        ))}
      </div>
    </div>
  );
}

function DemoSharing() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
      {/* URL bar */}
      <div
        className="flex w-72 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
        style={{ animation: 'demo-slide-up 0.4s ease-out both' }}
      >
        <Share2 className="h-4 w-4 shrink-0 text-zinc-400" />
        <span className="truncate text-xs text-zinc-500 dark:text-zinc-400">
          jadeai.app/share/a3f8k2...
        </span>
        <span
          className="ml-auto shrink-0 rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-600 dark:bg-green-950 dark:text-green-400"
          style={{ animation: 'demo-check-pop 0.5s ease-out 0.8s both' }}
        >
          Copied!
        </span>
      </div>
      {/* Stats */}
      <div
        className="flex items-center gap-6 text-xs text-zinc-500 dark:text-zinc-400"
        style={{ animation: 'demo-slide-up 0.4s ease-out 0.4s both' }}
      >
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
          128 views
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-yellow-400" />
          Password protected
        </span>
      </div>
    </div>
  );
}

function DemoJdMatch() {
  return (
    <div className="flex h-full items-center justify-center gap-8 p-6">
      {/* Score ring */}
      <div className="relative">
        <svg width="100" height="100" className="-rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6" className="text-zinc-200 dark:text-zinc-700" />
          <circle
            cx="50" cy="50" r="40" fill="none" stroke="#ec4899" strokeWidth="6"
            strokeDasharray="251" strokeDashoffset="251" strokeLinecap="round"
            style={{ animation: 'demo-ring-fill 2s ease-out 0.5s forwards' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">80%</span>
        </div>
      </div>
      {/* Suggestions */}
      <div className="flex flex-col gap-2">
        {['Add TypeScript skill', 'Quantify team size', 'Include CI/CD'].map((s, i) => (
          <div
            key={s}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800"
            style={{ animation: `demo-slide-up 0.3s ease-out ${0.8 + i * 0.2}s both` }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
            <span className="text-zinc-700 dark:text-zinc-300">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DemoTranslate() {
  return (
    <div className="flex h-full items-center justify-center gap-3 p-6">
      {/* Chinese side */}
      <div
        className="w-36 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800"
        style={{ animation: 'demo-slide-up 0.4s ease-out both' }}
      >
        <div className="mb-2 text-[10px] font-semibold text-pink-500">ZH</div>
        <div className="space-y-1.5">
          <div className="text-xs text-zinc-700 dark:text-zinc-300">高级软件工程师</div>
          <div className="h-1 w-full rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-1 w-3/4 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </div>
      {/* Arrow */}
      <Languages className="h-5 w-5 shrink-0 text-pink-500" style={{ animation: 'demo-swap 2s ease-in-out infinite' }} />
      {/* English side */}
      <div
        className="w-36 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800"
        style={{ animation: 'demo-slide-up 0.4s ease-out 0.6s both' }}
      >
        <div className="mb-2 text-[10px] font-semibold text-blue-500">EN</div>
        <div className="space-y-1.5">
          <div className="text-xs text-zinc-700 dark:text-zinc-300">Senior Software Engineer</div>
          <div className="h-1 w-full rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-1 w-4/5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </div>
    </div>
  );
}

function DemoCoverLetter() {
  const lines = [
    { w: 'w-32', text: 'Dear Hiring Manager,' },
    { w: 'w-full', text: '' },
    { w: 'w-11/12', text: '' },
    { w: 'w-4/5', text: '' },
    { w: 'w-full', text: '' },
    { w: 'w-24', text: 'Best regards,' },
  ];
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="w-64 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4 text-pink-500" />
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Cover Letter</span>
        </div>
        <div className="space-y-2">
          {lines.map((line, i) => (
            <div key={i} style={{ animation: `demo-slide-up 0.3s ease-out ${i * 0.2}s both` }}>
              {line.text ? (
                <span className="text-[11px] text-zinc-600 dark:text-zinc-400">{line.text}</span>
              ) : (
                <div className={`h-1.5 ${line.w} rounded-full bg-zinc-200 dark:bg-zinc-700`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DemoGrammarCheck() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
      {/* Score */}
      <div
        className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 dark:border-zinc-700 dark:bg-zinc-800"
        style={{ animation: 'demo-slide-up 0.4s ease-out both' }}
      >
        <span className="text-xs text-zinc-500 dark:text-zinc-400">Writing Quality</span>
        <span className="text-sm font-bold text-green-500">92/100</span>
      </div>
      {/* Text with corrections */}
      <div
        className="w-72 space-y-2 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800"
        style={{ animation: 'demo-slide-up 0.4s ease-out 0.3s both' }}
      >
        <div className="text-xs text-zinc-700 dark:text-zinc-300">
          <span className="line-through decoration-red-400">Worked on</span>{' '}
          <span
            className="font-medium text-green-600 dark:text-green-400"
            style={{ animation: 'demo-check-pop 0.4s ease-out 1s both' }}
          >
            Spearheaded
          </span>{' '}
          the new platform
        </div>
        <div className="text-xs text-zinc-700 dark:text-zinc-300">
          <span className="line-through decoration-red-400">Did stuff with</span>{' '}
          <span
            className="font-medium text-green-600 dark:text-green-400"
            style={{ animation: 'demo-check-pop 0.4s ease-out 1.3s both' }}
          >
            Architected
          </span>{' '}
          microservices
        </div>
        <div className="text-xs text-zinc-700 dark:text-zinc-300">
          Improved performance by{' '}
          <span
            className="font-medium text-green-600 dark:text-green-400"
            style={{ animation: 'demo-check-pop 0.4s ease-out 1.6s both' }}
          >
            40%
          </span>
        </div>
      </div>
    </div>
  );
}

const DEMO_MAP: Record<string, React.FC> = {
  aiChat: DemoAiChat,
  templates: DemoTemplates,
  dragDrop: DemoDragDrop,
  export: DemoExport,
  sharing: DemoSharing,
  jdMatch: DemoJdMatch,
  translate: DemoTranslate,
  coverLetter: DemoCoverLetter,
  grammarCheck: DemoGrammarCheck,
};

/* ── Main component ── */

export function FeaturesSection() {
  const t = useTranslations('landing.features');
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % FEATURES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, AUTO_CYCLE_MS);
    return () => clearInterval(timer);
  }, [paused, next]);

  const handleTabClick = (i: number) => {
    setActive(i);
    setPaused(true);
    // Resume auto-cycle after 10s of inactivity
    setTimeout(() => setPaused(false), 10000);
  };

  const feat = FEATURES[active];
  const Demo = DEMO_MAP[feat.key];

  return (
    <section id="features" className="px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
            {t('title')}
          </h2>
          <p className="mt-4 text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
            {t('subtitle')}
          </p>
        </div>

        {/* Tab bar */}
        <div className="-mx-4 mb-10 overflow-x-auto px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
          <div className="mx-auto flex w-max items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
            {FEATURES.map(({ key, icon: Icon }, i) => (
              <button
                key={key}
                onClick={() => handleTabClick(i)}
                className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
                  i === active
                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{t(`${key}.title`)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Demo animation */}
            <div className="relative h-[280px] border-b border-zinc-100 bg-zinc-50/50 lg:h-[320px] lg:border-b-0 lg:border-r dark:border-zinc-800 dark:bg-zinc-950/50">
              <div key={active} className="h-full">
                <Demo />
              </div>
            </div>
            {/* Description */}
            <div className="flex flex-col justify-center p-8 lg:p-10">
              <div
                key={active}
                style={{ animation: 'demo-slide-up 0.4s ease-out both' }}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-500 dark:bg-pink-950/50 dark:text-pink-400">
                  {(() => { const Icon = FEATURES[active].icon; return <Icon className="h-5 w-5" />; })()}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {t(`${feat.key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {t(`${feat.key}.description`)}
                </p>
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="flex gap-1 px-6 pb-4">
            {FEATURES.map((_, i) => (
              <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className={`h-full rounded-full bg-pink-500 transition-all ${
                    i < active ? 'w-full' : i === active ? 'animate-progress' : 'w-0'
                  }`}
                  style={
                    i === active && !paused
                      ? { animation: `demo-progress ${AUTO_CYCLE_MS}ms linear forwards` }
                      : i === active && paused
                        ? { width: '100%' }
                        : undefined
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
