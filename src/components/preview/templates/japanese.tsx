'use client';

import type {
  Resume,
  PersonalInfoContent,
  SummaryContent,
  WorkExperienceContent,
  EducationContent,
  SkillsContent,
  ProjectsContent,
  CertificationsContent,
  LanguagesContent,
  CustomContent,
} from '@/types/resume';
import { isSectionEmpty } from '../utils';

const PRIMARY = '#1c1917';
const ACCENT = '#a8a29e';
const SUBTLE = '#f5f5f4';

export function JapaneseTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  return (
    <div className="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header - generous whitespace */}
      <div className="mb-12 pt-4 text-center">
        {pi.avatar && (
          <img src={pi.avatar} alt="" className="mx-auto mb-4 h-16 w-16 rounded-full object-cover" style={{ border: `1px solid ${ACCENT}` }} />
        )}
        <h1 className="text-2xl font-light tracking-wide" style={{ color: PRIMARY }}>{pi.fullName || 'Your Name'}</h1>
        {pi.jobTitle && <p className="mt-2 text-xs font-light tracking-[0.25em] uppercase" style={{ color: ACCENT }}>{pi.jobTitle}</p>}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-light" style={{ color: ACCENT }}>
          {pi.email && <span>{pi.email}</span>}
          {pi.phone && <span>{pi.phone}</span>}
          {pi.location && <span>{pi.location}</span>}
          {pi.website && <span>{pi.website}</span>}
        </div>
      </div>

      {/* Thin delicate line */}
      <div className="mx-auto mb-10 h-px" style={{ backgroundColor: ACCENT, opacity: 0.4 }} />

      {/* Sections */}
      {resume.sections
        .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
        .map((section) => (
          <div key={section.id} className="mb-8" data-section>
            {/* Section header with subtle dot */}
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-block h-1 w-1 rounded-full" style={{ backgroundColor: ACCENT }} />
              <h2 className="text-[10px] font-light uppercase tracking-[0.25em]" style={{ color: ACCENT }}>{section.title}</h2>
            </div>
            <JapaneseSectionContent section={section} />
          </div>
        ))}
    </div>
  );
}

function JapaneseSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return <p className="text-sm font-light leading-loose" style={{ color: '#57534e' }}>{(content as SummaryContent).text}</p>;
  }

  if (section.type === 'work_experience') {
    return (
      <div className="space-y-6">
        {((content as WorkExperienceContent).items || []).map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-normal" style={{ color: PRIMARY }}>{item.position}</h3>
              <span className="shrink-0 text-[10px] font-light" style={{ color: ACCENT }}>{item.startDate} &ndash; {item.current ? 'Present' : item.endDate}</span>
            </div>
            {item.company && <p className="mt-0.5 text-xs font-light" style={{ color: ACCENT }}>{item.company}</p>}
            {item.description && <p className="mt-2 text-sm font-light leading-relaxed" style={{ color: '#57534e' }}>{item.description}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-2 space-y-1">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-light" style={{ color: '#57534e' }}>
                    <span className="mt-2 inline-block h-px w-3 shrink-0" style={{ backgroundColor: ACCENT }} />
                    {h}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 h-px" style={{ backgroundColor: ACCENT, opacity: 0.2 }} />
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'education') {
    return (
      <div className="space-y-5">
        {((content as EducationContent).items || []).map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-normal" style={{ color: PRIMARY }}>{item.degree}{item.field ? ` in ${item.field}` : ''}</h3>
              <span className="shrink-0 text-[10px] font-light" style={{ color: ACCENT }}>{item.startDate} &ndash; {item.endDate}</span>
            </div>
            {item.institution && <p className="mt-0.5 text-xs font-light" style={{ color: ACCENT }}>{item.institution}</p>}
            {item.gpa && <p className="mt-1 text-xs font-light" style={{ color: ACCENT }}>GPA: {item.gpa}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-2 space-y-1">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-light" style={{ color: '#57534e' }}>
                    <span className="mt-2 inline-block h-px w-3 shrink-0" style={{ backgroundColor: ACCENT }} />
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'skills') {
    return (
      <div className="space-y-2">
        {((content as SkillsContent).categories || []).map((cat: any) => (
          <div key={cat.id} className="flex text-sm">
            <span className="w-32 shrink-0 font-normal" style={{ color: PRIMARY }}>{cat.name}</span>
            <span className="font-light" style={{ color: '#57534e' }}>{(cat.skills || []).join(', ')}</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'projects') {
    return (
      <div className="space-y-5">
        {((content as ProjectsContent).items || []).map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-normal" style={{ color: PRIMARY }}>{item.name}</h3>
              {item.startDate && (
                <span className="shrink-0 text-[10px] font-light" style={{ color: ACCENT }}>{item.startDate}{item.endDate ? ` \u2013 ${item.endDate}` : ''}</span>
              )}
            </div>
            {item.description && <p className="mt-1 text-sm font-light leading-relaxed" style={{ color: '#57534e' }}>{item.description}</p>}
            {item.technologies?.length > 0 && (
              <p className="mt-1 text-xs font-light" style={{ color: ACCENT }}>{item.technologies.join(' \u00b7 ')}</p>
            )}
            {item.highlights?.length > 0 && (
              <ul className="mt-2 space-y-1">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-light" style={{ color: '#57534e' }}>
                    <span className="mt-2 inline-block h-px w-3 shrink-0" style={{ backgroundColor: ACCENT }} />
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'certifications') {
    return (
      <div className="space-y-2">
        {((content as CertificationsContent).items || []).map((item: any) => (
          <div key={item.id} className="flex items-baseline justify-between">
            <div>
              <span className="text-sm font-normal" style={{ color: PRIMARY }}>{item.name}</span>
              <span className="text-xs font-light" style={{ color: ACCENT }}> &mdash; {item.issuer}</span>
            </div>
            {item.date && <span className="shrink-0 text-[10px] font-light" style={{ color: ACCENT }}>{item.date}</span>}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'languages') {
    return (
      <div className="flex flex-wrap gap-x-8 gap-y-2">
        {((content as LanguagesContent).items || []).map((item: any) => (
          <div key={item.id} className="text-sm">
            <span className="font-normal" style={{ color: PRIMARY }}>{item.language}</span>
            <span className="font-light" style={{ color: ACCENT }}> &mdash; {item.proficiency}</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'custom') {
    return (
      <div className="space-y-4">
        {((content as CustomContent).items || []).map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <h3 className="text-sm font-normal" style={{ color: PRIMARY }}>{item.title}</h3>
                {item.subtitle && <span className="text-xs font-light" style={{ color: ACCENT }}>{item.subtitle}</span>}
              </div>
              {item.date && <span className="shrink-0 text-[10px] font-light" style={{ color: ACCENT }}>{item.date}</span>}
            </div>
            {item.description && <p className="mt-1 text-sm font-light leading-relaxed" style={{ color: '#57534e' }}>{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  // Generic items fallback
  if (content.items) {
    return (
      <div className="space-y-2">
        {content.items.map((item: any) => (
          <div key={item.id}>
            <span className="text-sm font-normal" style={{ color: PRIMARY }}>{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm font-light" style={{ color: '#57534e' }}>{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
