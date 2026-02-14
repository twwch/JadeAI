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
const AMBER = '#f59e0b';

export function MetroTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);

  return (
    <div className="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="mb-6 flex items-center gap-5">
        {pi.avatar && (
          <img src={pi.avatar} alt="" className="h-16 w-16 shrink-0 object-cover" style={{ border: `3px solid ${AMBER}` }} />
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold uppercase tracking-tight" style={{ color: PRIMARY }}>{pi.fullName || 'Your Name'}</h1>
          {pi.jobTitle && (
            <p className="mt-0.5 text-sm font-semibold" style={{ color: AMBER }}>{pi.jobTitle}</p>
          )}
          {contacts.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
              {contacts.map((c, i) => (
                <span key={i} className="px-2 py-0.5" style={{ backgroundColor: '#f8fafc', borderLeft: `2px solid ${AMBER}` }}>
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="mb-6 h-1" style={{ backgroundColor: PRIMARY }} />

      {/* Sections */}
      {resume.sections
        .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
        .map((section) => (
          <div key={section.id} className="mb-6" data-section>
            <div className="mb-3 flex items-center gap-2">
              <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: PRIMARY }}>
                {section.title}
              </div>
              <div className="h-0.5 flex-1" style={{ backgroundColor: AMBER }} />
            </div>
            <MetroSectionContent section={section} />
          </div>
        ))}
    </div>
  );
}

function MetroSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return (
      <p className="border-l-3 pl-4 text-sm leading-relaxed text-zinc-600" style={{ borderColor: AMBER }}>
        {(content as SummaryContent).text}
      </p>
    );
  }

  if (section.type === 'work_experience') {
    const items = (content as WorkExperienceContent).items || [];
    return (
      <div className="space-y-4">
        {items.map((item: any) => (
          <div key={item.id} className="border-l-3 pl-4" style={{ borderColor: AMBER }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold" style={{ color: PRIMARY }}>{item.position}</h3>
              <span className="shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase text-white" style={{ backgroundColor: PRIMARY }}>
                {item.startDate} - {item.current ? 'Present' : item.endDate}
              </span>
            </div>
            {item.company && <p className="text-sm font-semibold" style={{ color: AMBER }}>{item.company}</p>}
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
          <div key={item.id} className="border-l-3 pl-4" style={{ borderColor: AMBER }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold" style={{ color: PRIMARY }}>{item.institution}</h3>
              <span className="text-xs text-zinc-400">{item.startDate} - {item.endDate}</span>
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
      <div className="space-y-3">
        {categories.map((cat: any) => (
          <div key={cat.id}>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: PRIMARY }}>{cat.name}</p>
            <div className="flex flex-wrap gap-1.5">
              {(cat.skills || []).map((skill: string, i: number) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 text-xs font-semibold text-white"
                  style={{ backgroundColor: AMBER }}
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
    const items = (content as ProjectsContent).items || [];
    return (
      <div className="space-y-3">
        {items.map((item: any) => (
          <div key={item.id} className="border-l-3 pl-4" style={{ borderColor: AMBER }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold" style={{ color: PRIMARY }}>{item.name}</h3>
              {item.startDate && (
                <span className="text-xs text-zinc-400">
                  {item.startDate}{item.endDate ? ` - ${item.endDate}` : ''}
                </span>
              )}
            </div>
            {item.description && <p className="mt-1 text-sm text-zinc-600">{item.description}</p>}
            {item.technologies?.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {item.technologies.map((t: string, i: number) => (
                  <span key={i} className="px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: PRIMARY }}>
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
          <div key={item.id} className="flex items-baseline justify-between border-l-3 pl-4" style={{ borderColor: AMBER }}>
            <span className="text-sm font-bold" style={{ color: PRIMARY }}>{item.name}</span>
            <span className="text-xs text-zinc-500">{item.issuer}{item.date ? ` | ${item.date}` : ''}</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'languages') {
    const items = (content as LanguagesContent).items || [];
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item: any) => (
          <div key={item.id} className="flex items-center gap-2 px-3 py-1" style={{ backgroundColor: '#f8fafc', borderLeft: `3px solid ${AMBER}` }}>
            <span className="text-sm font-semibold" style={{ color: PRIMARY }}>{item.language}</span>
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
          <div key={item.id} className="border-l-3 pl-4" style={{ borderColor: AMBER }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold" style={{ color: PRIMARY }}>{item.title}</h3>
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
          <div key={item.id} className="border-l-3 pl-4" style={{ borderColor: AMBER }}>
            <span className="text-sm font-semibold" style={{ color: PRIMARY }}>{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
