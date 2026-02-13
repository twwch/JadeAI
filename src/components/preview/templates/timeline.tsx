'use client';

import type { Resume, PersonalInfoContent, SummaryContent, WorkExperienceContent, EducationContent, SkillsContent } from '@/types/resume';
import { isSectionEmpty } from '../utils';

const BLUE_GRAY = '#475569';
const ACCENT = '#3b82f6';

export function TimelineTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  return (
    <div className="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="mb-6 text-center">
        {pi.avatar && (
          <img src={pi.avatar} alt="" className="mx-auto mb-3 h-18 w-18 rounded-full border-2 object-cover" style={{ borderColor: ACCENT }} />
        )}
        <h1 className="text-2xl font-bold" style={{ color: BLUE_GRAY }}>{pi.fullName || 'Your Name'}</h1>
        {pi.jobTitle && <p className="mt-0.5 text-base" style={{ color: ACCENT }}>{pi.jobTitle}</p>}
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
          <div key={section.id} className="mb-6" data-section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider" style={{ color: BLUE_GRAY }}>
              {section.title}
            </h2>
            <TimelineSectionContent section={section} />
          </div>
        ))}
    </div>
  );
}

function TimelineSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return <p className="text-sm leading-relaxed text-zinc-600">{(content as SummaryContent).text}</p>;
  }

  if (section.type === 'work_experience') {
    return (
      <div className="relative border-l-2 pl-6 ml-2" style={{ borderColor: '#e2e8f0' }}>
        {(content.items || []).map((item: any, idx: number) => (
          <div key={item.id} className={`relative ${idx < (content.items || []).length - 1 ? 'pb-5' : ''}`}>
            {/* Timeline dot */}
            <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 bg-white" style={{ borderColor: ACCENT }} />
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold" style={{ color: BLUE_GRAY }}>{item.position}</span>
                {item.company && <span className="text-sm text-zinc-500"> | {item.company}</span>}
              </div>
              <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: '#eff6ff', color: ACCENT }}>
                {item.startDate} – {item.current ? 'Present' : item.endDate}
              </span>
            </div>
            {item.description && <p className="mt-1 text-sm text-zinc-600">{item.description}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 list-disc pl-4">
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
      <div className="relative border-l-2 pl-6 ml-2" style={{ borderColor: '#e2e8f0' }}>
        {(content.items || []).map((item: any, idx: number) => (
          <div key={item.id} className={`relative ${idx < (content.items || []).length - 1 ? 'pb-4' : ''}`}>
            <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 bg-white" style={{ borderColor: ACCENT }} />
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold" style={{ color: BLUE_GRAY }}>{item.degree}{item.field ? ` in ${item.field}` : ''}</span>
                {item.institution && <span className="text-sm text-zinc-500"> — {item.institution}</span>}
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
      <div className="space-y-1">
        {(content.categories || []).map((cat: any) => (
          <div key={cat.id} className="flex text-sm">
            <span className="w-28 shrink-0 font-medium" style={{ color: ACCENT }}>{cat.name}:</span>
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
            <span className="text-sm font-medium" style={{ color: BLUE_GRAY }}>{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
