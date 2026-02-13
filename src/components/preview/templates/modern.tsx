'use client';

import type { Resume, PersonalInfoContent, SummaryContent, WorkExperienceContent, EducationContent, SkillsContent } from '@/types/resume';
import { isSectionEmpty } from '../utils';

export function ModernTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  return (
    <div className="mx-auto max-w-[210mm] overflow-hidden bg-white shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header with gradient */}
      <div
        className="relative px-10 py-8 text-white"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #e94560 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-6 right-20 h-24 w-24 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #e94560 0%, transparent 70%)' }}
        />

        <div className="relative flex items-center gap-6">
          {pi.avatar && (
            <div className="shrink-0 rounded-full p-[2px]" style={{ background: 'linear-gradient(135deg, #e94560, #0f3460)' }}>
              <img src={pi.avatar} alt="" className="h-[80px] w-[80px] rounded-full border-2 border-white/10 object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{pi.fullName || 'Your Name'}</h1>
            {pi.jobTitle && (
              <p className="mt-1.5 text-base font-light tracking-wide" style={{ color: '#e94560' }}>
                {pi.jobTitle}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-zinc-300">
              {[pi.email, pi.phone, pi.location, pi.website].filter(Boolean).map((item, i, arr) => (
                <span key={i} className="flex items-center gap-1.5">
                  {item}
                  {i < arr.length - 1 && <span className="text-zinc-500">|</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 h-[3px] w-full"
          style={{ background: 'linear-gradient(90deg, #e94560 0%, #0f3460 60%, transparent 100%)' }}
        />
      </div>

      <div className="p-8 pt-6">
        {resume.sections
          .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
          .map((section) => (
            <div key={section.id} className="mb-6" data-section>
              <h2 className="mb-3 flex items-center gap-2.5 text-sm font-bold uppercase tracking-wider" style={{ color: '#e94560' }}>
                <span className="h-[3px] w-7 rounded-full" style={{ background: 'linear-gradient(90deg, #e94560, #0f3460)' }} />
                {section.title}
              </h2>
              <ModernSectionContent section={section} />
            </div>
          ))}
      </div>
    </div>
  );
}

function ModernSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return <p className="text-sm leading-relaxed text-zinc-600">{(content as SummaryContent).text}</p>;
  }

  if (section.type === 'work_experience') {
    return (
      <div className="space-y-4">
        {(content.items || []).map((item: any) => (
          <div key={item.id} className="border-l-2 pl-4" style={{ borderColor: '#e94560' }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold text-zinc-800">{item.position}</h3>
              <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-500">
                {item.startDate} - {item.current ? 'Present' : item.endDate}
              </span>
            </div>
            {item.company && <p className="text-sm" style={{ color: '#e94560' }}>{item.company}</p>}
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
          <div key={item.id} className="border-l-2 pl-4" style={{ borderColor: '#0f3460' }}>
            <h3 className="text-sm font-semibold text-zinc-800">{item.institution}</h3>
            <p className="text-sm text-zinc-600">{item.degree} {item.field && `- ${item.field}`}</p>
            <span className="text-xs text-zinc-400">{item.startDate} - {item.endDate}</span>
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
            <span
              key={`${cat.id}-${i}`}
              className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors"
            >
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
          <div key={item.id} className="border-l-2 border-zinc-200 pl-4">
            <span className="text-sm font-medium text-zinc-700">{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
