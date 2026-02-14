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

const PRIMARY = '#1e293b';
const TILE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

function getTileColor(idx: number): string {
  return TILE_COLORS[idx % TILE_COLORS.length];
}

function getTileBg(idx: number): string {
  const bgs = ['#eff6ff', '#ecfdf5', '#fffbeb', '#f5f3ff'];
  return bgs[idx % bgs.length];
}

export function MosaicTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);

  const filteredSections = resume.sections.filter(
    (s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s)
  );

  return (
    <div className="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="mb-6 rounded-lg p-5" style={{ background: `linear-gradient(135deg, ${TILE_COLORS[0]}15, ${TILE_COLORS[3]}15)` }}>
        <div className="flex items-center gap-4">
          {pi.avatar && (
            <img src={pi.avatar} alt="" className="h-18 w-18 shrink-0 rounded-lg object-cover" style={{ border: `3px solid ${TILE_COLORS[0]}` }} />
          )}
          <div>
            <h1 className="text-2xl font-bold" style={{ color: PRIMARY }}>{pi.fullName || 'Your Name'}</h1>
            {pi.jobTitle && <p className="mt-1 text-sm font-medium" style={{ color: TILE_COLORS[3] }}>{pi.jobTitle}</p>}
            {contacts.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                {contacts.map((c, i) => (
                  <span key={i} className="rounded-full px-2 py-0.5" style={{ backgroundColor: getTileBg(i), color: getTileColor(i) }}>
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mosaic sections */}
      {filteredSections.map((section, idx) => {
        const color = getTileColor(idx);
        const bg = getTileBg(idx);
        return (
          <div key={section.id} className="mb-4" data-section>
            <div className="rounded-lg p-4" style={{ backgroundColor: bg }}>
              <div className="mb-2 flex items-center gap-2">
                <div className="h-5 w-5 rounded" style={{ backgroundColor: color, opacity: 0.2 }} />
                <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color }}>
                  {section.title}
                </h2>
              </div>
              <MosaicSectionContent section={section} color={color} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MosaicSectionContent({ section, color }: { section: any; color: string }) {
  const content = section.content;

  if (section.type === 'summary') {
    return <p className="text-sm leading-relaxed text-zinc-600">{(content as SummaryContent).text}</p>;
  }

  if (section.type === 'work_experience') {
    const items = (content as WorkExperienceContent).items || [];
    return (
      <div className="space-y-3">
        {items.map((item: any) => (
          <div key={item.id} className="rounded-md bg-white p-3 shadow-sm">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-semibold" style={{ color: PRIMARY }}>{item.position}</span>
                {item.company && <span className="text-sm" style={{ color }}> | {item.company}</span>}
              </div>
              <span className="shrink-0 text-xs text-zinc-400">{item.startDate} – {item.current ? 'Present' : item.endDate}</span>
            </div>
            {item.description && <p className="mt-1 text-sm text-zinc-600">{item.description}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 list-disc pl-4">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="text-sm text-zinc-600">{h}</li>
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
          <div key={item.id} className="rounded-md bg-white p-3 shadow-sm">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold" style={{ color: PRIMARY }}>{item.institution}</span>
              <span className="shrink-0 text-xs text-zinc-400">{item.startDate} – {item.endDate}</span>
            </div>
            <p className="text-sm text-zinc-600">{item.degree}{item.field ? ` in ${item.field}` : ''}</p>
            {item.gpa && <p className="text-xs text-zinc-500">GPA: {item.gpa}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 list-disc pl-4">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="text-sm text-zinc-600">{h}</li>
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
      <div className="space-y-2">
        {categories.map((cat: any) => (
          <div key={cat.id}>
            <p className="mb-1 text-xs font-semibold text-zinc-500">{cat.name}</p>
            <div className="flex flex-wrap gap-1.5">
              {(cat.skills || []).map((skill: string, i: number) => (
                <span key={i} className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: color }}>
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
          <div key={item.id} className="rounded-md bg-white p-3 shadow-sm">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold" style={{ color }}>{item.name}</span>
              {item.startDate && (
                <span className="shrink-0 text-xs text-zinc-400">
                  {item.startDate}{item.endDate ? ` – ${item.endDate}` : ''}
                </span>
              )}
            </div>
            {item.description && <p className="mt-1 text-sm text-zinc-600">{item.description}</p>}
            {item.technologies?.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {item.technologies.map((t: string, i: number) => (
                  <span key={i} className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600">
                    {t}
                  </span>
                ))}
              </div>
            )}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 list-disc pl-4">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="text-sm text-zinc-600">{h}</li>
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
      <div className="space-y-1.5">
        {items.map((item: any) => (
          <div key={item.id} className="flex items-baseline justify-between">
            <div>
              <span className="text-sm font-semibold" style={{ color: PRIMARY }}>{item.name}</span>
              {item.issuer && <span className="text-sm text-zinc-600"> — {item.issuer}</span>}
            </div>
            {item.date && <span className="text-xs text-zinc-400">{item.date}</span>}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'languages') {
    const items = (content as LanguagesContent).items || [];
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item: any) => (
          <div key={item.id} className="flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-sm font-medium" style={{ color: PRIMARY }}>{item.language}</span>
            <span className="text-xs text-zinc-400">{item.proficiency}</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'custom') {
    const items = (content as CustomContent).items || [];
    return (
      <div className="space-y-2">
        {items.map((item: any) => (
          <div key={item.id} className="rounded-md bg-white p-3 shadow-sm">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold" style={{ color: PRIMARY }}>{item.title}</span>
              {item.date && <span className="text-xs text-zinc-400">{item.date}</span>}
            </div>
            {item.subtitle && <p className="text-sm text-zinc-500">{item.subtitle}</p>}
            {item.description && <p className="mt-1 text-sm text-zinc-600">{item.description}</p>}
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
          <div key={item.id} className="rounded-md bg-white p-3 shadow-sm">
            <span className="text-sm font-medium" style={{ color: PRIMARY }}>{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
