'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import { ResumePreview } from '@/components/preview/resume-preview';
import type { Resume } from '@/types/resume';

const FEATURED_TEMPLATES = [
  { id: 'modern', labelKey: 'dashboard.templateModern' },
  { id: 'creative', labelKey: 'dashboard.templateCreative' },
  { id: 'two-column', labelKey: 'dashboard.templateTwoColumn' },
  { id: 'elegant', labelKey: 'dashboard.templateElegant' },
] as const;

// Stable date to avoid SSR/client hydration mismatch
const MOCK_DATE = new Date('2025-01-01T00:00:00Z');

function buildMockResume(template: string): Resume {
  return {
    id: 'mock',
    userId: 'mock',
    title: 'Sample Resume',
    template,
    themeConfig: {
      primaryColor: '#1a1a1a',
      accentColor: '#3b82f6',
      fontFamily: 'Inter',
      fontSize: 'medium',
      lineSpacing: 1.5,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      sectionSpacing: 16,
    },
    isDefault: false,
    language: 'en',
    sections: [
      {
        id: 's1', resumeId: 'mock', type: 'personal_info', title: 'Personal Info', sortOrder: 0, visible: true,
        content: {
          fullName: 'Alex Chen', jobTitle: 'Senior Software Engineer',
          email: 'alex@example.com', phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA', website: 'https://alexchen.dev',
          linkedin: 'linkedin.com/in/alexchen', github: 'github.com/alexchen',
        },
        createdAt: MOCK_DATE, updatedAt: MOCK_DATE,
      },
      {
        id: 's2', resumeId: 'mock', type: 'summary', title: 'Summary', sortOrder: 1, visible: true,
        content: { text: 'Full-stack engineer with 8+ years of experience building scalable web applications. Passionate about clean architecture, developer experience, and mentoring teams.' },
        createdAt: MOCK_DATE, updatedAt: MOCK_DATE,
      },
      {
        id: 's3', resumeId: 'mock', type: 'work_experience', title: 'Work Experience', sortOrder: 2, visible: true,
        content: {
          items: [
            { id: 'w1', company: 'TechCorp Inc.', position: 'Senior Software Engineer', location: 'San Francisco, CA', startDate: '2021-03', endDate: null, current: true, description: 'Led a team of 6 engineers building the next-gen analytics platform.', highlights: ['Reduced page load time by 40% through code splitting and lazy loading', 'Designed microservices architecture serving 2M+ daily active users'] },
            { id: 'w2', company: 'StartupXYZ', position: 'Software Engineer', location: 'Remote', startDate: '2018-06', endDate: '2021-02', current: false, description: 'Built core product features from 0 to 1.', highlights: ['Implemented real-time collaboration features using WebSockets', 'Improved CI/CD pipeline reducing deployment time by 60%'] },
          ],
        },
        createdAt: MOCK_DATE, updatedAt: MOCK_DATE,
      },
      {
        id: 's4', resumeId: 'mock', type: 'education', title: 'Education', sortOrder: 3, visible: true,
        content: {
          items: [{ id: 'e1', institution: 'University of California, Berkeley', degree: 'Bachelor of Science', field: 'Computer Science', location: 'Berkeley, CA', startDate: '2014-09', endDate: '2018-05', gpa: '3.8', highlights: ["Dean's List", 'ACM Programming Contest Finalist'] }],
        },
        createdAt: MOCK_DATE, updatedAt: MOCK_DATE,
      },
      {
        id: 's5', resumeId: 'mock', type: 'skills', title: 'Skills', sortOrder: 4, visible: true,
        content: {
          categories: [
            { id: 'sk1', name: 'Frontend', skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'] },
            { id: 'sk2', name: 'Backend', skills: ['Node.js', 'Python', 'PostgreSQL', 'Redis'] },
            { id: 'sk3', name: 'DevOps', skills: ['Docker', 'AWS', 'CI/CD', 'Kubernetes'] },
          ],
        },
        createdAt: MOCK_DATE, updatedAt: MOCK_DATE,
      },
      {
        id: 's6', resumeId: 'mock', type: 'projects', title: 'Projects', sortOrder: 5, visible: true,
        content: {
          items: [{ id: 'p1', name: 'OpenSource CMS', url: 'https://github.com/alexchen/cms', description: 'A headless CMS built with Next.js and GraphQL.', technologies: ['Next.js', 'GraphQL', 'PostgreSQL'], highlights: ['1.2k+ GitHub stars', 'Used by 50+ companies'] }],
        },
        createdAt: MOCK_DATE, updatedAt: MOCK_DATE,
      },
    ],
    createdAt: MOCK_DATE,
    updatedAt: MOCK_DATE,
  };
}

function TemplateCard({ template, label }: { template: string; label: string }) {
  const mockResume = buildMockResume(template);

  return (
    <div className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-zinc-200/50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:shadow-zinc-900/50">
      <div className="relative h-[320px] overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        <div
          className="absolute left-1/2 top-1/2"
          style={{ width: '794px', transform: 'translate(-50%, -50%) scale(0.28)', transformOrigin: 'center center' }}
        >
          <ResumePreview resume={mockResume} />
        </div>
      </div>
      <div className="border-t border-zinc-100 px-4 py-3 dark:border-zinc-700">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {label}
        </p>
      </div>
    </div>
  );
}

export function TemplateShowcaseSection() {
  const t = useTranslations('landing.templates');
  const tGlobal = useTranslations();

  return (
    <section
      id="templates"
      className="bg-zinc-50 px-4 py-24 sm:px-6 sm:py-32 lg:px-8 dark:bg-zinc-900/50"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
            {t('title')}
          </h2>
          <p className="mt-4 text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
            {t('subtitle')}
          </p>
        </div>

        {/* Mobile horizontal scroll */}
        <div
          className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory sm:hidden [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {FEATURED_TEMPLATES.map(({ id, labelKey }) => (
            <div key={id} className="w-[280px] flex-shrink-0 snap-center">
              <TemplateCard template={id} label={tGlobal(labelKey)} />
            </div>
          ))}
        </div>

        {/* Desktop grid */}
        <div className="hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_TEMPLATES.map(({ id, labelKey }) => (
            <TemplateCard key={id} template={id} label={tGlobal(labelKey)} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 text-sm font-semibold text-pink-500 transition-colors hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300"
          >
            {t('viewAll')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
