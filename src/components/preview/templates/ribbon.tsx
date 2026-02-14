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

const PRIMARY = '#1e293b';
const ACCENT = '#b91c1c';
const RIBBON = '#dc2626';

export function RibbonTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);

  return (
    <div className="mx-auto max-w-[210mm] overflow-hidden bg-white shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Ribbon Header */}
      <div className="relative px-8 py-8 text-white" style={{ backgroundColor: RIBBON }}>
        {/* Decorative ribbon fold */}
        <div className="absolute bottom-0 left-0 h-0 w-0" style={{ borderLeft: '20px solid transparent', borderTop: `12px solid ${ACCENT}` }} />
        <div className="absolute bottom-0 right-0 h-0 w-0" style={{ borderRight: '20px solid transparent', borderTop: `12px solid ${ACCENT}` }} />

        <div className="flex items-center gap-5">
          {pi.avatar && (
            <div className="shrink-0 rounded-full border-3 border-white/40 p-0.5">
              <img src={pi.avatar} alt="" className="h-20 w-20 rounded-full object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{pi.fullName || 'Your Name'}</h1>
            {pi.jobTitle && <p className="mt-1 text-sm font-light text-red-100">{pi.jobTitle}</p>}
            {contacts.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-red-100/80">
                {contacts.map((c, i) => (
                  <span key={i}>{c}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-8">
        {resume.sections
          .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
          .map((section) => (
            <div key={section.id} className="mb-5" data-section>
              {/* Ribbon tab section header */}
              <div className="relative mb-3 flex items-center">
                <div className="relative z-10 rounded-r-md px-4 py-1 text-white" style={{ backgroundColor: RIBBON }}>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-white">{section.title}</h2>
                </div>
                {/* Triangle tab end */}
                <div className="h-0 w-0" style={{ borderTop: '13px solid transparent', borderBottom: '13px solid transparent', borderLeft: `8px solid ${RIBBON}` }} />
                <div className="ml-2 h-px flex-1" style={{ backgroundColor: '#e5e7eb' }} />
              </div>
              <RibbonSectionContent section={section} />
            </div>
          ))}
      </div>
    </div>
  );
}

function RibbonSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return <p className="text-sm leading-relaxed text-zinc-600">{(content as SummaryContent).text}</p>;
  }

  if (section.type === 'work_experience') {
    const items = (content as WorkExperienceContent).items || [];
    return (
      <div className="space-y-3">
        {items.map((item: any) => (
          <div key={item.id} className="border-l-2 pl-3" style={{ borderColor: RIBBON }}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-semibold" style={{ color: PRIMARY }}>{item.position}</span>
                {item.company && <span className="text-sm" style={{ color: ACCENT }}> | {item.company}</span>}
              </div>
              <span className="shrink-0 text-xs text-zinc-400">{item.startDate} – {item.current ? 'Present' : item.endDate}</span>
            </div>
            {item.description && <p className="mt-1 text-sm text-zinc-600">{item.description}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 list-disc pl-4">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="text-sm text-zinc-600">{h}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'education') {
    const items = (content as EducationContent).items || [];
    return (
      <div className="space-y-3">
        {items.map((item: any) => (
          <div key={item.id} className="border-l-2 pl-3" style={{ borderColor: RIBBON }}>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold" style={{ color: PRIMARY }}>{item.institution}</span>
              <span className="shrink-0 text-xs text-zinc-400">{item.startDate} – {item.endDate}</span>
            </div>
            <p className="text-sm text-zinc-600">{item.degree}{item.field ? ` in ${item.field}` : ''}</p>
            {item.gpa && <p className="text-xs text-zinc-500">GPA: {item.gpa}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 list-disc pl-4">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="text-sm text-zinc-600">{h}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'skills') {
    const categories = (content as SkillsContent).categories || [];
    return (
      <div className="space-y-2">
        {categories.map((cat: any) => (
          <div key={cat.id}>
            <p className="mb-1 text-xs font-semibold text-zinc-500">{cat.name}</p>
            <div className="flex flex-wrap gap-1.5">
              {(cat.skills || []).map((skill: string, i: number) => (
                <span key={i} className="rounded-sm border px-2 py-0.5 text-xs" style={{ borderColor: `${RIBBON}40`, color: ACCENT }}>
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
    const items = (content as ProjectsContent).items || [];
    return (
      <div className="space-y-3">
        {items.map((item: any) => (
          <div key={item.id} className="border-l-2 pl-3" style={{ borderColor: RIBBON }}>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold" style={{ color: ACCENT }}>{item.name}</span>
              {item.startDate && (
                <span className="shrink-0 text-xs text-zinc-400">
                  {item.startDate}{item.endDate ? ` – ${item.endDate}` : ''}
                </span>
              )}
            </div>
            {item.description && <p className="mt-1 text-sm text-zinc-600">{item.description}</p>}
            {item.technologies?.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {item.technologies.map((t: string, i: number) => (
                  <span key={i} className="rounded-sm bg-red-50 px-1.5 py-0.5 text-[10px]" style={{ color: ACCENT }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 list-disc pl-4">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="text-sm text-zinc-600">{h}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'certifications') {
    const items = (content as CertificationsContent).items || [];
    return (
      <div className="space-y-1.5">
        {items.map((item: any) => (
          <div key={item.id} className="flex items-baseline justify-between">
            <div>
              <span className="text-sm font-semibold" style={{ color: PRIMARY }}>{item.name}</span>
              {item.issuer && <span className="text-sm text-zinc-600"> — {item.issuer}</span>}
            </div>
            {item.date && <span className="text-xs text-zinc-400">{item.date}</span>}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'languages') {
    const items = (content as LanguagesContent).items || [];
    return (
      <div className="flex flex-wrap gap-3">
        {items.map((item: any) => (
          <span key={item.id} className="text-sm">
            <span className="font-medium" style={{ color: PRIMARY }}>{item.language}</span>
            <span className="text-zinc-500"> — {item.proficiency}</span>
          </span>
        ))}
      </div>
    );
  }

  if (section.type === 'custom') {
    const items = (content as CustomContent).items || [];
    return (
      <div className="space-y-2">
        {items.map((item: any) => (
          <div key={item.id} className="border-l-2 pl-3" style={{ borderColor: RIBBON }}>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold" style={{ color: PRIMARY }}>{item.title}</span>
              {item.date && <span className="text-xs text-zinc-400">{item.date}</span>}
            </div>
            {item.subtitle && <p className="text-sm text-zinc-500">{item.subtitle}</p>}
            {item.description && <p className="mt-1 text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  // Generic fallback
  if (content.items) {
    return (
      <div className="space-y-2">
        {content.items.map((item: any) => (
          <div key={item.id}>
            <span className="text-sm font-medium" style={{ color: PRIMARY }}>{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
