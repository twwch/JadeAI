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

export function AcademicTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);

  return (
    <div className="mx-auto max-w-[210mm] bg-white px-10 py-8 shadow-lg" style={{ fontFamily: '"Computer Modern", "CMU Serif", Georgia, "Times New Roman", serif' }}>
      {/* Header — LaTeX-inspired centered layout */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-zinc-900" style={{ letterSpacing: '0.02em' }}>
          {pi.fullName || 'Your Name'}
        </h1>
        {pi.jobTitle && (
          <p className="mt-0.5 text-base text-zinc-500 italic">{pi.jobTitle}</p>
        )}
        {contacts.length > 0 && (
          <p className="mt-1.5 text-xs text-zinc-500">
            {contacts.map((c, i) => (
              <span key={i}>
                {c}{i < contacts.length - 1 ? ' \u00B7 ' : ''}
              </span>
            ))}
          </p>
        )}
        <div className="mt-3 border-b-2 border-zinc-800" />
      </div>

      {/* Sections */}
      {resume.sections
        .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
        .map((section) => (
          <div key={section.id} className="mb-4" data-section>
            <h2 className="mb-1.5 text-xs font-bold uppercase tracking-[0.25em] text-zinc-800" style={{ borderBottom: '1px solid #d4d4d8', paddingBottom: '2px' }}>
              {section.title}
            </h2>
            <AcademicSectionContent section={section} />
          </div>
        ))}
    </div>
  );
}

function AcademicSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return <p className="text-sm leading-relaxed text-zinc-600 indent-8">{(content as SummaryContent).text}</p>;
  }

  if (section.type === 'work_experience') {
    const items = (content as WorkExperienceContent).items || [];
    return (
      <div className="space-y-2.5">
        {items.map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold text-zinc-800">{item.position}</span>
                {item.company && <span className="text-sm text-zinc-600">, {item.company}</span>}
                {item.location && <span className="text-sm text-zinc-400">, {item.location}</span>}
              </div>
              <span className="shrink-0 text-xs text-zinc-500">{item.startDate} – {item.current ? 'Present' : item.endDate}</span>
            </div>
            {item.description && <p className="mt-0.5 text-sm text-zinc-600">{item.description}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-0.5 list-disc pl-5">
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
      <div className="space-y-2.5">
        {items.map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold text-zinc-800">{item.degree}</span>
                {item.field && <span className="text-sm text-zinc-600"> in {item.field}</span>}
              </div>
              <span className="shrink-0 text-xs text-zinc-500">{item.startDate} – {item.endDate}</span>
            </div>
            <p className="text-sm text-zinc-600">{item.institution}{item.location ? `, ${item.location}` : ''}</p>
            {item.gpa && <p className="text-xs text-zinc-500">GPA: {item.gpa}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-0.5 list-disc pl-5">
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
      <div className="space-y-0.5">
        {categories.map((cat: any) => (
          <p key={cat.id} className="text-sm text-zinc-600">
            <span className="font-bold text-zinc-700">{cat.name}: </span>
            {cat.skills?.join(', ')}
          </p>
        ))}
      </div>
    );
  }

  if (section.type === 'projects') {
    const items = (content as ProjectsContent).items || [];
    return (
      <div className="space-y-2.5">
        {items.map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold text-zinc-800">{item.name}</span>
                {item.url && <span className="text-xs text-zinc-400 ml-1">[{item.url}]</span>}
              </div>
              {item.startDate && (
                <span className="shrink-0 text-xs text-zinc-500">
                  {item.startDate}{item.endDate ? ` – ${item.endDate}` : ''}
                </span>
              )}
            </div>
            {item.description && <p className="mt-0.5 text-sm text-zinc-600">{item.description}</p>}
            {item.technologies?.length > 0 && (
              <p className="text-xs text-zinc-500 italic">Technologies: {item.technologies.join(', ')}</p>
            )}
            {item.highlights?.length > 0 && (
              <ul className="mt-0.5 list-disc pl-5">
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
      <div className="space-y-1">
        {items.map((item: any) => (
          <p key={item.id} className="text-sm text-zinc-600">
            <span className="font-bold text-zinc-700">{item.name}</span>
            {item.issuer && <span>, {item.issuer}</span>}
            {item.date && <span className="text-zinc-500"> ({item.date})</span>}
          </p>
        ))}
      </div>
    );
  }

  if (section.type === 'languages') {
    const items = (content as LanguagesContent).items || [];
    return (
      <p className="text-sm text-zinc-600">
        {items.map((item: any, i: number) => (
          <span key={item.id}>
            <span className="font-bold text-zinc-700">{item.language}</span>
            <span> ({item.proficiency})</span>
            {i < items.length - 1 ? '; ' : ''}
          </span>
        ))}
      </p>
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
                <span className="text-sm font-bold text-zinc-800">{item.title}</span>
                {item.subtitle && <span className="text-sm text-zinc-600">, {item.subtitle}</span>}
              </div>
              {item.date && <span className="shrink-0 text-xs text-zinc-500">{item.date}</span>}
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
      <div className="space-y-1">
        {content.items.map((item: any) => (
          <div key={item.id}>
            <span className="text-sm font-bold text-zinc-700">{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
