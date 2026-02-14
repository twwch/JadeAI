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

const GRADIENT = 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)';
const ACCENT = '#a855f7';

export function GradientTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);

  return (
    <div className="mx-auto max-w-[210mm] overflow-hidden bg-white shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Full-bleed gradient header */}
      <div className="relative px-10 py-8 text-white" style={{ background: GRADIENT }}>
        {/* Decorative elements */}
        <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full border-4 border-white/10" />
        <div className="absolute bottom-2 right-16 h-20 w-20 rounded-full bg-white/5" />
        <div className="absolute -left-4 top-1/2 h-12 w-12 rounded-full bg-white/10" />

        <div className="relative flex items-center gap-6">
          {pi.avatar && (
            <div className="shrink-0 rounded-full p-[3px] bg-white/20">
              <img src={pi.avatar} alt="" className="h-[80px] w-[80px] rounded-full border-2 border-white/20 object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{pi.fullName || 'Your Name'}</h1>
            {pi.jobTitle && (
              <p className="mt-1.5 text-base font-light tracking-wide text-white/80">
                {pi.jobTitle}
              </p>
            )}
            {contacts.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-white/70">
                {contacts.map((item, i) => (
                  <span key={i} className="flex items-center gap-2">
                    {item}
                    {i < contacts.length - 1 && <span className="text-white/30">|</span>}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom gradient fade line */}
        <div
          className="absolute bottom-0 left-0 h-1 w-full"
          style={{ background: 'linear-gradient(90deg, #ec4899 0%, #8b5cf6 50%, transparent 100%)' }}
        />
      </div>

      {/* Body */}
      <div className="p-8 pt-6">
        {resume.sections
          .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
          .map((section) => (
            <div key={section.id} className="mb-6" data-section>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider" style={{ color: ACCENT }}>
                <span className="inline-block pb-1 border-b-2" style={{ borderImage: GRADIENT, borderImageSlice: 1 }}>
                  {section.title}
                </span>
              </h2>
              <GradientSectionContent section={section} />
            </div>
          ))}
      </div>
    </div>
  );
}

function GradientSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return <p className="text-sm leading-relaxed text-zinc-600">{(content as SummaryContent).text}</p>;
  }

  if (section.type === 'work_experience') {
    const items = (content as WorkExperienceContent).items || [];
    return (
      <div className="space-y-4">
        {items.map((item: any) => (
          <div key={item.id} className="border-l-2 pl-4" style={{ borderImage: GRADIENT, borderImageSlice: 1 }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold text-zinc-800">{item.position}</h3>
              <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white" style={{ background: GRADIENT }}>
                {item.startDate} - {item.current ? 'Present' : item.endDate}
              </span>
            </div>
            {item.company && <p className="text-sm font-medium" style={{ color: ACCENT }}>{item.company}</p>}
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
          <div key={item.id} className="border-l-2 pl-4" style={{ borderImage: GRADIENT, borderImageSlice: 1 }}>
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
                  className="rounded-full px-3 py-0.5 text-xs font-medium text-zinc-700"
                  style={{ border: '1.5px solid transparent', backgroundImage: `linear-gradient(white, white), ${GRADIENT}`, backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}
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
          <div key={item.id} className="border-l-2 pl-4" style={{ borderImage: GRADIENT, borderImageSlice: 1 }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold" style={{ color: ACCENT }}>{item.name}</h3>
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
                  <span key={i} className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ background: GRADIENT }}>
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
            <span className="text-sm font-semibold" style={{ color: ACCENT }}>{item.name}</span>
            <span className="text-xs text-zinc-500">{item.issuer}{item.date ? ` | ${item.date}` : ''}</span>
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
          <div key={item.id} className="flex items-center gap-2 rounded-full px-4 py-1.5" style={{ border: '1.5px solid transparent', backgroundImage: `linear-gradient(white, white), ${GRADIENT}`, backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}>
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
          <div key={item.id} className="border-l-2 pl-4" style={{ borderImage: GRADIENT, borderImageSlice: 1 }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold" style={{ color: ACCENT }}>{item.title}</h3>
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
          <div key={item.id} className="border-l-2 pl-4" style={{ borderImage: GRADIENT, borderImageSlice: 1 }}>
            <span className="text-sm font-medium" style={{ color: ACCENT }}>{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
