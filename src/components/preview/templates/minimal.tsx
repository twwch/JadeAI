'use client';

import type { Resume, PersonalInfoContent, SummaryContent, WorkExperienceContent, EducationContent, SkillsContent } from '@/types/resume';
import { isSectionEmpty } from '../utils';

export function MinimalTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  return (
    <div className="mx-auto max-w-[210mm] bg-white p-10 shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Minimal header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          {pi.avatar && (
            <img src={pi.avatar} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
          )}
          <div>
            <h1 className="text-xl font-medium text-zinc-900">{pi.fullName || 'Your Name'}</h1>
            <div className="mt-1 flex flex-wrap gap-3 text-sm text-zinc-500">
              {pi.jobTitle && <span>{pi.jobTitle}</span>}
              {pi.email && <span>{pi.email}</span>}
              {pi.phone && <span>{pi.phone}</span>}
              {pi.location && <span>{pi.location}</span>}
            </div>
          </div>
        </div>
      </div>

      {resume.sections
        .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
        .map((section) => (
          <div key={section.id} className="mb-6">
            <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-zinc-400">
              {section.title}
            </h2>
            <MinimalSectionContent section={section} />
          </div>
        ))}
    </div>
  );
}

function MinimalSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return <p className="text-sm text-zinc-600 leading-relaxed">{(content as SummaryContent).text}</p>;
  }

  if (section.type === 'work_experience') {
    return (
      <div className="space-y-4">
        {(content.items || []).map((item: any) => (
          <div key={item.id}>
            <p className="text-sm"><span className="font-medium text-zinc-800">{item.position}</span> {item.company && <span className="text-zinc-500">/ {item.company}</span>}</p>
            <p className="text-xs text-zinc-400">{item.startDate} - {item.current ? 'Present' : item.endDate}</p>
            {item.description && <p className="mt-1 text-sm text-zinc-600">{item.description}</p>}
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
            <p className="text-sm"><span className="font-medium text-zinc-800">{item.institution}</span></p>
            <p className="text-sm text-zinc-600">{item.degree} {item.field && `- ${item.field}`}</p>
            <p className="text-xs text-zinc-400">{item.startDate} - {item.endDate}</p>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'skills') {
    return (
      <div className="space-y-1">
        {(content.categories || []).map((cat: any) => (
          <p key={cat.id} className="text-sm text-zinc-600">{cat.skills?.join(' / ')}</p>
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
            {item.description && <p className="text-sm text-zinc-500">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
