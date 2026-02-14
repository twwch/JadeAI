'use client';

import type {
  Resume,
  PersonalInfoContent,
  SummaryContent,
  WorkExperienceContent,
  EducationContent,
  SkillsContent,
  ProjectsContent,
  CertificationsContent,
  LanguagesContent,
  CustomContent,
} from '@/types/resume';
import { isSectionEmpty } from '../utils';

const PRIMARY = '#881337';
const ACCENT = '#be185d';
const ROSE_50 = '#fff1f2';
const ROSE_100 = '#ffe4e6';

export function RoseTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  return (
    <div className="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="mb-8 rounded-2xl px-8 py-6 text-center" style={{ backgroundColor: ROSE_50 }}>
        {pi.avatar && (
          <img src={pi.avatar} alt="" className="mx-auto mb-3 h-20 w-20 rounded-full border-3 object-cover" style={{ borderColor: ACCENT }} />
        )}
        <h1 className="text-2xl font-semibold tracking-wide" style={{ color: PRIMARY }}>{pi.fullName || 'Your Name'}</h1>
        {pi.jobTitle && <p className="mt-1 text-sm" style={{ color: ACCENT }}>{pi.jobTitle}</p>}
        {/* Decorative dots */}
        <div className="mt-3 flex items-center justify-center gap-1">
          <span className="h-1 w-1 rounded-full" style={{ backgroundColor: ACCENT, opacity: 0.4 }} />
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT, opacity: 0.6 }} />
          <span className="h-1 w-1 rounded-full" style={{ backgroundColor: ACCENT }} />
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT, opacity: 0.6 }} />
          <span className="h-1 w-1 rounded-full" style={{ backgroundColor: ACCENT, opacity: 0.4 }} />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs" style={{ color: ACCENT }}>
          {pi.email && <span>{pi.email}</span>}
          {pi.phone && <span>{pi.phone}</span>}
          {pi.location && <span>{pi.location}</span>}
          {pi.website && <span>{pi.website}</span>}
        </div>
      </div>

      {/* Sections */}
      {resume.sections
        .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
        .map((section) => (
          <div key={section.id} className="mb-6" data-section>
            {/* Section header with rose accent */}
            <div className="mb-3 flex items-center gap-2">
              <div className="h-0.5 w-6 rounded-full" style={{ backgroundColor: ACCENT }} />
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: PRIMARY }}>{section.title}</h2>
            </div>
            <RoseSectionContent section={section} />
          </div>
        ))}
    </div>
  );
}

function RoseSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return (
      <p className="rounded-xl px-4 py-3 text-sm italic leading-relaxed" style={{ backgroundColor: ROSE_50, color: '#57534e' }}>
        {(content as SummaryContent).text}
      </p>
    );
  }

  if (section.type === 'work_experience') {
    return (
      <div className="space-y-4">
        {((content as WorkExperienceContent).items || []).map((item: any) => (
          <div key={item.id} className="rounded-xl border p-4" style={{ borderColor: ROSE_100 }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold" style={{ color: PRIMARY }}>{item.position}</h3>
              <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: ROSE_50, color: ACCENT }}>
                {item.startDate} &ndash; {item.current ? 'Present' : item.endDate}
              </span>
            </div>
            {item.company && <p className="text-sm" style={{ color: ACCENT }}>{item.company}</p>}
            {item.description && <p className="mt-1 text-sm text-zinc-600">{item.description}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1.5 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: ACCENT }} />
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'education') {
    return (
      <div className="space-y-3">
        {((content as EducationContent).items || []).map((item: any) => (
          <div key={item.id} className="rounded-xl border p-4" style={{ borderColor: ROSE_100 }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold" style={{ color: PRIMARY }}>{item.degree}{item.field ? ` in ${item.field}` : ''}</h3>
              <span className="shrink-0 text-xs" style={{ color: ACCENT }}>{item.startDate} &ndash; {item.endDate}</span>
            </div>
            {item.institution && <p className="text-sm" style={{ color: ACCENT }}>{item.institution}</p>}
            {item.gpa && <p className="text-xs" style={{ color: '#a8a29e' }}>GPA: {item.gpa}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: ACCENT }} />
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'skills') {
    return (
      <div className="space-y-3">
        {((content as SkillsContent).categories || []).map((cat: any) => (
          <div key={cat.id}>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: PRIMARY }}>{cat.name}</p>
            <div className="flex flex-wrap gap-1.5">
              {(cat.skills || []).map((skill: string, i: number) => (
                <span
                  key={i}
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: ROSE_50, color: ACCENT }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'projects') {
    return (
      <div className="space-y-3">
        {((content as ProjectsContent).items || []).map((item: any) => (
          <div key={item.id} className="rounded-xl border p-4" style={{ borderColor: ROSE_100 }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold" style={{ color: PRIMARY }}>{item.name}</h3>
              {item.startDate && (
                <span className="shrink-0 text-xs" style={{ color: ACCENT }}>{item.startDate}{item.endDate ? ` \u2013 ${item.endDate}` : ''}</span>
              )}
            </div>
            {item.description && <p className="mt-0.5 text-sm text-zinc-600">{item.description}</p>}
            {item.technologies?.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {item.technologies.map((t: string, i: number) => (
                  <span key={i} className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: ACCENT }}>{t}</span>
                ))}
              </div>
            )}
            {item.highlights?.length > 0 && (
              <ul className="mt-1.5 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: ACCENT }} />
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'certifications') {
    return (
      <div className="flex flex-wrap gap-2">
        {((content as CertificationsContent).items || []).map((item: any) => (
          <div key={item.id} className="rounded-xl border px-4 py-2" style={{ borderColor: ROSE_100 }}>
            <p className="text-sm font-semibold" style={{ color: PRIMARY }}>{item.name}</p>
            <p className="text-xs" style={{ color: ACCENT }}>{item.issuer}{item.date ? ` | ${item.date}` : ''}</p>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'languages') {
    return (
      <div className="flex flex-wrap gap-2">
        {((content as LanguagesContent).items || []).map((item: any) => (
          <div key={item.id} className="flex items-center gap-2 rounded-full px-4 py-1.5" style={{ backgroundColor: ROSE_50 }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
            <span className="text-sm font-medium" style={{ color: PRIMARY }}>{item.language}</span>
            <span className="text-xs" style={{ color: ACCENT }}>{item.proficiency}</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'custom') {
    return (
      <div className="space-y-3">
        {((content as CustomContent).items || []).map((item: any) => (
          <div key={item.id} className="rounded-xl border p-4" style={{ borderColor: ROSE_100 }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold" style={{ color: PRIMARY }}>{item.title}</h3>
              {item.date && <span className="shrink-0 text-xs" style={{ color: ACCENT }}>{item.date}</span>}
            </div>
            {item.subtitle && <p className="text-sm" style={{ color: ACCENT }}>{item.subtitle}</p>}
            {item.description && <p className="mt-0.5 text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  // Generic items fallback
  if (content.items) {
    return (
      <div className="space-y-2">
        {content.items.map((item: any) => (
          <div key={item.id} className="rounded-xl border p-3" style={{ borderColor: ROSE_100 }}>
            <span className="text-sm font-medium" style={{ color: PRIMARY }}>{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
