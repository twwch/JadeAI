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
const ACCENT = '#8b5cf6';
const ALT_BG = '#f5f3ff';

export function ZigzagTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);

  const filteredSections = resume.sections.filter(
    (s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s)
  );

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

      {/* Zigzag divider */}
      <div className="mb-6 flex items-center justify-center gap-1">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="h-1 w-3 rounded-full" style={{ backgroundColor: i % 2 === 0 ? ACCENT : `${ACCENT}40` }} />
        ))}
      </div>

      {/* Sections with alternating alignment */}
      {filteredSections.map((section, idx) => {
        const isEven = idx % 2 === 0;
        return (
          <div key={section.id} className="mb-5" data-section>
            <div className="rounded-lg p-4" style={{ backgroundColor: isEven ? 'transparent' : ALT_BG }}>
              <div className={`mb-2 flex items-center gap-2 ${isEven ? '' : 'flex-row-reverse'}`}>
                <div className="h-5 w-1 rounded-full" style={{ backgroundColor: ACCENT }} />
                <h2 className={`text-sm font-bold uppercase tracking-wider ${isEven ? '' : 'text-right'}`} style={{ color: PRIMARY }}>
                  {section.title}
                </h2>
              </div>
              <div className={isEven ? '' : 'text-right'}>
                <ZigzagSectionContent section={section} isEven={isEven} />
              </div>
            </div>
            {/* Zigzag connector between sections */}
            {idx < filteredSections.length - 1 && (
              <div className="my-2 flex items-center justify-center">
                <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
                  <path d="M0 6 L10 1 L20 6 L30 1 L40 6" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ZigzagSectionContent({ section, isEven }: { section: any; isEven: boolean }) {
  const content = section.content;

  if (section.type === 'summary') {
    return <p className="text-sm leading-relaxed text-zinc-600">{(content as SummaryContent).text}</p>;
  }

  if (section.type === 'work_experience') {
    const items = (content as WorkExperienceContent).items || [];
    return (
      <div className="space-y-3 text-left">
        {items.map((item: any) => (
          <div key={item.id}>
            <div className={`flex items-baseline justify-between ${isEven ? '' : 'flex-row-reverse'}`}>
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
      <div className="space-y-3 text-left">
        {items.map((item: any) => (
          <div key={item.id}>
            <div className={`flex items-baseline justify-between ${isEven ? '' : 'flex-row-reverse'}`}>
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
      <div className="space-y-2 text-left">
        {categories.map((cat: any) => (
          <div key={cat.id}>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">{cat.name}</p>
            <div className={`flex flex-wrap gap-1.5 ${isEven ? '' : 'justify-end'}`}>
              {(cat.skills || []).map((skill: string, i: number) => (
                <span key={i} className="rounded-full border px-2 py-0.5 text-xs font-medium" style={{ borderColor: `${ACCENT}50`, color: ACCENT, backgroundColor: `${ACCENT}08` }}>
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
      <div className="space-y-3 text-left">
        {items.map((item: any) => (
          <div key={item.id}>
            <div className={`flex items-baseline justify-between ${isEven ? '' : 'flex-row-reverse'}`}>
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
                  <span key={i} className="rounded-full px-2 py-0.5 text-[10px] text-white" style={{ backgroundColor: ACCENT }}>
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
      <div className="space-y-1.5 text-left">
        {items.map((item: any) => (
          <div key={item.id} className={`flex items-baseline justify-between ${isEven ? '' : 'flex-row-reverse'}`}>
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
      <div className={`flex flex-wrap gap-3 ${isEven ? '' : 'justify-end'}`}>
        {items.map((item: any) => (
          <div key={item.id} className="flex items-center gap-2 rounded-full px-3 py-1" style={{ backgroundColor: `${ACCENT}10`, border: `1px solid ${ACCENT}30` }}>
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
      <div className="space-y-2 text-left">
        {items.map((item: any) => (
          <div key={item.id}>
            <div className={`flex items-baseline justify-between ${isEven ? '' : 'flex-row-reverse'}`}>
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
      <div className="space-y-2 text-left">
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
