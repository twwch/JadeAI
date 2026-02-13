'use client';

import type { Resume, PersonalInfoContent, SummaryContent, WorkExperienceContent, EducationContent, SkillsContent } from '@/types/resume';
import { isSectionEmpty } from '../utils';

const GOLD = '#d4af37';

export function ElegantTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  return (
    <div className="mx-auto max-w-[210mm] bg-white p-10 shadow-lg" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      {/* Header */}
      <div className="mb-8 text-center">
        {pi.avatar && (
          <img src={pi.avatar} alt="" className="mx-auto mb-3 h-20 w-20 rounded-full border-2 object-cover" style={{ borderColor: GOLD }} />
        )}
        <h1 className="text-3xl font-bold tracking-wide" style={{ color: '#2c2c2c' }}>{pi.fullName || 'Your Name'}</h1>
        {pi.jobTitle && <p className="mt-1 text-base tracking-widest text-zinc-500 uppercase">{pi.jobTitle}</p>}
        <div className="mx-auto mt-3 flex items-center justify-center gap-1">
          <div className="h-px flex-1 max-w-16" style={{ background: GOLD }} />
          <div className="h-2 w-2 rotate-45" style={{ background: GOLD }} />
          <div className="h-px flex-1 max-w-16" style={{ background: GOLD }} />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-500">
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
            <div className="mb-3 flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: GOLD }} />
              <h2 className="shrink-0 text-sm font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>{section.title}</h2>
              <div className="h-px flex-1" style={{ background: GOLD }} />
            </div>
            <ElegantSectionContent section={section} />
          </div>
        ))}
    </div>
  );
}

function ElegantSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return <p className="text-center text-sm leading-relaxed text-zinc-600 italic">{(content as SummaryContent).text}</p>;
  }

  if (section.type === 'work_experience') {
    return (
      <div className="space-y-4">
        {(content.items || []).map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold" style={{ color: '#2c2c2c' }}>{item.position}</span>
                {item.company && <span className="text-sm text-zinc-500"> — {item.company}</span>}
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
                <span className="text-sm font-bold" style={{ color: '#2c2c2c' }}>{item.degree}{item.field ? ` in ${item.field}` : ''}</span>
                {item.institution && <span className="text-sm text-zinc-500"> — {item.institution}</span>}
              </div>
              <span className="shrink-0 text-xs italic text-zinc-400">{item.startDate} – {item.endDate}</span>
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
            <span className="w-32 shrink-0 font-semibold" style={{ color: GOLD }}>{cat.name}:</span>
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
            <span className="text-sm font-medium" style={{ color: '#2c2c2c' }}>{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
