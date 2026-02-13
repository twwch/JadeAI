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

export function ProfessionalTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);

  return (
    <div className="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-4">
          {pi.avatar && (
            <img src={pi.avatar} alt="" className="h-18 w-18 shrink-0 rounded-full border-2 object-cover" style={{ borderColor: '#1e3a5f' }} />
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-wide" style={{ color: '#1e3a5f' }}>
              {pi.fullName || 'Your Name'}
            </h1>
            {pi.jobTitle && (
              <p className="mt-1 text-base font-light tracking-wider text-zinc-500 uppercase">
                {pi.jobTitle}
              </p>
            )}
          </div>
        </div>
        {contacts.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-1.5 text-sm text-zinc-500">
            {contacts.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {c}
                {i < contacts.length - 1 && <span className="text-zinc-300">|</span>}
              </span>
            ))}
          </div>
        )}
        <div className="mt-4 h-[2px] w-full" style={{ background: 'linear-gradient(90deg, transparent 0%, #1e3a5f 20%, #1e3a5f 80%, transparent 100%)' }} />
      </div>

      {/* Sections */}
      {resume.sections
        .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
        .map((section) => (
          <div key={section.id} className="mb-5" data-section>
            <div className="mb-3 flex items-center gap-3">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: '#1e3a5f' }}>
                {section.title}
              </h2>
              <div className="h-[1px] flex-1 bg-zinc-200" />
            </div>
            <ProfessionalSectionContent section={section} />
          </div>
        ))}
    </div>
  );
}

function ProfessionalSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return <p className="text-sm leading-relaxed text-zinc-600" style={{ fontFamily: 'Georgia, serif' }}>{(content as SummaryContent).text}</p>;
  }

  if (section.type === 'work_experience') {
    const items = (content as WorkExperienceContent).items || [];
    return (
      <div className="space-y-4">
        {items.map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold" style={{ color: '#1e3a5f' }}>{item.position}</span>
                {item.company && <span className="text-sm text-zinc-600"> — {item.company}</span>}
                {item.location && <span className="text-sm text-zinc-400"> ({item.location})</span>}
              </div>
              <span className="shrink-0 text-xs text-zinc-400 italic">{item.startDate} – {item.current ? 'Present' : item.endDate}</span>
            </div>
            {item.description && <p className="mt-1 text-sm text-zinc-600">{item.description}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 list-disc pl-5">
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
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold" style={{ color: '#1e3a5f' }}>{item.institution}</span>
                {item.location && <span className="text-sm text-zinc-400"> ({item.location})</span>}
              </div>
              <span className="shrink-0 text-xs text-zinc-400 italic">{item.startDate} – {item.endDate}</span>
            </div>
            <p className="text-sm text-zinc-600">{item.degree}{item.field ? ` in ${item.field}` : ''}</p>
            {item.gpa && <p className="text-xs text-zinc-500">GPA: {item.gpa}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 list-disc pl-5">
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
      <div className="space-y-1.5">
        {categories.map((cat: any) => (
          <div key={cat.id} className="flex text-sm">
            <span className="w-32 shrink-0 font-semibold" style={{ color: '#1e3a5f' }}>{cat.name}:</span>
            <span className="text-zinc-600">{cat.skills?.join(', ')}</span>
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
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-bold" style={{ color: '#1e3a5f' }}>{item.name}</span>
              {item.startDate && (
                <span className="shrink-0 text-xs text-zinc-400 italic">
                  {item.startDate}{item.endDate ? ` – ${item.endDate}` : ''}
                </span>
              )}
            </div>
            {item.description && <p className="mt-1 text-sm text-zinc-600">{item.description}</p>}
            {item.technologies?.length > 0 && (
              <p className="mt-0.5 text-xs text-zinc-400">Tech: {item.technologies.join(', ')}</p>
            )}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 list-disc pl-5">
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
          <div key={item.id} className="flex items-baseline justify-between text-sm">
            <div>
              <span className="font-semibold" style={{ color: '#1e3a5f' }}>{item.name}</span>
              {item.issuer && <span className="text-zinc-600"> — {item.issuer}</span>}
            </div>
            {item.date && <span className="shrink-0 text-xs text-zinc-400 italic">{item.date}</span>}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'languages') {
    const items = (content as LanguagesContent).items || [];
    return (
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        {items.map((item: any) => (
          <span key={item.id} className="text-sm">
            <span className="font-semibold" style={{ color: '#1e3a5f' }}>{item.language}</span>
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
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-semibold" style={{ color: '#1e3a5f' }}>{item.title}</span>
                {item.subtitle && <span className="text-sm text-zinc-500"> — {item.subtitle}</span>}
              </div>
              {item.date && <span className="shrink-0 text-xs text-zinc-400 italic">{item.date}</span>}
            </div>
            {item.description && <p className="mt-0.5 text-sm text-zinc-600">{item.description}</p>}
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
            <span className="text-sm font-medium" style={{ color: '#1e3a5f' }}>{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
