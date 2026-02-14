import type {
  SummaryContent,
  WorkExperienceContent,
  EducationContent,
  SkillsContent,
  ProjectsContent,
  CertificationsContent,
  LanguagesContent,
  CustomContent,
} from '@/types/resume';
import { esc, getPersonalInfo, visibleSections, type ResumeWithSections, type Section } from '../utils';
import { buildClassicSectionContent } from './classic';

const PRIMARY = '#0f172a';
const ACCENT = '#0891b2';
const GRID_LINE = '#e2e8f0';
const BODY_TEXT = '#334155';
const MUTED = '#64748b';

function buildScientistSectionContent(section: Section, sectionIdx: number): string {
  const c = section.content as any;

  if (section.type === 'summary') {
    return `<p class="text-sm italic leading-relaxed" style="color:${BODY_TEXT}">${esc((c as SummaryContent).text)}</p>`;
  }

  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any, idx: number) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-xs font-bold" style="color:${ACCENT}">[${idx + 1}]</span><span class="ml-1.5 text-sm font-bold" style="color:${PRIMARY}">${esc(it.position)}</span>${it.company ? `<span class="text-sm" style="color:${MUTED}">, ${esc(it.company)}</span>` : ''}</div><span class="shrink-0 text-xs" style="color:${MUTED}">${esc(it.startDate)} - ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.description ? `<p class="mt-1 pl-6 text-sm" style="color:${BODY_TEXT}">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 pl-6 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm" style="color:${BODY_TEXT}"><span class="mt-1.5 shrink-0 text-xs" style="color:${ACCENT}">-</span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any, idx: number) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-xs font-bold" style="color:${ACCENT}">[${idx + 1}]</span><span class="ml-1.5 text-sm font-bold" style="color:${PRIMARY}">${esc(it.degree)}${it.field ? `, ${esc(it.field)}` : ''}</span>${it.institution ? `<span class="text-sm" style="color:${MUTED}">, ${esc(it.institution)}</span>` : ''}</div><span class="shrink-0 text-xs" style="color:${MUTED}">${esc(it.startDate)} - ${esc(it.endDate)}</span></div>
      ${it.gpa ? `<p class="pl-6 text-xs" style="color:${MUTED}">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 pl-6 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm" style="color:${BODY_TEXT}"><span class="mt-1.5 shrink-0 text-xs" style="color:${ACCENT}">-</span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'skills') {
    return `<div class="space-y-1.5">${((c as SkillsContent).categories || []).map((cat: any) =>
      `<div class="text-sm"><span class="font-bold italic" style="color:${PRIMARY}">${esc(cat.name)}: </span><span style="color:${BODY_TEXT}">${esc((cat.skills || []).join('; '))}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'projects') {
    return `<div class="space-y-3">${((c as ProjectsContent).items || []).map((it: any, idx: number) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-xs font-bold" style="color:${ACCENT}">[${idx + 1}]</span><span class="ml-1.5 text-sm font-bold" style="color:${PRIMARY}">${esc(it.name)}</span></div>${it.startDate ? `<span class="shrink-0 text-xs" style="color:${MUTED}">${esc(it.startDate)}${it.endDate ? ` - ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-1 pl-6 text-sm" style="color:${BODY_TEXT}">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<p class="pl-6 text-xs italic" style="color:${MUTED}">Methods/Tools: ${esc(it.technologies.join(', '))}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 pl-6 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm" style="color:${BODY_TEXT}"><span class="mt-1.5 shrink-0 text-xs" style="color:${ACCENT}">-</span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'certifications') {
    return `<div class="space-y-1.5">${((c as CertificationsContent).items || []).map((it: any, idx: number) =>
      `<div class="text-sm"><span class="text-xs font-bold" style="color:${ACCENT}">[${idx + 1}]</span><span class="ml-1.5 font-medium" style="color:${PRIMARY}">${esc(it.name)}</span><span style="color:${MUTED}">, ${esc(it.issuer)}, ${esc(it.date)}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'languages') {
    return `<div class="space-y-1">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div class="text-sm"><span class="font-bold italic" style="color:${PRIMARY}">${esc(it.language)}</span><span style="color:${MUTED}"> — ${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'custom') {
    return `<div class="space-y-3">${((c as CustomContent).items || []).map((it: any, idx: number) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-xs font-bold" style="color:${ACCENT}">[${idx + 1}]</span><span class="ml-1.5 text-sm font-bold" style="color:${PRIMARY}">${esc(it.title)}</span>${it.subtitle ? `<span class="text-sm" style="color:${MUTED}">, ${esc(it.subtitle)}</span>` : ''}</div>${it.date ? `<span class="shrink-0 text-xs" style="color:${MUTED}">${esc(it.date)}</span>` : ''}</div>
      ${it.description ? `<p class="mt-0.5 pl-6 text-sm" style="color:${BODY_TEXT}">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }

  // Generic items fallback
  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div><span class="text-sm font-medium" style="color:${PRIMARY}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm" style="color:${BODY_TEXT}">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }

  return buildClassicSectionContent(section);
}

export function buildScientistHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);

  return `<div class="mx-auto max-w-[210mm] bg-white p-10 shadow-lg" style="font-family:Georgia,serif">
    <div class="mb-6 text-center">
      ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="mx-auto mb-3 h-14 w-14 rounded-full object-cover" style="border:2px solid ${ACCENT}"/>` : ''}
      <h1 class="text-2xl font-bold" style="color:${PRIMARY}">${esc(pi.fullName || 'Your Name')}</h1>
      ${pi.jobTitle ? `<p class="mt-1 text-sm italic" style="color:${ACCENT}">${esc(pi.jobTitle)}</p>` : ''}
      ${contacts.length ? `<div class="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs" style="color:${MUTED}">${contacts.map(ct => `<span>${esc(ct)}</span>`).join('')}</div>` : ''}
    </div>
    <div class="mb-6 h-px w-full" style="background-color:${PRIMARY}"></div>
    ${sections.map((s, idx) => `<div class="mb-6" data-section>
      <div class="mb-2 flex items-baseline gap-2"><span class="text-sm font-bold" style="color:${ACCENT}">${idx + 1}.</span><h2 class="text-sm font-bold uppercase tracking-wider" style="color:${PRIMARY}">${esc(s.title)}</h2></div>
      <div class="h-px w-full" style="background-color:${GRID_LINE}"></div>
      <div class="mt-2">${buildScientistSectionContent(s, idx)}</div>
    </div>`).join('')}
    <div class="mt-8 h-px w-full" style="background-color:${PRIMARY}"></div>
  </div>`;
}
