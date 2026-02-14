'use client';

import type { Resume, PersonalInfoContent, SummaryContent, WorkExperienceContent, EducationContent, SkillsContent, ProjectsContent, CertificationsContent, LanguagesContent, CustomContent } from '@/types/resume';
import { isSectionEmpty } from '../utils';

const GRAY_700 = '#374151';
const BLUE_600 = '#2563eb';

export function ConsultantTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  return (
    <div className="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Top accent bar */}
      <div className="mb-6 h-1 w-full rounded" style={{ backgroundColor: BLUE_600 }} />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          {pi.avatar && (
            <img src={pi.avatar} alt="" className="h-16 w-16 shrink-0 rounded-full object-cover" style={{ border: `2px solid ${BLUE_600}` }} />
          )}
          <div>
            <h1 className="text-2xl font-bold" style={{ color: GRAY_700 }}>{pi.fullName || 'Your Name'}</h1>
            {pi.jobTitle && <p className="mt-0.5 text-sm font-medium" style={{ color: BLUE_600 }}>{pi.jobTitle}</p>}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          {pi.email && <span>{pi.email}</span>}
          {pi.phone && <span>{pi.phone}</span>}
          {pi.location && <span>{pi.location}</span>}
          {pi.website && <span>{pi.website}</span>}
        </div>
      </div>

      {/* Sections */}
      {resume.sections
        .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
        .map((section) => (
          <div key={section.id} className="mb-6" data-section>
            <h2 className="mb-3 border-l-[3px] pl-3 text-sm font-bold uppercase tracking-wider" style={{ color: GRAY_700, borderColor: BLUE_600 }}>
              {section.title}
            </h2>
            <ConsultantSectionContent section={section} />
          </div>
        ))}
    </div>
  );
}

function ConsultantSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return <p className="text-sm leading-relaxed text-gray-600">{(content as SummaryContent).text}</p>;
  }

  if (section.type === 'work_experience') {
    return (
      <div className="space-y-4">
        {((content as WorkExperienceContent).items || []).map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold" style={{ color: GRAY_700 }}>{item.position}</span>
                {item.company && <span className="text-sm text-gray-500"> | {item.company}</span>}
              </div>
              <span className="shrink-0 text-xs font-medium" style={{ color: BLUE_600 }}>{item.startDate} - {item.current ? 'Present' : item.endDate}</span>
            </div>
            {item.description && <p className="mt-1 text-sm text-gray-600">{item.description}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1.5 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: BLUE_600 }} />
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
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold" style={{ color: GRAY_700 }}>{item.degree}{item.field ? ` in ${item.field}` : ''}</span>
                {item.institution && <span className="text-sm text-gray-500"> - {item.institution}</span>}
              </div>
              <span className="shrink-0 text-xs font-medium" style={{ color: BLUE_600 }}>{item.startDate} - {item.endDate}</span>
            </div>
            {item.gpa && <p className="text-sm text-gray-500">GPA: {item.gpa}</p>}
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
            <span className="w-32 shrink-0 font-semibold" style={{ color: GRAY_700 }}>{cat.name}:</span>
            <span className="text-gray-600">{(cat.skills || []).join(', ')}</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'projects') {
    return (
      <div className="space-y-3">
        {((content as ProjectsContent).items || []).map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-bold" style={{ color: GRAY_700 }}>{item.name}</span>
              {item.startDate && (
                <span className="shrink-0 text-xs font-medium" style={{ color: BLUE_600 }}>{item.startDate}{item.endDate ? ` - ${item.endDate}` : ''}</span>
              )}
            </div>
            {item.description && <p className="mt-1 text-sm text-gray-600">{item.description}</p>}
            {item.technologies?.length > 0 && (
              <p className="mt-0.5 text-xs text-gray-400">Tech: {item.technologies.join(', ')}</p>
            )}
            {item.highlights?.length > 0 && (
              <ul className="mt-1.5 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: BLUE_600 }} />
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
          <div key={item.id}>
            <span className="text-sm font-bold" style={{ color: GRAY_700 }}>{item.name}</span>
            <span className="text-sm text-gray-500"> — {item.issuer} ({item.date})</span>
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
            <span className="text-sm font-bold" style={{ color: GRAY_700 }}>{item.language}</span>
            <span className="text-sm text-gray-500"> — {item.proficiency}</span>
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
                <span className="text-sm font-bold" style={{ color: GRAY_700 }}>{item.title}</span>
                {item.subtitle && <span className="text-sm text-gray-500"> — {item.subtitle}</span>}
              </div>
              {item.date && <span className="shrink-0 text-xs font-medium" style={{ color: BLUE_600 }}>{item.date}</span>}
            </div>
            {item.description && <p className="mt-0.5 text-sm text-gray-600">{item.description}</p>}
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
            <span className="text-sm font-medium" style={{ color: GRAY_700 }}>{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
