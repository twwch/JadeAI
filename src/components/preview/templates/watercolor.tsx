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

const PRIMARY = '#4c1d95';
const ACCENT = '#c084fc';
const WASH = '#f5f3ff';
const TEXT = '#6b7280';
const TEXT_DARK = '#374151';

export function WatercolorTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);

  return (
    <div className="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="mb-6 rounded-2xl px-6 py-5" style={{ backgroundColor: WASH }}>
        <div className="flex items-center gap-5">
          {pi.avatar && (
            <div className="shrink-0 rounded-full p-1" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${PRIMARY})` }}>
              <img src={pi.avatar} alt="" className="h-20 w-20 rounded-full border-2 border-white object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold" style={{ color: PRIMARY }}>
              {pi.fullName || 'Your Name'}
            </h1>
            {pi.jobTitle && (
              <p className="mt-1 text-sm font-medium" style={{ color: ACCENT }}>{pi.jobTitle}</p>
            )}
            {contacts.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" style={{ color: TEXT }}>
                {contacts.map((c, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {c}
                    {i < contacts.length - 1 && <span style={{ color: ACCENT }}>{'/'}</span>}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sections */}
      {resume.sections
        .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
        .map((section) => (
          <div key={section.id} className="mb-5" data-section>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-6 w-1.5 rounded-full" style={{ background: `linear-gradient(to bottom, ${ACCENT}, ${PRIMARY})` }} />
              <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: PRIMARY }}>
                {section.title}
              </h2>
            </div>
            <WatercolorSectionContent section={section} />
          </div>
        ))}
    </div>
  );
}

function WatercolorSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return (
      <div className="rounded-xl p-4" style={{ backgroundColor: WASH }}>
        <p className="text-sm leading-relaxed" style={{ color: TEXT_DARK }}>
          {(content as SummaryContent).text}
        </p>
      </div>
    );
  }

  if (section.type === 'work_experience') {
    const items = (content as WorkExperienceContent).items || [];
    return (
      <div className="space-y-4">
        {items.map((item: any) => (
          <div key={item.id} className="rounded-xl p-4" style={{ backgroundColor: `${WASH}` }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold" style={{ color: PRIMARY }}>{item.position}</h3>
              <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${PRIMARY})` }}>
                {item.startDate} - {item.current ? 'Present' : item.endDate}
              </span>
            </div>
            {item.company && <p className="text-sm font-medium" style={{ color: ACCENT }}>{item.company}</p>}
            {item.description && <p className="mt-1 text-sm" style={{ color: TEXT }}>{item.description}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1.5 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: TEXT }}>
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: ACCENT }} />
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
    const items = (content as EducationContent).items || [];
    return (
      <div className="space-y-3">
        {items.map((item: any) => (
          <div key={item.id} className="rounded-xl p-4" style={{ backgroundColor: WASH }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold" style={{ color: PRIMARY }}>{item.institution}</h3>
              <span className="text-xs" style={{ color: TEXT }}>{item.startDate} - {item.endDate}</span>
            </div>
            <p className="text-sm" style={{ color: TEXT_DARK }}>{item.degree}{item.field ? ` in ${item.field}` : ''}</p>
            {item.gpa && <p className="text-xs" style={{ color: ACCENT }}>GPA: {item.gpa}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: TEXT }}>
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: ACCENT }} />
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
    const categories = (content as SkillsContent).categories || [];
    return (
      <div className="space-y-3">
        {categories.map((cat: any) => (
          <div key={cat.id}>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT }}>{cat.name}</p>
            <div className="flex flex-wrap gap-1.5">
              {(cat.skills || []).map((skill: string, i: number) => (
                <span
                  key={i}
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: WASH, color: PRIMARY, border: `1px solid ${ACCENT}40` }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'projects') {
    const items = (content as ProjectsContent).items || [];
    return (
      <div className="space-y-3">
        {items.map((item: any) => (
          <div key={item.id} className="rounded-xl p-4" style={{ backgroundColor: WASH }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold" style={{ color: PRIMARY }}>{item.name}</h3>
              {item.startDate && (
                <span className="text-xs" style={{ color: TEXT }}>
                  {item.startDate}{item.endDate ? ` - ${item.endDate}` : ''}
                </span>
              )}
            </div>
            {item.description && <p className="mt-0.5 text-sm" style={{ color: TEXT }}>{item.description}</p>}
            {item.technologies?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {item.technologies.map((t: string, i: number) => (
                  <span key={i} className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${PRIMARY})` }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
            {item.highlights?.length > 0 && (
              <ul className="mt-1.5 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: TEXT }}>
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: ACCENT }} />
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
    const items = (content as CertificationsContent).items || [];
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item: any) => (
          <div key={item.id} className="rounded-xl px-4 py-2" style={{ backgroundColor: WASH, border: `1px solid ${ACCENT}30` }}>
            <p className="text-sm font-bold" style={{ color: PRIMARY }}>{item.name}</p>
            <p className="text-xs" style={{ color: TEXT }}>{item.issuer}{item.date ? ` | ${item.date}` : ''}</p>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'languages') {
    const items = (content as LanguagesContent).items || [];
    return (
      <div className="flex flex-wrap gap-3">
        {items.map((item: any) => (
          <div key={item.id} className="flex items-center gap-2 rounded-full px-4 py-1.5" style={{ backgroundColor: WASH, border: `1px solid ${ACCENT}30` }}>
            <span className="h-2 w-2 rounded-full" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${PRIMARY})` }} />
            <span className="text-sm font-medium" style={{ color: PRIMARY }}>{item.language}</span>
            <span className="text-xs" style={{ color: TEXT }}>{item.proficiency}</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'custom') {
    const items = (content as CustomContent).items || [];
    return (
      <div className="space-y-3">
        {items.map((item: any) => (
          <div key={item.id} className="rounded-xl p-4" style={{ backgroundColor: WASH }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold" style={{ color: PRIMARY }}>{item.title}</h3>
              {item.date && <span className="text-xs" style={{ color: TEXT }}>{item.date}</span>}
            </div>
            {item.subtitle && <p className="text-sm" style={{ color: ACCENT }}>{item.subtitle}</p>}
            {item.description && <p className="mt-1 text-sm" style={{ color: TEXT }}>{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  // Generic fallback
  if (content.items) {
    return (
      <div className="space-y-2">
        {content.items.map((item: any) => (
          <div key={item.id} className="rounded-xl p-3" style={{ backgroundColor: WASH }}>
            <span className="text-sm font-medium" style={{ color: PRIMARY }}>{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm" style={{ color: TEXT }}>{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
