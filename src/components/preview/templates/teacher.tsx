'use client';

import type { Resume, PersonalInfoContent, SummaryContent, WorkExperienceContent, EducationContent, SkillsContent, ProjectsContent, CertificationsContent, LanguagesContent, CustomContent } from '@/types/resume';
import { isSectionEmpty } from '../utils';

const PRIMARY = '#9a3412';
const ACCENT = '#ea580c';
const WARM_BG = '#fff7ed';
const BODY_TEXT = '#374151';
const MUTED = '#78716c';

export function TeacherTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  return (
    <div className="mx-auto max-w-[210mm] bg-white p-10 shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="mb-6 flex items-center gap-5">
        {pi.avatar && (
          <img src={pi.avatar} alt="" className="h-18 w-18 shrink-0 rounded-full object-cover" style={{ border: `3px solid ${ACCENT}` }} />
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold" style={{ color: PRIMARY }}>
            {pi.fullName || 'Your Name'}
          </h1>
          {pi.jobTitle && (
            <p className="mt-1 inline-block rounded-full px-3 py-0.5 text-sm font-medium text-white" style={{ backgroundColor: ACCENT }}>
              {pi.jobTitle}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-3 text-xs" style={{ color: MUTED }}>
            {pi.email && <span>{pi.email}</span>}
            {pi.phone && <span>{pi.phone}</span>}
            {pi.location && <span>{pi.location}</span>}
            {pi.website && <span>{pi.website}</span>}
          </div>
        </div>
      </div>

      {/* Warm divider */}
      <div className="mb-6 h-0.5 w-full rounded-full" style={{ backgroundColor: ACCENT, opacity: 0.3 }} />

      {/* Sections */}
      {resume.sections
        .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
        .map((section) => (
          <div key={section.id} className="mb-6" data-section>
            <h2
              className="mb-3 inline-block rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: PRIMARY }}
            >
              {section.title}
            </h2>
            <TeacherSectionContent section={section} />
          </div>
        ))}
    </div>
  );
}

function TeacherSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return (
      <p className="rounded-lg p-3 text-sm leading-relaxed" style={{ color: BODY_TEXT, backgroundColor: WARM_BG }}>
        {(content as SummaryContent).text}
      </p>
    );
  }

  if (section.type === 'work_experience') {
    return (
      <div className="space-y-4">
        {((content as WorkExperienceContent).items || []).map((item: any) => (
          <div key={item.id} className="rounded-lg border-l-3 p-3" style={{ borderColor: ACCENT, backgroundColor: WARM_BG }}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold" style={{ color: PRIMARY }}>{item.position}</span>
                {item.company && <span className="text-sm" style={{ color: ACCENT }}> at {item.company}</span>}
              </div>
              <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: '#fed7aa', color: PRIMARY }}>
                {item.startDate} - {item.current ? 'Present' : item.endDate}
              </span>
            </div>
            {item.description && <p className="mt-1 text-sm" style={{ color: BODY_TEXT }}>{item.description}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1.5 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: BODY_TEXT }}>
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
          <div key={item.id} className="rounded-lg border-l-3 p-3" style={{ borderColor: ACCENT, backgroundColor: WARM_BG }}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold" style={{ color: PRIMARY }}>
                  {item.degree}{item.field ? ` in ${item.field}` : ''}
                </span>
                {item.institution && <span className="text-sm" style={{ color: MUTED }}> — {item.institution}</span>}
              </div>
              <span className="shrink-0 text-xs" style={{ color: MUTED }}>
                {item.startDate} - {item.endDate}
              </span>
            </div>
            {item.gpa && <p className="text-xs" style={{ color: MUTED }}>GPA: {item.gpa}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: BODY_TEXT }}>
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
      <div className="flex flex-wrap gap-2">
        {((content as SkillsContent).categories || []).map((cat: any) => (
          <div key={cat.id} className="rounded-lg p-2.5" style={{ backgroundColor: WARM_BG }}>
            <span className="text-xs font-bold" style={{ color: PRIMARY }}>{cat.name}</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {(cat.skills || []).map((skill: string, i: number) => (
                <span key={i} className="rounded-full px-2 py-0.5 text-[10px]" style={{ backgroundColor: '#fed7aa', color: PRIMARY }}>
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
          <div key={item.id} className="rounded-lg border-l-3 p-3" style={{ borderColor: ACCENT, backgroundColor: WARM_BG }}>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-bold" style={{ color: PRIMARY }}>{item.name}</span>
              {item.startDate && (
                <span className="shrink-0 text-xs" style={{ color: MUTED }}>
                  {item.startDate}{item.endDate ? ` - ${item.endDate}` : ''}
                </span>
              )}
            </div>
            {item.description && <p className="mt-1 text-sm" style={{ color: BODY_TEXT }}>{item.description}</p>}
            {item.technologies?.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {item.technologies.map((t: string, i: number) => (
                  <span key={i} className="rounded-full px-2 py-0.5 text-[10px]" style={{ backgroundColor: '#fed7aa', color: PRIMARY }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
            {item.highlights?.length > 0 && (
              <ul className="mt-1.5 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: BODY_TEXT }}>
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
      <div className="space-y-1.5">
        {((content as CertificationsContent).items || []).map((item: any) => (
          <div key={item.id} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: ACCENT }} />
            <span className="text-sm font-medium" style={{ color: PRIMARY }}>{item.name}</span>
            <span className="text-sm" style={{ color: MUTED }}> — {item.issuer} ({item.date})</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'languages') {
    return (
      <div className="flex flex-wrap gap-2">
        {((content as LanguagesContent).items || []).map((item: any) => (
          <div key={item.id} className="rounded-full px-3 py-1 text-sm" style={{ backgroundColor: WARM_BG }}>
            <span className="font-medium" style={{ color: PRIMARY }}>{item.language}</span>
            <span style={{ color: MUTED }}> — {item.proficiency}</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'custom') {
    return (
      <div className="space-y-3">
        {((content as CustomContent).items || []).map((item: any) => (
          <div key={item.id} className="rounded-lg border-l-3 p-3" style={{ borderColor: ACCENT, backgroundColor: WARM_BG }}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold" style={{ color: PRIMARY }}>{item.title}</span>
                {item.subtitle && <span className="text-sm" style={{ color: MUTED }}> — {item.subtitle}</span>}
              </div>
              {item.date && <span className="shrink-0 text-xs" style={{ color: MUTED }}>{item.date}</span>}
            </div>
            {item.description && <p className="mt-1 text-sm" style={{ color: BODY_TEXT }}>{item.description}</p>}
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
          <div key={item.id} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: ACCENT }} />
            <span className="text-sm font-medium" style={{ color: PRIMARY }}>{item.name || item.title || item.language}</span>
            {item.description && <span className="text-sm" style={{ color: BODY_TEXT }}> — {item.description}</span>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
