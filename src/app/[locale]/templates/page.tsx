'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TEMPLATES } from '@/lib/constants';
import { useResume } from '@/hooks/use-resume';
import { Link, useRouter } from '@/i18n/routing';
import { useFingerprint } from '@/hooks/use-fingerprint';
import { ResumePreview } from '@/components/preview/resume-preview';
import { TourOverlay, type TourStepConfig } from '@/components/tour/tour-overlay';
import { useTourStore, hasCompletedTour } from '@/stores/tour-store';
import type { Resume } from '@/types/resume';

const templateLabelKeys: Record<string, string> = {
  classic: 'dashboard.templateClassic',
  modern: 'dashboard.templateModern',
  minimal: 'dashboard.templateMinimal',
  professional: 'dashboard.templateProfessional',
  'two-column': 'dashboard.templateTwoColumn',
  creative: 'dashboard.templateCreative',
  ats: 'dashboard.templateAts',
  academic: 'dashboard.templateAcademic',
};

const TEMPLATES_TOUR_STEPS: TourStepConfig[] = [
  { target: 'tpl-preview', placement: 'bottom', i18nKey: 'tplPreview' },
  { target: 'tpl-use', placement: 'bottom', i18nKey: 'tplUse' },
];

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
        id: 's1',
        resumeId: 'mock',
        type: 'personal_info',
        title: 'Personal Info',
        sortOrder: 0,
        visible: true,
        content: {
          fullName: 'Alex Chen',
          jobTitle: 'Senior Software Engineer',
          email: 'alex@example.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          website: 'https://alexchen.dev',
          linkedin: 'linkedin.com/in/alexchen',
          github: 'github.com/alexchen',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 's2',
        resumeId: 'mock',
        type: 'summary',
        title: 'Summary',
        sortOrder: 1,
        visible: true,
        content: {
          text: 'Full-stack engineer with 8+ years of experience building scalable web applications. Passionate about clean architecture, developer experience, and mentoring teams.',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 's3',
        resumeId: 'mock',
        type: 'work_experience',
        title: 'Work Experience',
        sortOrder: 2,
        visible: true,
        content: {
          items: [
            {
              id: 'w1',
              company: 'TechCorp Inc.',
              position: 'Senior Software Engineer',
              location: 'San Francisco, CA',
              startDate: '2021-03',
              endDate: null,
              current: true,
              description: 'Led a team of 6 engineers building the next-gen analytics platform.',
              highlights: [
                'Reduced page load time by 40% through code splitting and lazy loading',
                'Designed microservices architecture serving 2M+ daily active users',
              ],
            },
            {
              id: 'w2',
              company: 'StartupXYZ',
              position: 'Software Engineer',
              location: 'Remote',
              startDate: '2018-06',
              endDate: '2021-02',
              current: false,
              description: 'Built core product features from 0 to 1.',
              highlights: [
                'Implemented real-time collaboration features using WebSockets',
                'Improved CI/CD pipeline reducing deployment time by 60%',
              ],
            },
          ],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 's4',
        resumeId: 'mock',
        type: 'education',
        title: 'Education',
        sortOrder: 3,
        visible: true,
        content: {
          items: [
            {
              id: 'e1',
              institution: 'University of California, Berkeley',
              degree: 'Bachelor of Science',
              field: 'Computer Science',
              location: 'Berkeley, CA',
              startDate: '2014-09',
              endDate: '2018-05',
              gpa: '3.8',
              highlights: ['Dean\'s List', 'ACM Programming Contest Finalist'],
            },
          ],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 's5',
        resumeId: 'mock',
        type: 'skills',
        title: 'Skills',
        sortOrder: 4,
        visible: true,
        content: {
          categories: [
            { id: 'sk1', name: 'Frontend', skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'] },
            { id: 'sk2', name: 'Backend', skills: ['Node.js', 'Python', 'PostgreSQL', 'Redis'] },
            { id: 'sk3', name: 'DevOps', skills: ['Docker', 'AWS', 'CI/CD', 'Kubernetes'] },
          ],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 's6',
        resumeId: 'mock',
        type: 'projects',
        title: 'Projects',
        sortOrder: 5,
        visible: true,
        content: {
          items: [
            {
              id: 'p1',
              name: 'OpenSource CMS',
              url: 'https://github.com/alexchen/cms',
              description: 'A headless CMS built with Next.js and GraphQL.',
              technologies: ['Next.js', 'GraphQL', 'PostgreSQL'],
              highlights: ['1.2k+ GitHub stars', 'Used by 50+ companies'],
            },
          ],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 's7',
        resumeId: 'mock',
        type: 'certifications',
        title: 'Certifications',
        sortOrder: 6,
        visible: true,
        content: {
          items: [
            { id: 'c1', name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', date: '2023-05' },
          ],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 's8',
        resumeId: 'mock',
        type: 'languages',
        title: 'Languages',
        sortOrder: 7,
        visible: true,
        content: {
          items: [
            { id: 'l1', language: 'English', proficiency: 'Native' },
            { id: 'l2', language: 'Mandarin', proficiency: 'Native' },
          ],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export default function TemplatesPage() {
  const t = useTranslations();
  const router = useRouter();
  const { createResume } = useResume();
  const { fingerprint } = useFingerprint();
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [creatingTemplate, setCreatingTemplate] = useState<string | null>(null);
  const startTour = useTourStore((s) => s.startTour);

  useEffect(() => {
    if (hasCompletedTour('templates')) return;
    if (window.innerWidth < 768) return;
    const timer = setTimeout(() => startTour('templates', TEMPLATES_TOUR_STEPS.length), 800);
    return () => clearTimeout(timer);
  }, [startTour]);

  const handleUseTemplate = async (template: string) => {
    setCreatingTemplate(template);
    try {
      const resume = await createResume({ template });
      if (resume) {
        router.push(`/editor/${resume.id}`);
      }
    } finally {
      setCreatingTemplate(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-foreground">
          {t('templates.title')}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          {t('templates.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {TEMPLATES.map((template, idx) => {
          const mockResume = buildMockResume(template);
          const label = t(templateLabelKeys[template]);
          const isCreating = creatingTemplate === template;
          const isFirst = idx === 0;

          return (
            <div
              key={template}
              className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-shadow hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
            >
              {/* Template name */}
              <div className="border-b border-zinc-100 px-4 py-3 text-center dark:border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {label}
                </h3>
              </div>

              {/* Scaled preview */}
              <div className="relative h-[320px] overflow-hidden bg-zinc-50 dark:bg-zinc-950">
                <div
                  className="absolute left-1/2 top-0 origin-top"
                  style={{
                    width: '794px',
                    transform: 'translateX(-50%) scale(0.28)',
                  }}
                >
                  <ResumePreview resume={mockResume} />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 border-t border-zinc-100 px-4 py-3 dark:border-zinc-800">
                <Button
                  {...(isFirst ? { 'data-tour': 'tpl-preview' } : {})}
                  variant="outline"
                  size="sm"
                  className="flex-1 cursor-pointer gap-1.5"
                  onClick={() => setPreviewTemplate(template)}
                >
                  <Eye className="h-3.5 w-3.5" />
                  {t('templates.preview')}
                </Button>
                <Button
                  {...(isFirst ? { 'data-tour': 'tpl-use' } : {})}
                  size="sm"
                  className="flex-1 cursor-pointer gap-1.5 bg-pink-500 hover:bg-pink-600"
                  onClick={() => handleUseTemplate(template)}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      {t('templates.creating')}
                    </>
                  ) : (
                    t('templates.useTemplate')
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full-size preview dialog */}
      <Dialog
        open={!!previewTemplate}
        onOpenChange={(open) => {
          if (!open) setPreviewTemplate(null);
        }}
      >
        <DialogContent className="h-[90vh] w-[90vw] sm:max-w-[900px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {previewTemplate && t(templateLabelKeys[previewTemplate])}
            </DialogTitle>
          </DialogHeader>
          {previewTemplate && (
            <div className="mx-auto w-full max-w-[794px]">
              <ResumePreview resume={buildMockResume(previewTemplate)} />
            </div>
          )}
        </DialogContent>
      </Dialog>
      <TourOverlay tourId="templates" steps={TEMPLATES_TOUR_STEPS} />
    </div>
  );
}
