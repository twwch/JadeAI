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

const PRIMARY = '#37352f';
const ACCENT = '#2383e2';
const SUBTLE_BG = '#f7f6f3';

export function BlocksTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);

  return (
    <div className="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header - clean Notion-like */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          {pi.avatar && (
            <img src={pi.avatar} alt="" className="h-14 w-14 shrink-0 rounded-md object-cover" />
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold" style={{ color: PRIMARY }}>{pi.fullName || 'Your Name'}</h1>
            {pi.jobTitle && (
              <p className="mt-0.5 text-sm" style={{ color: '#787774' }}>{pi.jobTitle}</p>
            )}
          </div>
        </div>
        {contacts.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 text-xs" style={{ color: '#787774' }}>
            {contacts.map((c, i) => (
              <span key={i} className="rounded-sm px-2 py-0.5" style={{ backgroundColor: SUBTLE_BG }}>
                {c}
              </span>
            ))}
          </div>
        )}
        <div className="mt-4 h-px w-full" style={{ backgroundColor: '#e3e2de' }} />
      </div>

      {/* Sections */}
      {resume.sections
        .filter((s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s))
        .map((section) => (
          <div key={section.id} className="mb-5" data-section>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm" style={{ color: '#9b9a97' }}>&#9654;</span>
              <h2 className="text-sm font-semibold" style={{ color: PRIMARY }}>
                {section.title}
              </h2>
            </div>
            <div className="ml-5">
              <BlocksSectionContent section={section} />
            </div>
          </div>
        ))}
    </div>
  );
}

function BlocksSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return (
      <div className="rounded-md p-3" style={{ backgroundColor: SUBTLE_BG }}>
        <p className="text-sm leading-relaxed" style={{ color: PRIMARY }}>{(content as SummaryContent).text}</p>
      </div>
    );
  }

  if (section.type === 'work_experience') {
    const items = (content as WorkExperienceContent).items || [];
    return (
      <div className="space-y-3">
        {items.map((item: any) => (
          <div key={item.id} className="rounded-md border p-3" style={{ borderColor: '#e3e2de' }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold" style={{ color: PRIMARY }}>{item.position}</h3>
              <span className="shrink-0 text-xs" style={{ color: '#9b9a97' }}>
                {item.startDate} - {item.current ? 'Present' : item.endDate}
              </span>
            </div>
            {item.company && <p className="text-sm" style={{ color: ACCENT }}>{item.company}</p>}
            {item.description && <p className="mt-1 text-sm" style={{ color: '#787774' }}>{item.description}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 list-disc pl-4">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="text-sm" style={{ color: '#787774' }}>{h}</li>
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
          <div key={item.id} className="rounded-md border p-3" style={{ borderColor: '#e3e2de' }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold" style={{ color: PRIMARY }}>{item.institution}</h3>
              <span className="text-xs" style={{ color: '#9b9a97' }}>{item.startDate} - {item.endDate}</span>
            </div>
            <p className="text-sm" style={{ color: '#787774' }}>{item.degree}{item.field ? ` in ${item.field}` : ''}</p>
            {item.gpa && <p className="text-xs" style={{ color: '#9b9a97' }}>GPA: {item.gpa}</p>}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 list-disc pl-4">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="text-sm" style={{ color: '#787774' }}>{h}</li>
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
      <div className="overflow-hidden rounded-md border" style={{ borderColor: '#e3e2de' }}>
        <table className="w-full text-sm">
          <tbody>
            {categories.map((cat: any) => (
              <tr key={cat.id} style={{ borderBottom: '1px solid #e3e2de' }}>
                <td className="w-28 shrink-0 px-3 py-2 font-medium" style={{ color: PRIMARY, backgroundColor: SUBTLE_BG }}>
                  {cat.name}
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {(cat.skills || []).map((skill: string, i: number) => (
                      <span key={i} className="rounded-sm px-2 py-0.5 text-xs" style={{ backgroundColor: `${ACCENT}12`, color: ACCENT }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (section.type === 'projects') {
    const items = (content as ProjectsContent).items || [];
    return (
      <div className="space-y-3">
        {items.map((item: any) => (
          <div key={item.id} className="rounded-md border p-3" style={{ borderColor: '#e3e2de' }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold" style={{ color: ACCENT }}>{item.name}</h3>
              {item.startDate && (
                <span className="text-xs" style={{ color: '#9b9a97' }}>
                  {item.startDate}{item.endDate ? ` - ${item.endDate}` : ''}
                </span>
              )}
            </div>
            {item.description && <p className="mt-1 text-sm" style={{ color: '#787774' }}>{item.description}</p>}
            {item.technologies?.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {item.technologies.map((t: string, i: number) => (
                  <span key={i} className="rounded-sm px-1.5 py-0.5 text-[10px]" style={{ backgroundColor: SUBTLE_BG, color: '#787774' }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
            {item.highlights?.length > 0 && (
              <ul className="mt-1 list-disc pl-4">
                {item.highlights.map((h: string, i: number) => (
                  <li key={i} className="text-sm" style={{ color: '#787774' }}>{h}</li>
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
      <div className="overflow-hidden rounded-md border" style={{ borderColor: '#e3e2de' }}>
        {items.map((item: any, idx: number) => (
          <div key={item.id} className="flex items-baseline justify-between px-3 py-2" style={{ borderBottom: idx < items.length - 1 ? '1px solid #e3e2de' : 'none' }}>
            <span className="text-sm font-medium" style={{ color: PRIMARY }}>{item.name}</span>
            <span className="text-xs" style={{ color: '#9b9a97' }}>{item.issuer}{item.date ? ` | ${item.date}` : ''}</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'languages') {
    const items = (content as LanguagesContent).items || [];
    return (
      <div className="overflow-hidden rounded-md border" style={{ borderColor: '#e3e2de' }}>
        <table className="w-full text-sm">
          <tbody>
            {items.map((item: any) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #e3e2de' }}>
                <td className="px-3 py-2 font-medium" style={{ color: PRIMARY }}>{item.language}</td>
                <td className="px-3 py-2 text-right" style={{ color: '#9b9a97' }}>{item.proficiency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (section.type === 'custom') {
    const items = (content as CustomContent).items || [];
    return (
      <div className="space-y-3">
        {items.map((item: any) => (
          <div key={item.id} className="rounded-md border p-3" style={{ borderColor: '#e3e2de' }}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold" style={{ color: PRIMARY }}>{item.title}</h3>
              {item.date && <span className="text-xs" style={{ color: '#9b9a97' }}>{item.date}</span>}
            </div>
            {item.subtitle && <p className="text-sm" style={{ color: '#9b9a97' }}>{item.subtitle}</p>}
            {item.description && <p className="mt-1 text-sm" style={{ color: '#787774' }}>{item.description}</p>}
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
          <div key={item.id} className="rounded-md border px-3 py-2" style={{ borderColor: '#e3e2de' }}>
            <span className="text-sm font-medium" style={{ color: PRIMARY }}>{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm" style={{ color: '#787774' }}>{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
