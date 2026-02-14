'use client';

import type { Resume, PersonalInfoContent, SummaryContent, WorkExperienceContent, EducationContent, SkillsContent, ProjectsContent, CertificationsContent, LanguagesContent, CustomContent } from '@/types/resume';
import { isSectionEmpty } from '../utils';

const SLATE_500 = '#64748b';
const SLATE_400 = '#94a3b8';
const SLATE_50 = '#f8fafc';

export function NordicTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  return (
    <div className="mx-auto max-w-[210mm] bg-white p-10 shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="mb-8 text-center">
        {pi.avatar && (
          <img src={pi.avatar} alt="" className="mx-auto mb-3 h-16 w-16 rounded-full object-cover" style={{ border: `2px solid ${SLATE_400}` }} />
        )}
        <h1 className="text-2xl font-light tracking-wide" style={{ color: SLATE_500 }}>{pi.fullName || 'Your Name'}</h1>
        {pi.jobTitle && <p className="mt-1 text-sm font-light tracking-wider" style={{ color: SLATE_400 }}>{pi.jobTitle}</p>}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs" style={{ color: SLATE_400 }}>
          {pi.email && <span>{pi.email}</span>}
          {pi.phone && <span>{pi.phone}</span>}
          {pi.location && <span>{pi.location}</span>}
          {pi.website && <span>{pi.website}</span>}
        </div>
      </div>

      {/* Thin divider */}
      <div className="mx-auto mb-8 h-px w-full" style={{ backgroundColor: SLATE_400 }} />

      {/* Sections */}
      {resume.sections
        .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
        .map((section) => (
          <div key={section.id} className="mb-7" data-section>
            <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.2em]" style={{ color: SLATE_500 }}>
              {section.title}
            </h2>
            <NordicSectionContent section={section} />
          </div>
        ))}
    </div>
  );
}

function NordicSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return <p className="text-sm font-light leading-relaxed" style={{ color: SLATE_500 }}>{(content as SummaryContent).text}</p>;
  }

  if (section.type === 'work_experience') {
    return (
      <div className="space-y-4">
        {((content as WorkExperienceContent).items || []).map((item: any) => (
          <div key={item.id} className="rounded-sm p-3" style={{ backgroundColor: SLATE_50 }}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-medium" style={{ color: SLATE_500 }}>{item.position}</span>
                {item.company && <span className="text-sm font-light" style={{ color: SLATE_400 }}> | {item.company}</span>}
              </div>
              <span className="shrink-0 text-xs font-light" style={{ color: SLATE_400 }}>{item.startDate} - {item.current ? 'Present' : item.endDate}</span>
            </div>
            {item.description && <p className="mt-1 text-sm font-light" style={{ color: SLATE_500 }}>{item.description}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1.5 list-disc pl-4">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="text-sm font-light" style={{ color: SLATE_500 }}>{h}</li>
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
          <div key={item.id} className="rounded-sm p-3" style={{ backgroundColor: SLATE_50 }}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-medium" style={{ color: SLATE_500 }}>{item.degree}{item.field ? ` in ${item.field}` : ''}</span>
                {item.institution && <span className="text-sm font-light" style={{ color: SLATE_400 }}> - {item.institution}</span>}
              </div>
              <span className="shrink-0 text-xs font-light" style={{ color: SLATE_400 }}>{item.startDate} - {item.endDate}</span>
            </div>
            {item.gpa && <p className="text-xs font-light" style={{ color: SLATE_400 }}>GPA: {item.gpa}</p>}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'skills') {
    return (
      <div className="space-y-1.5">
        {((content as SkillsContent).categories || []).map((cat: any) => (
          <div key={cat.id} className="flex text-sm">
            <span className="w-28 shrink-0 font-medium" style={{ color: SLATE_500 }}>{cat.name}:</span>
            <span className="font-light" style={{ color: SLATE_400 }}>{(cat.skills || []).join(', ')}</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'projects') {
    return (
      <div className="space-y-3">
        {((content as ProjectsContent).items || []).map((item: any) => (
          <div key={item.id} className="rounded-sm p-3" style={{ backgroundColor: SLATE_50 }}>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium" style={{ color: SLATE_500 }}>{item.name}</span>
              {item.startDate && (
                <span className="shrink-0 text-xs font-light" style={{ color: SLATE_400 }}>{item.startDate}{item.endDate ? ` - ${item.endDate}` : ''}</span>
              )}
            </div>
            {item.description && <p className="mt-1 text-sm font-light" style={{ color: SLATE_500 }}>{item.description}</p>}
            {item.technologies?.length > 0 && (
              <p className="mt-0.5 text-xs font-light" style={{ color: SLATE_400 }}>Tech: {item.technologies.join(', ')}</p>
            )}
            {item.highlights?.length > 0 && (
              <ul className="mt-1.5 list-disc pl-4">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="text-sm font-light" style={{ color: SLATE_500 }}>{h}</li>
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
          <div key={item.id}>
            <span className="text-sm font-medium" style={{ color: SLATE_500 }}>{item.name}</span>
            <span className="text-sm font-light" style={{ color: SLATE_400 }}> — {item.issuer} ({item.date})</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'languages') {
    return (
      <div className="space-y-1.5">
        {((content as LanguagesContent).items || []).map((item: any) => (
          <div key={item.id}>
            <span className="text-sm font-medium" style={{ color: SLATE_500 }}>{item.language}</span>
            <span className="text-sm font-light" style={{ color: SLATE_400 }}> — {item.proficiency}</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'custom') {
    return (
      <div className="space-y-3">
        {((content as CustomContent).items || []).map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-medium" style={{ color: SLATE_500 }}>{item.title}</span>
                {item.subtitle && <span className="text-sm font-light" style={{ color: SLATE_400 }}> — {item.subtitle}</span>}
              </div>
              {item.date && <span className="shrink-0 text-xs font-light" style={{ color: SLATE_400 }}>{item.date}</span>}
            </div>
            {item.description && <p className="mt-0.5 text-sm font-light" style={{ color: SLATE_500 }}>{item.description}</p>}
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
          <div key={item.id}>
            <span className="text-sm font-medium" style={{ color: SLATE_500 }}>{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm font-light" style={{ color: SLATE_400 }}>{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
