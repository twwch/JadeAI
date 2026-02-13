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

export function AtsTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);

  return (
    <div className="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Header — plain, no graphics */}
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold text-black">{pi.fullName || 'Your Name'}</h1>
        {pi.jobTitle && <p className="mt-0.5 text-base text-zinc-700">{pi.jobTitle}</p>}
        {contacts.length > 0 && (
          <p className="mt-1 text-sm text-zinc-600">
            {contacts.join(' | ')}
          </p>
        )}
      </div>

      <hr className="mb-4 border-black" />

      {/* Sections */}
      {resume.sections
        .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
        .map((section) => (
          <div key={section.id} className="mb-4" data-section>
            <h2 className="mb-1.5 border-b border-black pb-0.5 text-base font-bold uppercase text-black">
              {section.title}
            </h2>
            <AtsSectionContent section={section} />
          </div>
        ))}
    </div>
  );
}

function AtsSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return <p className="text-sm leading-relaxed text-zinc-700">{(content as SummaryContent).text}</p>;
  }

  if (section.type === 'work_experience') {
    const items = (content as WorkExperienceContent).items || [];
    return (
      <div className="space-y-3">
        {items.map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold text-black">{item.position}</span>
                {item.company && <span className="text-sm text-zinc-700">, {item.company}</span>}
                {item.location && <span className="text-sm text-zinc-500">, {item.location}</span>}
              </div>
              <span className="shrink-0 text-sm text-zinc-600">{item.startDate} - {item.current ? 'Present' : item.endDate}</span>
            </div>
            {item.description && <p className="mt-0.5 text-sm text-zinc-700">{item.description}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 list-disc pl-5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="text-sm text-zinc-700">{h}</li>
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
      <div className="space-y-2">
        {items.map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold text-black">{item.degree}{item.field ? ` in ${item.field}` : ''}</span>
                {item.institution && <span className="text-sm text-zinc-700">, {item.institution}</span>}
                {item.location && <span className="text-sm text-zinc-500">, {item.location}</span>}
              </div>
              <span className="shrink-0 text-sm text-zinc-600">{item.startDate} - {item.endDate}</span>
            </div>
            {item.gpa && <p className="text-sm text-zinc-600">GPA: {item.gpa}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 list-disc pl-5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="text-sm text-zinc-700">{h}</li>
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
      <div className="space-y-1">
        {categories.map((cat: any) => (
          <p key={cat.id} className="text-sm text-zinc-700">
            <span className="font-bold text-black">{cat.name}: </span>
            {cat.skills?.join(', ')}
          </p>
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
              <span className="text-sm font-bold text-black">{item.name}</span>
              {item.startDate && (
                <span className="shrink-0 text-sm text-zinc-600">
                  {item.startDate}{item.endDate ? ` - ${item.endDate}` : ''}
                </span>
              )}
            </div>
            {item.description && <p className="mt-0.5 text-sm text-zinc-700">{item.description}</p>}
            {item.technologies?.length > 0 && (
              <p className="text-sm text-zinc-600">Technologies: {item.technologies.join(', ')}</p>
            )}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 list-disc pl-5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="text-sm text-zinc-700">{h}</li>
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
          <p key={item.id} className="text-sm text-zinc-700">
            <span className="font-bold text-black">{item.name}</span>
            {item.issuer && <span> - {item.issuer}</span>}
            {item.date && <span> ({item.date})</span>}
          </p>
        ))}
      </div>
    );
  }

  if (section.type === 'languages') {
    const items = (content as LanguagesContent).items || [];
    return (
      <p className="text-sm text-zinc-700">
        {items.map((item: any, i: number) => (
          <span key={item.id}>
            {item.language} ({item.proficiency}){i < items.length - 1 ? ', ' : ''}
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
                <span className="text-sm font-bold text-black">{item.title}</span>
                {item.subtitle && <span className="text-sm text-zinc-600"> - {item.subtitle}</span>}
              </div>
              {item.date && <span className="shrink-0 text-sm text-zinc-600">{item.date}</span>}
            </div>
            {item.description && <p className="mt-0.5 text-sm text-zinc-700">{item.description}</p>}
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
            <span className="text-sm font-bold text-black">{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-700">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
