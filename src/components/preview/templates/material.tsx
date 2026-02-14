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

const PRIMARY = '#4f46e5';
const VIOLET = '#7c3aed';

export function MaterialTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);

  return (
    <div className="mx-auto max-w-[210mm] overflow-hidden bg-zinc-50 shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Material elevated header card */}
      <div
        className="mx-4 mt-4 rounded-2xl px-8 py-8 text-white shadow-xl"
        style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${VIOLET} 100%)` }}
      >
        <div className="flex items-center gap-6">
          {pi.avatar && (
            <div className="shrink-0 rounded-full bg-white/20 p-1 shadow-lg">
              <img src={pi.avatar} alt="" className="h-20 w-20 rounded-full object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{pi.fullName || 'Your Name'}</h1>
            {pi.jobTitle && (
              <p className="mt-1 text-base font-light text-white/80">{pi.jobTitle}</p>
            )}
            {contacts.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 text-[13px]">
                {contacts.map((c, i) => (
                  <span key={i} className="rounded-full bg-white/15 px-3 py-0.5">
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 pt-4">
        {resume.sections
          .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
          .map((section) => (
            <div key={section.id} className="mb-4" data-section>
              <div className="mb-3 rounded-xl bg-white p-5 shadow-sm">
                <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider" style={{ color: PRIMARY }}>
                  <span className="inline-block h-5 w-1 rounded-full" style={{ backgroundColor: VIOLET }} />
                  {section.title}
                </h2>
                <MaterialSectionContent section={section} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function MaterialSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return <p className="text-sm leading-relaxed text-zinc-600">{(content as SummaryContent).text}</p>;
  }

  if (section.type === 'work_experience') {
    const items = (content as WorkExperienceContent).items || [];
    return (
      <div className="space-y-4">
        {items.map((item: any) => (
          <div key={item.id} className="rounded-lg bg-zinc-50 p-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold text-zinc-800">{item.position}</h3>
              <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm" style={{ backgroundColor: PRIMARY }}>
                {item.startDate} - {item.current ? 'Present' : item.endDate}
              </span>
            </div>
            {item.company && <p className="text-sm font-medium" style={{ color: VIOLET }}>{item.company}</p>}
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
          <div key={item.id} className="rounded-lg bg-zinc-50 p-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold text-zinc-800">{item.institution}</h3>
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
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500">{cat.name}</p>
            <div className="flex flex-wrap gap-1.5">
              {(cat.skills || []).map((skill: string, i: number) => (
                <span
                  key={i}
                  className="rounded-full px-3 py-1 text-xs font-medium text-white shadow-sm"
                  style={{ backgroundColor: VIOLET }}
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
          <div key={item.id} className="rounded-lg bg-zinc-50 p-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold" style={{ color: PRIMARY }}>{item.name}</h3>
              {item.startDate && (
                <span className="text-xs text-zinc-400">
                  {item.startDate}{item.endDate ? ` - ${item.endDate}` : ''}
                </span>
              )}
            </div>
            {item.description && <p className="mt-1 text-sm text-zinc-600">{item.description}</p>}
            {item.technologies?.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {item.technologies.map((t: string, i: number) => (
                  <span key={i} className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: PRIMARY }}>
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
          <div key={item.id} className="flex items-baseline justify-between rounded-lg bg-zinc-50 px-4 py-2">
            <span className="text-sm font-semibold" style={{ color: PRIMARY }}>{item.name}</span>
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
          <div key={item.id} className="flex items-center gap-2 rounded-full px-4 py-1.5 shadow-sm" style={{ backgroundColor: `${PRIMARY}10` }}>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: VIOLET }} />
            <span className="text-sm font-medium text-zinc-700">{item.language}</span>
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
          <div key={item.id} className="rounded-lg bg-zinc-50 p-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold" style={{ color: PRIMARY }}>{item.title}</h3>
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
          <div key={item.id} className="rounded-lg bg-zinc-50 p-3">
            <span className="text-sm font-medium" style={{ color: PRIMARY }}>{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
