'use client';

import type { Resume, PersonalInfoContent, SummaryContent, WorkExperienceContent, EducationContent, SkillsContent } from '@/types/resume';
import { isSectionEmpty } from '../utils';

const CHARCOAL = '#2d3436';
const EMERALD = '#00b894';

export function ExecutiveTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  return (
    <div className="mx-auto max-w-[210mm] bg-white shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="px-8 py-8" style={{ background: CHARCOAL }}>
        <div className="flex items-center gap-6">
          {pi.avatar && (
            <img src={pi.avatar} alt="" className="h-20 w-20 shrink-0 rounded-lg border-2 object-cover" style={{ borderColor: EMERALD }} />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">{pi.fullName || 'Your Name'}</h1>
            {pi.jobTitle && <p className="mt-1 text-base font-light" style={{ color: EMERALD }}>{pi.jobTitle}</p>}
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-zinc-400">
              {pi.email && <span>{pi.email}</span>}
              {pi.phone && <span>{pi.phone}</span>}
              {pi.location && <span>{pi.location}</span>}
              {pi.website && <span>{pi.website}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {resume.sections
          .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
          .map((section) => (
            <div key={section.id} className="mb-6" data-section>
              <h2 className="mb-3 border-b-2 pb-1 text-sm font-bold uppercase tracking-wider" style={{ color: CHARCOAL, borderColor: EMERALD }}>
                {section.title}
              </h2>
              <ExecutiveSectionContent section={section} />
            </div>
          ))}
      </div>
    </div>
  );
}

function ExecutiveSectionContent({ section }: { section: any }) {
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
                <span className="text-sm font-bold" style={{ color: CHARCOAL }}>{item.position}</span>
                {item.company && <span className="text-sm text-zinc-600"> | {item.company}</span>}
              </div>
              <span className="shrink-0 rounded px-2 py-0.5 text-xs font-medium text-white" style={{ background: EMERALD }}>
                {item.startDate} – {item.current ? 'Present' : item.endDate}
              </span>
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
                <span className="text-sm font-bold" style={{ color: CHARCOAL }}>{item.degree}{item.field ? ` in ${item.field}` : ''}</span>
                {item.institution && <span className="text-sm text-zinc-600"> — {item.institution}</span>}
              </div>
              <span className="shrink-0 text-xs text-zinc-400">{item.startDate} – {item.endDate}</span>
            </div>
            {item.gpa && <p className="text-sm text-zinc-500">GPA: {item.gpa}</p>}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'skills') {
    return (
      <div className="flex flex-wrap gap-2">
        {(content.categories || []).flatMap((cat: any) =>
          (cat.skills || []).map((skill: string, i: number) => (
            <span key={`${cat.id}-${i}`} className="rounded border px-2.5 py-1 text-xs font-medium" style={{ borderColor: EMERALD, color: CHARCOAL }}>
              {skill}
            </span>
          ))
        )}
      </div>
    );
  }

  if (content.items) {
    return (
      <div className="space-y-2">
        {content.items.map((item: any) => (
          <div key={item.id}>
            <span className="text-sm font-medium" style={{ color: CHARCOAL }}>{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
