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

const PRIMARY = '#1e1b4b';
const ACCENT = '#f43f5e';
const HIGHLIGHT = '#fbbf24';

export function ArtisticTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);

  return (
    <div className="mx-auto max-w-[210mm] overflow-hidden bg-white shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header with colored block */}
      <div className="relative px-10 py-8 text-white" style={{ background: PRIMARY }}>
        {/* Decorative shapes */}
        <div className="absolute right-6 top-4 h-24 w-24 rounded-full opacity-20" style={{ backgroundColor: ACCENT }} />
        <div className="absolute right-16 bottom-2 h-12 w-12 rounded-full opacity-30" style={{ backgroundColor: HIGHLIGHT }} />
        <div className="absolute left-0 bottom-0 h-2 w-full" style={{ background: `linear-gradient(90deg, ${ACCENT}, ${HIGHLIGHT})` }} />

        <div className="relative flex items-center gap-5">
          {pi.avatar && (
            <div className="shrink-0 rounded-full p-1" style={{ border: `3px dashed ${HIGHLIGHT}` }}>
              <img src={pi.avatar} alt="" className="h-20 w-20 rounded-full object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{pi.fullName || 'Your Name'}</h1>
            {pi.jobTitle && (
              <p className="mt-1 text-sm font-medium" style={{ color: HIGHLIGHT }}>{pi.jobTitle}</p>
            )}
            {contacts.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/70">
                {contacts.map((c, i) => (
                  <span key={i}>{c}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-8 pt-6">
        {resume.sections
          .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
          .map((section) => (
            <div key={section.id} className="mb-6" data-section>
              <div className="mb-2 flex items-center gap-2">
                <h2 className="text-sm font-extrabold uppercase tracking-widest" style={{ color: PRIMARY }}>
                  {section.title}
                </h2>
                <div className="h-0.5 flex-1" style={{ borderTop: `2px dashed ${ACCENT}40` }} />
              </div>
              <ArtisticSectionContent section={section} />
            </div>
          ))}
      </div>
    </div>
  );
}

function ArtisticSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return (
      <div className="rounded-lg p-4" style={{ border: `2px dashed ${ACCENT}30`, backgroundColor: `${PRIMARY}05` }}>
        <p className="text-sm leading-relaxed text-zinc-600 italic">
          {(content as SummaryContent).text}
        </p>
      </div>
    );
  }

  if (section.type === 'work_experience') {
    const items = (content as WorkExperienceContent).items || [];
    return (
      <div className="space-y-4">
        {items.map((item: any) => (
          <div key={item.id} className="relative rounded-lg p-4" style={{ border: `1px dashed ${ACCENT}30` }}>
            <div className="absolute -left-1.5 top-4 h-3 w-3 rounded-full" style={{ backgroundColor: ACCENT }} />
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold" style={{ color: PRIMARY }}>{item.position}</h3>
              <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white" style={{ backgroundColor: ACCENT }}>
                {item.startDate} - {item.current ? 'Present' : item.endDate}
              </span>
            </div>
            {item.company && <p className="text-sm font-medium" style={{ color: ACCENT }}>{item.company}</p>}
            {item.description && <p className="mt-1 text-sm text-zinc-600">{item.description}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1.5 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: HIGHLIGHT }} />
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
    const items = (content as EducationContent).items || [];
    return (
      <div className="space-y-3">
        {items.map((item: any) => (
          <div key={item.id} className="rounded-lg p-4" style={{ border: `1px dashed ${ACCENT}30` }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold" style={{ color: PRIMARY }}>{item.institution}</h3>
              <span className="text-xs text-zinc-400">{item.startDate} - {item.endDate}</span>
            </div>
            <p className="text-sm text-zinc-600">{item.degree}{item.field ? ` in ${item.field}` : ''}</p>
            {item.gpa && <p className="text-xs text-zinc-500">GPA: {item.gpa}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: HIGHLIGHT }} />
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
    const categories = (content as SkillsContent).categories || [];
    return (
      <div className="space-y-3">
        {categories.map((cat: any) => (
          <div key={cat.id}>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT }}>{cat.name}</p>
            <div className="flex flex-wrap gap-2">
              {(cat.skills || []).map((skill: string, i: number) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: `${PRIMARY}10`, color: PRIMARY }}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: i % 2 === 0 ? ACCENT : HIGHLIGHT }} />
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
          <div key={item.id} className="rounded-lg p-4" style={{ border: `1px dashed ${ACCENT}30` }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold" style={{ color: PRIMARY }}>{item.name}</h3>
              {item.startDate && (
                <span className="text-xs text-zinc-400">
                  {item.startDate}{item.endDate ? ` - ${item.endDate}` : ''}
                </span>
              )}
            </div>
            {item.description && <p className="mt-0.5 text-sm text-zinc-600">{item.description}</p>}
            {item.technologies?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {item.technologies.map((t: string, i: number) => (
                  <span key={i} className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: i % 2 === 0 ? ACCENT : PRIMARY }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
            {item.highlights?.length > 0 && (
              <ul className="mt-1.5 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: HIGHLIGHT }} />
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
    const items = (content as CertificationsContent).items || [];
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item: any) => (
          <div key={item.id} className="rounded-lg px-4 py-2" style={{ border: `1px dashed ${ACCENT}30`, backgroundColor: `${HIGHLIGHT}10` }}>
            <p className="text-sm font-bold" style={{ color: PRIMARY }}>{item.name}</p>
            <p className="text-xs text-zinc-500">{item.issuer}{item.date ? ` | ${item.date}` : ''}</p>
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
          <div key={item.id} className="flex items-center gap-2 rounded-full px-4 py-1.5" style={{ border: `2px dashed ${ACCENT}30` }}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ACCENT }} />
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
      <div className="space-y-3">
        {items.map((item: any) => (
          <div key={item.id} className="rounded-lg p-4" style={{ border: `1px dashed ${ACCENT}30` }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold" style={{ color: PRIMARY }}>{item.title}</h3>
              {item.date && <span className="text-xs text-zinc-400">{item.date}</span>}
            </div>
            {item.subtitle && <p className="text-sm" style={{ color: ACCENT }}>{item.subtitle}</p>}
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
          <div key={item.id} className="rounded-lg p-3" style={{ border: `1px dashed ${ACCENT}30` }}>
            <span className="text-sm font-medium" style={{ color: PRIMARY }}>{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
