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

const BG = '#111827';
const CYAN = '#22d3ee';
const VIOLET = '#a78bfa';
const TEXT = '#d1d5db';
const TEXT_DIM = '#9ca3af';

export function NeonTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);

  return (
    <div className="mx-auto max-w-[210mm] overflow-hidden shadow-lg" style={{ fontFamily: 'Inter, sans-serif', backgroundColor: BG }}>
      {/* Header */}
      <div className="relative px-10 py-8" style={{ borderBottom: `2px solid ${CYAN}`, boxShadow: `0 2px 20px ${CYAN}40` }}>
        <div className="flex items-center gap-5">
          {pi.avatar && (
            <div className="shrink-0 rounded-lg p-0.5" style={{ border: `2px solid ${CYAN}`, boxShadow: `0 0 12px ${CYAN}60` }}>
              <img src={pi.avatar} alt="" className="h-20 w-20 rounded-lg object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: CYAN, textShadow: `0 0 20px ${CYAN}60` }}>
              {pi.fullName || 'Your Name'}
            </h1>
            {pi.jobTitle && (
              <p className="mt-1 text-sm font-medium" style={{ color: VIOLET, textShadow: `0 0 10px ${VIOLET}40` }}>
                {pi.jobTitle}
              </p>
            )}
            {contacts.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" style={{ color: TEXT_DIM }}>
                {contacts.map((c, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {c}
                    {i < contacts.length - 1 && <span style={{ color: `${CYAN}40` }}>|</span>}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-8 pt-6">
        {resume.sections
          .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
          .map((section) => (
            <div key={section.id} className="mb-6" data-section>
              <div className="mb-3 flex items-center gap-3">
                <h2 className="text-sm font-extrabold uppercase tracking-widest" style={{ color: CYAN, textShadow: `0 0 10px ${CYAN}40` }}>
                  {section.title}
                </h2>
                <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${CYAN}40, transparent)` }} />
              </div>
              <NeonSectionContent section={section} />
            </div>
          ))}
      </div>
    </div>
  );
}

function NeonSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return (
      <div className="rounded-lg p-4" style={{ border: `1px solid ${CYAN}20`, backgroundColor: `${CYAN}08` }}>
        <p className="text-sm leading-relaxed" style={{ color: TEXT }}>
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
          <div key={item.id} className="rounded-lg p-4" style={{ border: `1px solid ${CYAN}20`, backgroundColor: `${CYAN}05` }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold" style={{ color: CYAN }}>{item.position}</h3>
              <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ color: BG, backgroundColor: VIOLET, boxShadow: `0 0 8px ${VIOLET}40` }}>
                {item.startDate} - {item.current ? 'Present' : item.endDate}
              </span>
            </div>
            {item.company && <p className="text-sm font-medium" style={{ color: VIOLET }}>{item.company}</p>}
            {item.description && <p className="mt-1 text-sm" style={{ color: TEXT }}>{item.description}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1.5 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: TEXT }}>
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: CYAN, boxShadow: `0 0 6px ${CYAN}` }} />
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
          <div key={item.id} className="rounded-lg p-4" style={{ border: `1px solid ${VIOLET}20`, backgroundColor: `${VIOLET}05` }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold" style={{ color: CYAN }}>{item.institution}</h3>
              <span className="text-xs" style={{ color: TEXT_DIM }}>{item.startDate} - {item.endDate}</span>
            </div>
            <p className="text-sm" style={{ color: TEXT }}>{item.degree}{item.field ? ` in ${item.field}` : ''}</p>
            {item.gpa && <p className="text-xs" style={{ color: VIOLET }}>GPA: {item.gpa}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: TEXT }}>
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: VIOLET, boxShadow: `0 0 6px ${VIOLET}` }} />
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
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: VIOLET }}>{cat.name}</p>
            <div className="flex flex-wrap gap-1.5">
              {(cat.skills || []).map((skill: string, i: number) => (
                <span
                  key={i}
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{
                    color: i % 2 === 0 ? CYAN : VIOLET,
                    border: `1px solid ${i % 2 === 0 ? CYAN : VIOLET}40`,
                    backgroundColor: `${i % 2 === 0 ? CYAN : VIOLET}10`,
                  }}
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
          <div key={item.id} className="rounded-lg p-4" style={{ border: `1px solid ${CYAN}20`, backgroundColor: `${CYAN}05` }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold" style={{ color: CYAN }}>{item.name}</h3>
              {item.startDate && (
                <span className="text-xs" style={{ color: TEXT_DIM }}>
                  {item.startDate}{item.endDate ? ` - ${item.endDate}` : ''}
                </span>
              )}
            </div>
            {item.description && <p className="mt-0.5 text-sm" style={{ color: TEXT }}>{item.description}</p>}
            {item.technologies?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {item.technologies.map((t: string, i: number) => (
                  <span key={i} className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ color: BG, backgroundColor: i % 2 === 0 ? CYAN : VIOLET, boxShadow: `0 0 6px ${i % 2 === 0 ? CYAN : VIOLET}40` }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
            {item.highlights?.length > 0 && (
              <ul className="mt-1.5 space-y-0.5">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: TEXT }}>
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: CYAN, boxShadow: `0 0 6px ${CYAN}` }} />
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
          <div key={item.id} className="rounded-lg px-4 py-2" style={{ border: `1px solid ${VIOLET}30`, backgroundColor: `${VIOLET}08` }}>
            <p className="text-sm font-bold" style={{ color: CYAN }}>{item.name}</p>
            <p className="text-xs" style={{ color: TEXT_DIM }}>{item.issuer}{item.date ? ` | ${item.date}` : ''}</p>
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
          <div key={item.id} className="flex items-center gap-2 rounded-full px-4 py-1.5" style={{ border: `1px solid ${CYAN}30` }}>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CYAN, boxShadow: `0 0 6px ${CYAN}` }} />
            <span className="text-sm font-medium" style={{ color: CYAN }}>{item.language}</span>
            <span className="text-xs" style={{ color: TEXT_DIM }}>{item.proficiency}</span>
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
          <div key={item.id} className="rounded-lg p-4" style={{ border: `1px solid ${CYAN}20`, backgroundColor: `${CYAN}05` }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold" style={{ color: CYAN }}>{item.title}</h3>
              {item.date && <span className="text-xs" style={{ color: TEXT_DIM }}>{item.date}</span>}
            </div>
            {item.subtitle && <p className="text-sm" style={{ color: VIOLET }}>{item.subtitle}</p>}
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
          <div key={item.id} className="rounded-lg p-3" style={{ border: `1px solid ${CYAN}20` }}>
            <span className="text-sm font-medium" style={{ color: CYAN }}>{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm" style={{ color: TEXT }}>{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
