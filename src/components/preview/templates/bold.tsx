'use client';

import type { Resume, PersonalInfoContent, SummaryContent, WorkExperienceContent, EducationContent, SkillsContent } from '@/types/resume';
import { isSectionEmpty } from '../utils';

export function BoldTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  return (
    <div className="mx-auto max-w-[210mm] bg-white shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header - high contrast */}
      <div className="bg-black px-8 py-8 text-white">
        <div className="flex items-center gap-5">
          {pi.avatar && (
            <img src={pi.avatar} alt="" className="h-20 w-20 shrink-0 rounded-full border-3 border-white object-cover" />
          )}
          <div>
            <h1 className="text-4xl font-black tracking-tight">{pi.fullName || 'Your Name'}</h1>
            {pi.jobTitle && <p className="mt-1 text-lg font-light text-zinc-400">{pi.jobTitle}</p>}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-400">
          {pi.email && <span>{pi.email}</span>}
          {pi.phone && <span>{pi.phone}</span>}
          {pi.location && <span>{pi.location}</span>}
          {pi.website && <span>{pi.website}</span>}
        </div>
      </div>

      <div className="p-8">
        {resume.sections
          .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
          .map((section) => (
            <div key={section.id} className="mb-6" data-section>
              <h2 className="mb-3 border-b-4 border-black pb-1 text-lg font-black uppercase tracking-wider text-black">
                {section.title}
              </h2>
              <BoldSectionContent section={section} />
            </div>
          ))}
      </div>
    </div>
  );
}

function BoldSectionContent({ section }: { section: any }) {
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
                <span className="text-base font-bold text-black">{item.position}</span>
                {item.company && <span className="text-sm text-zinc-500"> | {item.company}</span>}
              </div>
              <span className="shrink-0 bg-black px-2 py-0.5 text-xs font-medium text-white">
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
                <span className="text-base font-bold text-black">{item.degree}{item.field ? ` in ${item.field}` : ''}</span>
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
      <div className="flex flex-wrap gap-2">
        {(content.categories || []).flatMap((cat: any) =>
          (cat.skills || []).map((skill: string, i: number) => (
            <span key={`${cat.id}-${i}`} className="border-2 border-black px-3 py-1 text-xs font-bold text-black">
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
            <span className="text-sm font-bold text-black">{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
