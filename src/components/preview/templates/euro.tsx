'use client';

import type { Resume, PersonalInfoContent, SummaryContent, WorkExperienceContent, EducationContent, SkillsContent } from '@/types/resume';
import { isSectionEmpty } from '../utils';

const BLUE = '#1e40af';

export function EuroTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  return (
    <div className="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header - EU CV style with photo on right */}
      <div className="mb-6 flex items-start gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold" style={{ color: BLUE }}>{pi.fullName || 'Your Name'}</h1>
          {pi.jobTitle && <p className="mt-1 text-base text-zinc-500">{pi.jobTitle}</p>}
          <div className="mt-3 space-y-0.5 text-sm text-zinc-600">
            {pi.email && <div><span className="inline-block w-20 text-xs font-semibold uppercase text-zinc-400">Email</span>{pi.email}</div>}
            {pi.phone && <div><span className="inline-block w-20 text-xs font-semibold uppercase text-zinc-400">Phone</span>{pi.phone}</div>}
            {pi.location && <div><span className="inline-block w-20 text-xs font-semibold uppercase text-zinc-400">Address</span>{pi.location}</div>}
            {pi.website && <div><span className="inline-block w-20 text-xs font-semibold uppercase text-zinc-400">Website</span>{pi.website}</div>}
          </div>
        </div>
        {pi.avatar && (
          <img src={pi.avatar} alt="" className="h-28 w-22 shrink-0 rounded border-2 object-cover" style={{ borderColor: BLUE }} />
        )}
      </div>

      <div className="h-1 w-full rounded" style={{ background: BLUE }} />

      {/* Sections */}
      <div className="mt-6">
        {resume.sections
          .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
          .map((section) => (
            <div key={section.id} className="mb-5 flex gap-4" data-section>
              <div className="w-28 shrink-0 pt-0.5 text-right">
                <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: BLUE }}>{section.title}</h2>
              </div>
              <div className="flex-1 border-l-2 pl-4" style={{ borderColor: '#dbeafe' }}>
                <EuroSectionContent section={section} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function EuroSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return <p className="text-sm leading-relaxed text-zinc-600">{(content as SummaryContent).text}</p>;
  }

  if (section.type === 'work_experience') {
    return (
      <div className="space-y-3">
        {(content.items || []).map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold text-zinc-800">{item.position}</span>
                {item.company && <span className="text-sm text-zinc-500"> — {item.company}</span>}
              </div>
              <span className="shrink-0 text-xs text-zinc-400">{item.startDate} – {item.current ? 'Present' : item.endDate}</span>
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
      <div className="space-y-3">
        {(content.items || []).map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold text-zinc-800">{item.degree}{item.field ? ` in ${item.field}` : ''}</span>
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
            <span className="w-28 shrink-0 font-medium" style={{ color: BLUE }}>{cat.name}:</span>
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
            <span className="text-sm font-medium text-zinc-700">{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
