'use client';

import type { Resume, PersonalInfoContent, SummaryContent, WorkExperienceContent, EducationContent, SkillsContent } from '@/types/resume';
import { isSectionEmpty } from '../utils';

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];

export function InfographicTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  return (
    <div className="mx-auto max-w-[210mm] bg-white shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="relative overflow-hidden px-8 py-8" style={{ background: 'linear-gradient(135deg, #1e40af, #7c3aed)' }}>
        <div className="relative flex items-center gap-5">
          {pi.avatar && (
            <img src={pi.avatar} alt="" className="h-20 w-20 shrink-0 rounded-full border-3 border-white/30 object-cover" />
          )}
          <div>
            <h1 className="text-3xl font-bold text-white">{pi.fullName || 'Your Name'}</h1>
            {pi.jobTitle && <p className="mt-1 text-base text-white/70">{pi.jobTitle}</p>}
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-white/60">
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
          .map((section, idx) => (
            <div key={section.id} className="mb-6" data-section>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] text-white" style={{ background: COLORS[idx % COLORS.length] }}>
                  {idx + 1}
                </span>
                <span style={{ color: COLORS[idx % COLORS.length] }}>{section.title}</span>
              </h2>
              <InfographicSectionContent section={section} colorIndex={idx} />
            </div>
          ))}
      </div>
    </div>
  );
}

function InfographicSectionContent({ section, colorIndex }: { section: any; colorIndex: number }) {
  const content = section.content;
  const color = COLORS[colorIndex % COLORS.length];

  if (section.type === 'summary') {
    return <p className="rounded-lg border-l-4 bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-600" style={{ borderColor: color }}>{(content as SummaryContent).text}</p>;
  }

  if (section.type === 'work_experience') {
    return (
      <div className="space-y-4">
        {(content.items || []).map((item: any) => (
          <div key={item.id} className="rounded-lg border border-zinc-100 p-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold text-zinc-800">{item.position}</h3>
              <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ background: color }}>
                {item.startDate} – {item.current ? 'Present' : item.endDate}
              </span>
            </div>
            {item.company && <p className="text-sm" style={{ color }}>{item.company}</p>}
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
          <div key={item.id} className="rounded-lg border border-zinc-100 p-4">
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
      <div className="space-y-2">
        {(content.categories || []).map((cat: any, ci: number) => (
          <div key={cat.id}>
            <p className="mb-1 text-xs font-bold text-zinc-500">{cat.name}</p>
            <div className="flex flex-wrap gap-1.5">
              {(cat.skills || []).map((skill: string, i: number) => (
                <span key={i} className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white" style={{ background: COLORS[(colorIndex + ci) % COLORS.length] }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (content.items) {
    return (
      <div className="space-y-2">
        {content.items.map((item: any) => (
          <div key={item.id} className="rounded-lg border border-zinc-100 p-3">
            <span className="text-sm font-medium text-zinc-800">{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
