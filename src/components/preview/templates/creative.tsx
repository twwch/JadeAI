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

const GRADIENT = 'linear-gradient(135deg, #7c3aed 0%, #f97316 100%)';
const PRIMARY = '#7c3aed';

export function CreativeTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);

  return (
    <div className="mx-auto max-w-[210mm] overflow-hidden bg-white shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header with gradient */}
      <div className="relative px-8 py-10 text-white" style={{ background: GRADIENT }}>
        {/* Decorative shapes */}
        <div className="absolute right-8 top-6 h-32 w-32 rounded-full border-4 border-white/10" />
        <div className="absolute right-20 top-16 h-16 w-16 rounded-full border-2 border-white/10" />
        <div className="absolute bottom-4 left-4 h-20 w-20 rounded-full bg-white/5" />

        <div className="relative flex items-center gap-6">
          {pi.avatar && (
            <div className="shrink-0 rounded-2xl border-4 border-white/30 p-0.5">
              <img src={pi.avatar} alt="" className="h-24 w-24 rounded-xl object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{pi.fullName || 'Your Name'}</h1>
            {pi.jobTitle && (
              <p className="mt-1 text-lg font-light text-white/80">{pi.jobTitle}</p>
            )}
            {contacts.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/70">
                {contacts.map((c, i) => (
                  <span key={i} className="rounded-full bg-white/15 px-2.5 py-0.5 backdrop-blur-sm">
                    {c}
                  </span>
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
            <div key={section.id} className="mb-6" data-section>
              <div className="mb-3 flex items-center gap-3">
                <div className="h-8 w-1 rounded-full" style={{ background: GRADIENT }} />
                <h2 className="text-base font-extrabold uppercase tracking-wide" style={{ color: PRIMARY }}>
                  {section.title}
                </h2>
              </div>
              <CreativeSectionContent section={section} />
            </div>
          ))}
      </div>
    </div>
  );
}

function CreativeSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return (
      <p className="rounded-lg bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-600 italic">
        {(content as SummaryContent).text}
      </p>
    );
  }

  if (section.type === 'work_experience') {
    const items = (content as WorkExperienceContent).items || [];
    return (
      <div className="space-y-4">
        {items.map((item: any) => (
          <div key={item.id} className="relative rounded-lg border border-zinc-100 p-4 transition-colors hover:bg-zinc-50/50">
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-lg" style={{ background: GRADIENT }} />
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold text-zinc-800">{item.position}</h3>
              <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white" style={{ background: PRIMARY }}>
                {item.startDate} – {item.current ? 'Present' : item.endDate}
              </span>
            </div>
            {item.company && <p className="text-sm font-medium" style={{ color: PRIMARY }}>{item.company}</p>}
            {item.description && <p className="mt-1 text-sm text-zinc-600">{item.description}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1.5 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: GRADIENT }} />
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
          <div key={item.id} className="rounded-lg border border-zinc-100 p-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold text-zinc-800">{item.institution}</h3>
              <span className="text-xs text-zinc-400">{item.startDate} – {item.endDate}</span>
            </div>
            <p className="text-sm text-zinc-600">{item.degree}{item.field ? ` in ${item.field}` : ''}</p>
            {item.gpa && <p className="text-xs text-zinc-500">GPA: {item.gpa}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: GRADIENT }} />
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
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500">{cat.name}</p>
            <div className="space-y-1.5">
              {(cat.skills || []).map((skill: string, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-sm text-zinc-700">{skill}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        background: GRADIENT,
                        width: `${Math.max(60, 100 - i * 8)}%`,
                      }}
                    />
                  </div>
                </div>
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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item: any) => (
          <div key={item.id} className="rounded-lg border border-zinc-100 p-4">
            <h3 className="text-sm font-bold" style={{ color: PRIMARY }}>{item.name}</h3>
            {item.description && <p className="mt-1 text-sm text-zinc-600">{item.description}</p>}
            {item.technologies?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {item.technologies.map((t: string, i: number) => (
                  <span key={i} className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ background: GRADIENT }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
            {item.highlights?.length > 0 && (
              <ul className="mt-1.5 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: GRADIENT }} />
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
          <div key={item.id} className="rounded-lg border border-zinc-100 px-4 py-2">
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
          <div key={item.id} className="flex items-center gap-2 rounded-full border border-zinc-100 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: GRADIENT }} />
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
          <div key={item.id} className="rounded-lg border border-zinc-100 p-4">
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
          <div key={item.id} className="rounded-lg border border-zinc-100 p-3">
            <span className="text-sm font-medium" style={{ color: PRIMARY }}>{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
