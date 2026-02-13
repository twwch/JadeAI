'use client';

import type { Resume, PersonalInfoContent, SummaryContent, WorkExperienceContent, EducationContent, SkillsContent } from '@/types/resume';
import { isSectionEmpty } from '../utils';

export function ClassicTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  return (
    <div className="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="mb-6 border-b-2 border-zinc-800 pb-4">
        <div className="flex items-center justify-center gap-4">
          {pi.avatar && (
            <img src={pi.avatar} alt="" className="h-16 w-16 shrink-0 rounded-full object-cover" />
          )}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-zinc-900">{pi.fullName || 'Your Name'}</h1>
            {pi.jobTitle && <p className="mt-1 text-lg text-zinc-600">{pi.jobTitle}</p>}
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-500">
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
          <div key={section.id} className="mb-5" data-section>
            <h2 className="mb-2 border-b border-zinc-300 pb-1 text-sm font-bold uppercase tracking-wider text-zinc-800">
              {section.title}
            </h2>
            <SectionContent section={section} />
          </div>
        ))}
    </div>
  );
}

function SectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return <p className="text-sm text-zinc-600 leading-relaxed">{(content as SummaryContent).text}</p>;
  }

  if (section.type === 'work_experience') {
    const items = (content as WorkExperienceContent).items || [];
    return (
      <div className="space-y-3">
        {items.map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="font-semibold text-zinc-800 text-sm">{item.position}</span>
                {item.company && <span className="text-sm text-zinc-600"> at {item.company}</span>}
              </div>
              <span className="text-xs text-zinc-400">{item.startDate} - {item.current ? 'Present' : item.endDate}</span>
            </div>
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
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="font-semibold text-zinc-800 text-sm">{item.degree} {item.field && `in ${item.field}`}</span>
                {item.institution && <span className="text-sm text-zinc-600"> - {item.institution}</span>}
              </div>
              <span className="text-xs text-zinc-400">{item.startDate} - {item.endDate}</span>
            </div>
            {item.gpa && <p className="text-sm text-zinc-500">GPA: {item.gpa}</p>}
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
          <div key={cat.id} className="flex text-sm">
            <span className="font-medium text-zinc-700 w-28 shrink-0">{cat.name}:</span>
            <span className="text-zinc-600">{cat.skills?.join(', ')}</span>
          </div>
        ))}
      </div>
    );
  }

  // Generic items
  if (content.items) {
    return (
      <div className="space-y-2">
        {content.items.map((item: any) => (
          <div key={item.id}>
            <span className="text-sm font-medium text-zinc-700">{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
