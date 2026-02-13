'use client';

import type { Resume, PersonalInfoContent, SummaryContent, WorkExperienceContent, EducationContent, SkillsContent } from '@/types/resume';
import { isSectionEmpty } from '../utils';

const CORAL = '#ff6b6b';

export function DesignerTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  return (
    <div className="mx-auto max-w-[210mm] bg-white shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header - magazine style */}
      <div className="flex">
        <div className="flex-1 px-8 py-8">
          <h1 className="text-4xl font-black tracking-tight text-black">{pi.fullName || 'Your Name'}</h1>
          {pi.jobTitle && <p className="mt-1 text-lg font-light" style={{ color: CORAL }}>{pi.jobTitle}</p>}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500">
            {pi.email && <span>{pi.email}</span>}
            {pi.phone && <span>{pi.phone}</span>}
            {pi.location && <span>{pi.location}</span>}
            {pi.website && <span>{pi.website}</span>}
          </div>
        </div>
        {pi.avatar && (
          <div className="w-32 shrink-0">
            <img src={pi.avatar} alt="" className="h-full w-full object-cover" />
          </div>
        )}
      </div>

      <div className="h-1 w-full" style={{ background: CORAL }} />

      <div className="p-8">
        {resume.sections
          .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
          .map((section) => (
            <div key={section.id} className="mb-6" data-section>
              <h2 className="mb-3 text-xs font-black uppercase tracking-[0.3em]" style={{ color: CORAL }}>
                {section.title}
              </h2>
              <DesignerSectionContent section={section} />
            </div>
          ))}
      </div>
    </div>
  );
}

function DesignerSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return <p className="border-l-4 pl-4 text-sm leading-relaxed text-zinc-600" style={{ borderColor: CORAL }}>{(content as SummaryContent).text}</p>;
  }

  if (section.type === 'work_experience') {
    return (
      <div className="space-y-4">
        {(content.items || []).map((item: any) => (
          <div key={item.id} className="rounded-lg bg-zinc-50 p-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold text-black">{item.position}</h3>
              <span className="shrink-0 text-xs text-zinc-400">{item.startDate} – {item.current ? 'Present' : item.endDate}</span>
            </div>
            {item.company && <p className="text-sm font-medium" style={{ color: CORAL }}>{item.company}</p>}
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
      <div className="space-y-3">
        {(content.items || []).map((item: any) => (
          <div key={item.id} className="rounded-lg bg-zinc-50 p-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold text-black">{item.degree}{item.field ? ` in ${item.field}` : ''}</span>
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
            <span key={`${cat.id}-${i}`} className="rounded-full px-3 py-1 text-xs font-medium text-white" style={{ background: CORAL }}>
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
          <div key={item.id} className="rounded-lg bg-zinc-50 p-3">
            <span className="text-sm font-medium text-black">{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
