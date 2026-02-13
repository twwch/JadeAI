'use client';

import type { Resume, PersonalInfoContent, SummaryContent, WorkExperienceContent, EducationContent, SkillsContent } from '@/types/resume';
import { isSectionEmpty } from '../utils';

const DARK = '#282c34';
const GREEN = '#98c379';
const BLUE = '#61afef';
const ORANGE = '#e5c07b';

export function DeveloperTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  return (
    <div className="mx-auto max-w-[210mm] bg-white shadow-lg" style={{ fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}>
      {/* Header - terminal style */}
      <div className="px-8 py-6" style={{ background: DARK }}>
        <div className="mb-3 flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <span className="ml-3 text-xs text-zinc-500">~/resume</span>
        </div>
        <div className="flex items-center gap-4">
          {pi.avatar && (
            <img src={pi.avatar} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
          )}
          <div>
            <h1 className="text-2xl font-bold" style={{ color: GREEN }}>{pi.fullName || 'Your Name'}</h1>
            {pi.jobTitle && <p className="mt-0.5 text-sm" style={{ color: BLUE }}>{`// ${pi.jobTitle}`}</p>}
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-400">
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
              <h2 className="mb-2 text-sm font-bold" style={{ color: ORANGE }}>
                {'> '}{section.title.toUpperCase()}
              </h2>
              <div className="border-l-2 pl-4" style={{ borderColor: '#3e4451' }}>
                <DeveloperSectionContent section={section} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function DeveloperSectionContent({ section }: { section: any }) {
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
                <span className="text-sm font-bold" style={{ color: DARK }}>{item.position}</span>
                {item.company && <span className="text-sm" style={{ color: BLUE }}> @ {item.company}</span>}
              </div>
              <span className="shrink-0 rounded px-2 py-0.5 text-[10px] font-medium" style={{ background: '#f0f0f0', color: '#636d83' }}>
                {item.startDate} – {item.current ? 'Present' : item.endDate}
              </span>
            </div>
            {item.description && <p className="mt-1 text-sm text-zinc-600">{item.description}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                    <span className="mt-1 shrink-0 text-xs" style={{ color: GREEN }}>$</span>{h}
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
        {(content.items || []).map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold" style={{ color: DARK }}>{item.degree}{item.field ? ` in ${item.field}` : ''}</span>
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
      <div className="space-y-2">
        {(content.categories || []).map((cat: any) => (
          <div key={cat.id}>
            <span className="text-xs font-bold" style={{ color: ORANGE }}>{cat.name}: </span>
            <span className="text-sm text-zinc-600">{(cat.skills || []).join(' | ')}</span>
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
            <span className="text-sm font-medium" style={{ color: DARK }}>{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
