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

const GOLD = '#d4af37';
const TEXT = '#000000';
const BG = '#fafaf9';

export function LuxeTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  return (
    <div className="mx-auto max-w-[210mm] p-8 shadow-lg" style={{ fontFamily: 'Georgia, serif', backgroundColor: BG }}>
      {/* Header */}
      <div className="mb-8 border-b-2 pb-6" style={{ borderColor: GOLD }}>
        <div className="text-center">
          {pi.avatar && (
            <img src={pi.avatar} alt="" className="mx-auto mb-3 h-20 w-20 rounded-full border-2 object-cover" style={{ borderColor: GOLD }} />
          )}
          <h1 className="text-3xl font-bold tracking-wider uppercase" style={{ color: TEXT, letterSpacing: '0.15em' }}>{pi.fullName || 'Your Name'}</h1>
          {pi.jobTitle && (
            <p className="mt-2 text-sm tracking-[0.2em] uppercase" style={{ color: GOLD }}>{pi.jobTitle}</p>
          )}
          {/* Gold divider ornament */}
          <div className="mx-auto mt-4 flex items-center justify-center gap-2">
            <div className="h-px w-16" style={{ backgroundColor: GOLD }} />
            <div className="h-2 w-2 rotate-45" style={{ backgroundColor: GOLD }} />
            <div className="h-px w-16" style={{ backgroundColor: GOLD }} />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs" style={{ color: '#78716c' }}>
            {pi.email && <span>{pi.email}</span>}
            {pi.phone && <span>{pi.phone}</span>}
            {pi.location && <span>{pi.location}</span>}
            {pi.website && <span>{pi.website}</span>}
          </div>
        </div>
      </div>

      {/* Sections */}
      {resume.sections
        .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
        .map((section) => (
          <div key={section.id} className="mb-7" data-section>
            {/* Section header with gold borders */}
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-1" style={{ backgroundColor: GOLD }} />
              <h2 className="shrink-0 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>{section.title}</h2>
              <div className="h-px flex-1" style={{ backgroundColor: GOLD }} />
            </div>
            <LuxeSectionContent section={section} />
          </div>
        ))}
    </div>
  );
}

function LuxeSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return (
      <p className="text-center text-sm italic leading-relaxed" style={{ color: '#44403c' }}>{(content as SummaryContent).text}</p>
    );
  }

  if (section.type === 'work_experience') {
    return (
      <div className="space-y-5">
        {((content as WorkExperienceContent).items || []).map((item: any) => (
          <div key={item.id} className="border-l-2 pl-4" style={{ borderColor: GOLD }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold" style={{ color: TEXT }}>{item.position}</h3>
              <span className="shrink-0 text-xs italic" style={{ color: '#a8a29e' }}>{item.startDate} &ndash; {item.current ? 'Present' : item.endDate}</span>
            </div>
            {item.company && <p className="text-sm" style={{ color: GOLD }}>{item.company}</p>}
            {item.description && <p className="mt-1 text-sm" style={{ color: '#44403c' }}>{item.description}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1.5 list-none space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#44403c' }}>
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45" style={{ backgroundColor: GOLD }} />
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

  if (section.type === 'education') {
    return (
      <div className="space-y-4">
        {((content as EducationContent).items || []).map((item: any) => (
          <div key={item.id} className="border-l-2 pl-4" style={{ borderColor: GOLD }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold" style={{ color: TEXT }}>{item.degree}{item.field ? ` in ${item.field}` : ''}</h3>
              <span className="shrink-0 text-xs italic" style={{ color: '#a8a29e' }}>{item.startDate} &ndash; {item.endDate}</span>
            </div>
            {item.institution && <p className="text-sm" style={{ color: GOLD }}>{item.institution}</p>}
            {item.gpa && <p className="text-xs" style={{ color: '#a8a29e' }}>GPA: {item.gpa}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 list-none space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#44403c' }}>
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45" style={{ backgroundColor: GOLD }} />
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
      <div className="space-y-1.5">
        {((content as SkillsContent).categories || []).map((cat: any) => (
          <div key={cat.id} className="flex text-sm">
            <span className="w-32 shrink-0 font-bold" style={{ color: GOLD }}>{cat.name}:</span>
            <span style={{ color: '#44403c' }}>{(cat.skills || []).join(', ')}</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'projects') {
    return (
      <div className="space-y-4">
        {((content as ProjectsContent).items || []).map((item: any) => (
          <div key={item.id} className="border-l-2 pl-4" style={{ borderColor: GOLD }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold" style={{ color: TEXT }}>{item.name}</h3>
              {item.startDate && (
                <span className="shrink-0 text-xs italic" style={{ color: '#a8a29e' }}>{item.startDate}{item.endDate ? ` \u2013 ${item.endDate}` : ''}</span>
              )}
            </div>
            {item.description && <p className="mt-0.5 text-sm" style={{ color: '#44403c' }}>{item.description}</p>}
            {item.technologies?.length > 0 && (
              <p className="mt-0.5 text-xs italic" style={{ color: '#a8a29e' }}>Tech: {item.technologies.join(', ')}</p>
            )}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 list-none space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#44403c' }}>
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45" style={{ backgroundColor: GOLD }} />
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
              <span className="text-sm font-bold" style={{ color: TEXT }}>{item.name}</span>
              <span className="text-sm" style={{ color: '#a8a29e' }}> &mdash; {item.issuer}</span>
            </div>
            {item.date && <span className="shrink-0 text-xs italic" style={{ color: GOLD }}>{item.date}</span>}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'languages') {
    return (
      <div className="flex flex-wrap gap-4">
        {((content as LanguagesContent).items || []).map((item: any) => (
          <div key={item.id} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rotate-45" style={{ backgroundColor: GOLD }} />
            <span className="text-sm font-bold" style={{ color: TEXT }}>{item.language}</span>
            <span className="text-xs" style={{ color: '#a8a29e' }}>{item.proficiency}</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'custom') {
    return (
      <div className="space-y-4">
        {((content as CustomContent).items || []).map((item: any) => (
          <div key={item.id} className="border-l-2 pl-4" style={{ borderColor: GOLD }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold" style={{ color: TEXT }}>{item.title}</h3>
              {item.date && <span className="shrink-0 text-xs italic" style={{ color: GOLD }}>{item.date}</span>}
            </div>
            {item.subtitle && <p className="text-sm" style={{ color: GOLD }}>{item.subtitle}</p>}
            {item.description && <p className="mt-0.5 text-sm" style={{ color: '#44403c' }}>{item.description}</p>}
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
            <span className="text-sm font-bold" style={{ color: TEXT }}>{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm" style={{ color: '#44403c' }}>{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
