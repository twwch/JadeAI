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

// Left sidebar section types
const LEFT_TYPES = new Set(['skills', 'languages', 'certifications', 'custom']);

export function TwoColumnTemplate({ resume }: { resume: Resume }) {
  const personalInfo = resume.sections.find((s) => s.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  const visibleSections = resume.sections.filter(
    (s) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s)
  );

  const leftSections = visibleSections.filter((s) => LEFT_TYPES.has(s.type));
  const rightSections = visibleSections.filter((s) => !LEFT_TYPES.has(s.type));

  return (
    <div className="mx-auto flex max-w-[210mm] overflow-hidden bg-white shadow-lg" style={{ fontFamily: 'Inter, sans-serif', minHeight: '297mm' }}>
      {/* Left Column */}
      <div className="w-[35%] shrink-0 p-6 text-white" style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)' }}>
        {/* Avatar & Name */}
        <div className="mb-6 text-center">
          {pi.avatar && (
            <div className="mx-auto mb-3 h-24 w-24 overflow-hidden rounded-full border-3 border-white/20">
              <img src={pi.avatar} alt="" className="h-full w-full object-cover" />
            </div>
          )}
          <h1 className="text-xl font-bold tracking-tight text-white">{pi.fullName || 'Your Name'}</h1>
          {pi.jobTitle && <p className="mt-1 text-sm font-light text-zinc-300">{pi.jobTitle}</p>}
        </div>

        {/* Contact Info */}
        <div className="mb-6 space-y-1.5 text-xs">
          {pi.email && (
            <div className="flex items-start gap-2 text-zinc-300">
              <span className="shrink-0 text-zinc-400">Email:</span>
              <span className="break-all">{pi.email}</span>
            </div>
          )}
          {pi.phone && (
            <div className="flex items-start gap-2 text-zinc-300">
              <span className="shrink-0 text-zinc-400">Phone:</span>
              <span>{pi.phone}</span>
            </div>
          )}
          {pi.location && (
            <div className="flex items-start gap-2 text-zinc-300">
              <span className="shrink-0 text-zinc-400">Location:</span>
              <span>{pi.location}</span>
            </div>
          )}
          {pi.website && (
            <div className="flex items-start gap-2 text-zinc-300">
              <span className="shrink-0 text-zinc-400">Web:</span>
              <span className="break-all">{pi.website}</span>
            </div>
          )}
          {pi.linkedin && (
            <div className="flex items-start gap-2 text-zinc-300">
              <span className="shrink-0 text-zinc-400">LinkedIn:</span>
              <span className="break-all">{pi.linkedin}</span>
            </div>
          )}
          {pi.github && (
            <div className="flex items-start gap-2 text-zinc-300">
              <span className="shrink-0 text-zinc-400">GitHub:</span>
              <span className="break-all">{pi.github}</span>
            </div>
          )}
        </div>

        {/* Left Sections */}
        {leftSections.map((section) => (
          <div key={section.id} className="mb-5" data-section>
            <h2 className="mb-2 border-b border-white/20 pb-1 text-xs font-bold uppercase tracking-wider text-white">
              {section.title}
            </h2>
            <LeftSectionContent section={section} />
          </div>
        ))}
      </div>

      {/* Right Column */}
      <div className="flex-1 p-6">
        {rightSections.map((section) => (
          <div key={section.id} className="mb-5" data-section>
            <h2 className="mb-2 border-b-2 pb-1 text-sm font-bold uppercase tracking-wider" style={{ color: '#1a1a2e', borderColor: '#1a1a2e' }}>
              {section.title}
            </h2>
            <RightSectionContent section={section} />
          </div>
        ))}
      </div>
    </div>
  );
}

function LeftSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'skills') {
    const categories = (content as SkillsContent).categories || [];
    return (
      <div className="space-y-2">
        {categories.map((cat: any) => (
          <div key={cat.id}>
            <p className="text-xs font-semibold text-zinc-200">{cat.name}</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {(cat.skills || []).map((skill: string, i: number) => (
                <span key={i} className="rounded-sm bg-white/10 px-1.5 py-0.5 text-[10px] text-zinc-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'languages') {
    const items = (content as LanguagesContent).items || [];
    return (
      <div className="space-y-1.5">
        {items.map((item: any) => (
          <div key={item.id} className="flex items-center justify-between text-xs">
            <span className="text-zinc-200">{item.language}</span>
            <span className="text-zinc-400">{item.proficiency}</span>
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
          <div key={item.id}>
            <p className="text-xs font-semibold text-zinc-200">{item.name}</p>
            <p className="text-[10px] text-zinc-400">{item.issuer}{item.date ? ` (${item.date})` : ''}</p>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'custom') {
    const items = (content as CustomContent).items || [];
    return (
      <div className="space-y-1.5">
        {items.map((item: any) => (
          <div key={item.id}>
            <p className="text-xs font-semibold text-zinc-200">{item.title}</p>
            {item.subtitle && <p className="text-[10px] text-zinc-400">{item.subtitle}</p>}
            {item.description && <p className="text-[10px] text-zinc-400">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  // Generic fallback
  if (content.items) {
    return (
      <div className="space-y-1.5">
        {content.items.map((item: any) => (
          <div key={item.id}>
            <span className="text-xs font-medium text-zinc-200">{item.name || item.title || item.language}</span>
            {item.description && <p className="text-[10px] text-zinc-400">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}

function RightSectionContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'summary') {
    return <p className="text-sm leading-relaxed text-zinc-600">{(content as SummaryContent).text}</p>;
  }

  if (section.type === 'work_experience') {
    const items = (content as WorkExperienceContent).items || [];
    return (
      <div className="space-y-3">
        {items.map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-sm font-semibold text-zinc-800">{item.position}</span>
                {item.company && <span className="text-sm text-zinc-500"> | {item.company}</span>}
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
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-zinc-800">{item.institution}</span>
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

  if (section.type === 'projects') {
    const items = (content as ProjectsContent).items || [];
    return (
      <div className="space-y-3">
        {items.map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-zinc-800">{item.name}</span>
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
                  <span key={i} className="rounded-sm bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500">
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

  // Fallback for any section type that ends up on the right
  if (section.type === 'certifications') {
    const items = (content as CertificationsContent).items || [];
    return (
      <div className="space-y-1.5">
        {items.map((item: any) => (
          <div key={item.id} className="flex items-baseline justify-between text-sm">
            <div>
              <span className="font-semibold text-zinc-800">{item.name}</span>
              {item.issuer && <span className="text-zinc-600"> — {item.issuer}</span>}
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
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        {items.map((item: any) => (
          <span key={item.id} className="text-sm">
            <span className="font-medium text-zinc-800">{item.language}</span>
            <span className="text-zinc-500"> — {item.proficiency}</span>
          </span>
        ))}
      </div>
    );
  }

  if (section.type === 'custom') {
    const items = (content as CustomContent).items || [];
    return (
      <div className="space-y-2">
        {items.map((item: any) => (
          <div key={item.id}>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-zinc-800">{item.title}</span>
              {item.date && <span className="text-xs text-zinc-400">{item.date}</span>}
            </div>
            {item.subtitle && <p className="text-sm text-zinc-500">{item.subtitle}</p>}
            {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}
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
          <div key={item.id}>
            <span className="text-sm font-medium text-zinc-700">{item.name || item.title || item.language}</span>
            {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
