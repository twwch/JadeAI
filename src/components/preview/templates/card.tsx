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

const PRIMARY = '#18181b';
const ACCENT = '#6366f1';
const CARD_BG = '#fafafa';

export function CardTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);

  return (
    <div className="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="mb-6 text-center">
        {pi.avatar && (
          <img src={pi.avatar} alt="" className="mx-auto mb-3 h-20 w-20 rounded-full object-cover" style={{ border: `3px solid ${ACCENT}` }} />
        )}
        <h1 className="text-2xl font-bold" style={{ color: PRIMARY }}>{pi.fullName || 'Your Name'}</h1>
        {pi.jobTitle && <p className="mt-1 text-sm font-medium" style={{ color: ACCENT }}>{pi.jobTitle}</p>}
        {contacts.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-500">
            {contacts.map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </div>
        )}
      </div>

      {/* Sections */}
      {resume.sections
        .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
        .map((section) => (
          <div key={section.id} className="mb-4" data-section>
            <div className="rounded-lg p-4 shadow-sm" style={{ backgroundColor: CARD_BG, border: '1px solid #e4e4e7' }}>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-5 w-1 rounded-full" style={{ backgroundColor: ACCENT }} />
                <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: PRIMARY }}>
                  {section.title}
                </h2>
              </div>
              <CardSectionContent section={section} />
            </div>
          </div>
        ))}
    </div>
  );
}

function CardSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return <p className="text-sm leading-relaxed text-zinc-600">{(content as SummaryContent).text}</p>;
  }

  if (section.type === 'work_experience') {
    const items = (content as WorkExperienceContent).items || [];
    return (
      <div className="space-y-3">
        {items.map((item: any) => (
          <div key={item.id} className="rounded-md bg-white p-3" style={{ border: '1px solid #f4f4f5' }}>
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
          <div key={item.id} className="rounded-md bg-white p-3" style={{ border: '1px solid #f4f4f5' }}>
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
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">{cat.name}</p>
            <div className="flex flex-wrap gap-1.5">
              {(cat.skills || []).map((skill: string, i: number) => (
                <span key={i} className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: ACCENT }}>
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
          <div key={item.id} className="rounded-md bg-white p-3" style={{ border: '1px solid #f4f4f5' }}>
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
                  <span key={i} className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600">
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
      <div className="space-y-2">
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
          <div key={item.id} className="flex items-center gap-2 rounded-full bg-white px-3 py-1" style={{ border: '1px solid #e4e4e7' }}>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ACCENT }} />
            <span className="text-sm font-medium" style={{ color: PRIMARY }}>{item.language}</span>
            <span className="text-xs text-zinc-400">{item.proficiency}</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'custom') {
    const items = (content as CustomContent).items || [];
    return (
      <div className="space-y-2">
        {items.map((item: any) => (
          <div key={item.id} className="rounded-md bg-white p-3" style={{ border: '1px solid #f4f4f5' }}>
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
          <div key={item.id} className="rounded-md bg-white p-3" style={{ border: '1px solid #f4f4f5' }}>
            <span className="text-sm font-medium" style={{ color: PRIMARY }}>{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
