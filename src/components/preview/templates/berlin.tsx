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

const BLUE = '#2563eb';
const YELLOW = '#eab308';
const RED_B = '#dc2626';
const TEXT = '#18181b';

export function BerlinTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);

  return (
    <div className="mx-auto max-w-[210mm] overflow-hidden bg-white shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header with geometric block */}
      <div className="relative px-10 py-8 text-white" style={{ backgroundColor: '#000000' }}>
        {/* Geometric decorations */}
        <div className="absolute right-8 top-4 h-20 w-20 rounded-full border-4" style={{ borderColor: YELLOW, opacity: 0.6 }} />
        <div className="absolute right-24 bottom-3 h-8 w-8" style={{ backgroundColor: RED_B, opacity: 0.7 }} />
        <div className="absolute right-6 bottom-6 h-12 w-3" style={{ backgroundColor: BLUE, opacity: 0.7 }} />

        <div className="relative flex items-center gap-6">
          {pi.avatar && (
            <div className="shrink-0 border-4 p-0.5" style={{ borderColor: YELLOW }}>
              <img src={pi.avatar} alt="" className="h-20 w-20 object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-extrabold uppercase tracking-tight">{pi.fullName || 'Your Name'}</h1>
            {pi.jobTitle && <p className="mt-1 text-sm font-light tracking-wider" style={{ color: YELLOW }}>{pi.jobTitle}</p>}
            {contacts.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/70">
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
              {/* Section header with geometric accent */}
              <div className="mb-3 flex items-center gap-2">
                <div className="h-5 w-5 rounded-full" style={{ backgroundColor: BLUE }} />
                <h2 className="text-sm font-extrabold uppercase tracking-wider" style={{ color: TEXT }}>{section.title}</h2>
                <div className="ml-auto h-1 w-12" style={{ backgroundColor: YELLOW }} />
              </div>
              <BerlinSectionContent section={section} />
            </div>
          ))}
      </div>
    </div>
  );
}

function BerlinSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return (
      <div className="border-l-4 pl-4" style={{ borderColor: BLUE }}>
        <p className="text-sm leading-relaxed text-zinc-600">{(content as SummaryContent).text}</p>
      </div>
    );
  }

  if (section.type === 'work_experience') {
    return (
      <div className="space-y-4">
        {((content as WorkExperienceContent).items || []).map((item: any) => (
          <div key={item.id} className="border-l-4 pl-4" style={{ borderColor: YELLOW }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold" style={{ color: TEXT }}>{item.position}</h3>
              <span className="shrink-0 text-xs font-bold" style={{ color: BLUE }}>{item.startDate} &ndash; {item.current ? 'Present' : item.endDate}</span>
            </div>
            {item.company && <p className="text-sm font-semibold" style={{ color: BLUE }}>{item.company}</p>}
            {item.description && <p className="mt-1 text-sm text-zinc-600">{item.description}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1.5 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0" style={{ backgroundColor: RED_B }} />
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
          <div key={item.id} className="border-l-4 pl-4" style={{ borderColor: BLUE }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold" style={{ color: TEXT }}>{item.degree}{item.field ? ` in ${item.field}` : ''}</h3>
              <span className="shrink-0 text-xs" style={{ color: BLUE }}>{item.startDate} &ndash; {item.endDate}</span>
            </div>
            {item.institution && <p className="text-sm font-semibold" style={{ color: YELLOW }}>{item.institution}</p>}
            {item.gpa && <p className="text-xs text-zinc-500">GPA: {item.gpa}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0" style={{ backgroundColor: RED_B }} />
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
            <p className="mb-1 text-xs font-bold uppercase tracking-wider" style={{ color: BLUE }}>{cat.name}</p>
            <div className="flex flex-wrap gap-1.5">
              {(cat.skills || []).map((skill: string, i: number) => (
                <span
                  key={i}
                  className="border px-2.5 py-0.5 text-xs font-medium"
                  style={{ borderColor: BLUE, color: TEXT }}
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
          <div key={item.id} className="border-l-4 pl-4" style={{ borderColor: YELLOW }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold" style={{ color: BLUE }}>{item.name}</h3>
              {item.startDate && (
                <span className="shrink-0 text-xs" style={{ color: BLUE }}>{item.startDate}{item.endDate ? ` \u2013 ${item.endDate}` : ''}</span>
              )}
            </div>
            {item.description && <p className="mt-0.5 text-sm text-zinc-600">{item.description}</p>}
            {item.technologies?.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {item.technologies.map((t: string, i: number) => (
                  <span key={i} className="px-2 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: BLUE }}>{t}</span>
                ))}
              </div>
            )}
            {item.highlights?.length > 0 && (
              <ul className="mt-1.5 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0" style={{ backgroundColor: RED_B }} />
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
          <div key={item.id} className="flex items-baseline justify-between">
            <div>
              <span className="text-sm font-bold" style={{ color: TEXT }}>{item.name}</span>
              <span className="text-sm text-zinc-500"> &mdash; {item.issuer}</span>
            </div>
            {item.date && <span className="shrink-0 text-xs font-bold" style={{ color: BLUE }}>{item.date}</span>}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'languages') {
    return (
      <div className="flex flex-wrap gap-2">
        {((content as LanguagesContent).items || []).map((item: any) => (
          <div key={item.id} className="flex items-center gap-2 border px-3 py-1" style={{ borderColor: BLUE }}>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: YELLOW }} />
            <span className="text-sm font-medium" style={{ color: TEXT }}>{item.language}</span>
            <span className="text-xs text-zinc-400">{item.proficiency}</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'custom') {
    return (
      <div className="space-y-3">
        {((content as CustomContent).items || []).map((item: any) => (
          <div key={item.id} className="border-l-4 pl-4" style={{ borderColor: BLUE }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold" style={{ color: TEXT }}>{item.title}</h3>
              {item.date && <span className="shrink-0 text-xs" style={{ color: BLUE }}>{item.date}</span>}
            </div>
            {item.subtitle && <p className="text-sm font-semibold" style={{ color: YELLOW }}>{item.subtitle}</p>}
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
          <div key={item.id} className="border-l-4 pl-4" style={{ borderColor: BLUE }}>
            <span className="text-sm font-bold" style={{ color: TEXT }}>{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
