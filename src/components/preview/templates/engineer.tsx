'use client';

import type { Resume, PersonalInfoContent, SummaryContent, WorkExperienceContent, EducationContent, SkillsContent, ProjectsContent, CertificationsContent, LanguagesContent, CustomContent } from '@/types/resume';
import { isSectionEmpty } from '../utils';

const PRIMARY = '#1e293b';
const ACCENT = '#0284c7';
const SECONDARY = '#64748b';
const BODY_TEXT = '#334155';
const RULE_COLOR = '#cbd5e1';
const LIGHT_BG = '#f1f5f9';

export function EngineerTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  return (
    <div className="mx-auto max-w-[210mm] bg-white shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Dark steel header */}
      <div className="px-8 py-6" style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #334155 100%)` }}>
        <div className="flex items-center gap-5">
          {pi.avatar && (
            <img src={pi.avatar} alt="" className="h-16 w-16 shrink-0 rounded object-cover" style={{ border: `2px solid ${ACCENT}` }} />
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{pi.fullName || 'Your Name'}</h1>
            {pi.jobTitle && (
              <p className="mt-0.5 text-sm font-medium" style={{ color: ACCENT }}>{pi.jobTitle}</p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <div className="space-y-0.5 text-xs" style={{ color: '#94a3b8' }}>
              {pi.email && <p>{pi.email}</p>}
              {pi.phone && <p>{pi.phone}</p>}
              {pi.location && <p>{pi.location}</p>}
              {pi.website && <p>{pi.website}</p>}
            </div>
          </div>
        </div>
        {/* Technical measurement bar */}
        <div className="mt-4 flex items-center gap-1">
          <div className="h-0.5 flex-1" style={{ backgroundColor: ACCENT }} />
          <div className="h-2 w-px" style={{ backgroundColor: ACCENT }} />
          <div className="h-0.5 w-8" style={{ backgroundColor: ACCENT }} />
          <div className="h-2 w-px" style={{ backgroundColor: ACCENT }} />
          <div className="h-0.5 flex-1" style={{ backgroundColor: ACCENT }} />
        </div>
      </div>

      {/* Body */}
      <div className="p-8">
        {resume.sections
          .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
          .map((section) => (
            <div key={section.id} className="mb-6" data-section>
              <div className="mb-2 flex items-center gap-3">
                <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: PRIMARY }}>
                  {section.title}
                </h2>
                <div className="h-px flex-1" style={{ backgroundColor: ACCENT }} />
                <div className="h-1.5 w-1.5" style={{ backgroundColor: ACCENT }} />
              </div>
              <EngineerSectionContent section={section} />
            </div>
          ))}
      </div>
    </div>
  );
}

function EngineerSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return (
      <p className="border-l-2 pl-4 text-sm leading-relaxed" style={{ color: BODY_TEXT, borderColor: ACCENT }}>
        {(content as SummaryContent).text}
      </p>
    );
  }

  if (section.type === 'work_experience') {
    return (
      <div className="space-y-4">
        {((content as WorkExperienceContent).items || []).map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold" style={{ color: PRIMARY }}>{item.position}</span>
                {item.company && <span className="text-sm font-medium" style={{ color: ACCENT }}> | {item.company}</span>}
              </div>
              <span
                className="shrink-0 px-2 py-0.5 text-[10px] font-medium uppercase"
                style={{ fontFamily: 'JetBrains Mono, Consolas, monospace', color: SECONDARY, backgroundColor: LIGHT_BG }}
              >
                {item.startDate} - {item.current ? 'Present' : item.endDate}
              </span>
            </div>
            {item.description && <p className="mt-1 text-sm" style={{ color: BODY_TEXT }}>{item.description}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1.5 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: BODY_TEXT }}>
                    <span className="mt-1.5 h-1 w-1 shrink-0" style={{ backgroundColor: ACCENT }} />
                    {h}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-2 h-px" style={{ backgroundColor: RULE_COLOR }} />
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'education') {
    return (
      <div className="space-y-3">
        {((content as EducationContent).items || []).map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold" style={{ color: PRIMARY }}>
                  {item.degree}{item.field ? ` in ${item.field}` : ''}
                </span>
                {item.institution && <span className="text-sm" style={{ color: SECONDARY }}> — {item.institution}</span>}
              </div>
              <span
                className="shrink-0 text-xs"
                style={{ fontFamily: 'JetBrains Mono, Consolas, monospace', color: SECONDARY }}
              >
                {item.startDate} - {item.endDate}
              </span>
            </div>
            {item.gpa && <p className="text-xs" style={{ color: SECONDARY }}>GPA: {item.gpa}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: BODY_TEXT }}>
                    <span className="mt-1.5 h-1 w-1 shrink-0" style={{ backgroundColor: ACCENT }} />
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
          <div key={cat.id}>
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ fontFamily: 'JetBrains Mono, Consolas, monospace', color: PRIMARY }}
            >
              {cat.name}:
            </span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {(cat.skills || []).map((skill: string, i: number) => (
                <span
                  key={i}
                  className="border px-2 py-0.5 text-[11px]"
                  style={{ borderColor: RULE_COLOR, color: BODY_TEXT }}
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
    return (
      <div className="space-y-3">
        {((content as ProjectsContent).items || []).map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-bold" style={{ color: PRIMARY }}>{item.name}</span>
              {item.startDate && (
                <span
                  className="shrink-0 text-xs"
                  style={{ fontFamily: 'JetBrains Mono, Consolas, monospace', color: SECONDARY }}
                >
                  {item.startDate}{item.endDate ? ` - ${item.endDate}` : ''}
                </span>
              )}
            </div>
            {item.description && <p className="mt-1 text-sm" style={{ color: BODY_TEXT }}>{item.description}</p>}
            {item.technologies?.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1.5">
                {item.technologies.map((t: string, i: number) => (
                  <span
                    key={i}
                    className="border px-2 py-0.5 text-[10px] font-medium"
                    style={{ fontFamily: 'JetBrains Mono, Consolas, monospace', borderColor: ACCENT, color: ACCENT }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            {item.highlights?.length > 0 && (
              <ul className="mt-1.5 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: BODY_TEXT }}>
                    <span className="mt-1.5 h-1 w-1 shrink-0" style={{ backgroundColor: ACCENT }} />
                    {h}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-2 h-px" style={{ backgroundColor: RULE_COLOR }} />
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'certifications') {
    return (
      <div className="space-y-1.5">
        {((content as CertificationsContent).items || []).map((item: any) => (
          <div key={item.id} className="flex items-center gap-2">
            <span className="h-1 w-1 shrink-0" style={{ backgroundColor: ACCENT }} />
            <span className="text-sm font-medium" style={{ color: PRIMARY }}>{item.name}</span>
            <span className="text-sm" style={{ color: SECONDARY }}> — {item.issuer} ({item.date})</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'languages') {
    return (
      <div className="space-y-1.5">
        {((content as LanguagesContent).items || []).map((item: any) => (
          <div key={item.id} className="flex items-center gap-2">
            <span className="h-1 w-1 shrink-0" style={{ backgroundColor: ACCENT }} />
            <span className="text-sm font-medium" style={{ color: PRIMARY }}>{item.language}</span>
            <span className="text-sm" style={{ color: SECONDARY }}> — {item.proficiency}</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'custom') {
    return (
      <div className="space-y-3">
        {((content as CustomContent).items || []).map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold" style={{ color: PRIMARY }}>{item.title}</span>
                {item.subtitle && <span className="text-sm" style={{ color: SECONDARY }}> — {item.subtitle}</span>}
              </div>
              {item.date && (
                <span
                  className="shrink-0 text-xs"
                  style={{ fontFamily: 'JetBrains Mono, Consolas, monospace', color: SECONDARY }}
                >
                  {item.date}
                </span>
              )}
            </div>
            {item.description && <p className="mt-1 text-sm" style={{ color: BODY_TEXT }}>{item.description}</p>}
            <div className="mt-2 h-px" style={{ backgroundColor: RULE_COLOR }} />
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
          <div key={item.id} className="flex items-center gap-2">
            <span className="h-1 w-1 shrink-0" style={{ backgroundColor: ACCENT }} />
            <span className="text-sm font-medium" style={{ color: PRIMARY }}>{item.name || item.title || item.language}</span>
            {item.description && <span className="text-sm" style={{ color: BODY_TEXT }}> — {item.description}</span>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
