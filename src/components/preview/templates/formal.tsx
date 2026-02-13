'use client';

import type { Resume, PersonalInfoContent, SummaryContent, WorkExperienceContent, EducationContent, SkillsContent } from '@/types/resume';
import { isSectionEmpty } from '../utils';

const DARK_GREEN = '#004d40';

export function FormalTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  return (
    <div className="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      {/* Header */}
      <div className="mb-6 border-b-2 pb-4" style={{ borderColor: DARK_GREEN }}>
        <div className="flex items-center justify-center gap-4">
          {pi.avatar && (
            <img src={pi.avatar} alt="" className="h-16 w-16 shrink-0 rounded-full border-2 object-cover" style={{ borderColor: DARK_GREEN }} />
          )}
          <div className="text-center">
            <h1 className="text-2xl font-bold" style={{ color: DARK_GREEN }}>{pi.fullName || 'Your Name'}</h1>
            {pi.jobTitle && <p className="mt-0.5 text-base text-zinc-500">{pi.jobTitle}</p>}
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
            <div className="mb-2 flex items-center gap-2">
              <h2 className="shrink-0 text-sm font-bold uppercase tracking-wider" style={{ color: DARK_GREEN }}>{section.title}</h2>
              <div className="h-px flex-1 bg-zinc-200" />
            </div>
            <FormalSectionContent section={section} />
          </div>
        ))}
    </div>
  );
}

function FormalSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return <p className="text-sm leading-relaxed text-zinc-600">{(content as SummaryContent).text}</p>;
  }

  if (section.type === 'work_experience') {
    return (
      <div className="space-y-4">
        {(content.items || []).map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold" style={{ color: DARK_GREEN }}>{item.position}</span>
                {item.company && <span className="text-sm text-zinc-600">, {item.company}</span>}
                {item.location && <span className="text-sm text-zinc-400"> ({item.location})</span>}
              </div>
              <span className="shrink-0 text-xs italic text-zinc-400">{item.startDate} – {item.current ? 'Present' : item.endDate}</span>
            </div>
            {item.description && <p className="mt-1 text-sm text-zinc-600">{item.description}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 list-disc pl-5">
                {item.highlights.map((h: string, i: number) => <li key={i} className="text-sm text-zinc-600">{h}</li>)}
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
        {(content.items || []).map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold" style={{ color: DARK_GREEN }}>{item.institution}</span>
                {item.location && <span className="text-sm text-zinc-400"> ({item.location})</span>}
              </div>
              <span className="shrink-0 text-xs italic text-zinc-400">{item.startDate} – {item.endDate}</span>
            </div>
            <p className="text-sm text-zinc-600">{item.degree}{item.field ? ` in ${item.field}` : ''}</p>
            {item.gpa && <p className="text-xs text-zinc-500">GPA: {item.gpa}</p>}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'skills') {
    return (
      <div className="space-y-1">
        {(content.categories || []).map((cat: any) => (
          <div key={cat.id} className="flex text-sm">
            <span className="w-32 shrink-0 font-semibold" style={{ color: DARK_GREEN }}>{cat.name}:</span>
            <span className="text-zinc-600">{(cat.skills || []).join(', ')}</span>
          </div>
        ))}
      </div>
    );
  }

  if (content.items) {
    return (
      <div className="space-y-2">
        {content.items.map((item: any) => (
          <div key={item.id}>
            <span className="text-sm font-medium" style={{ color: DARK_GREEN }}>{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
