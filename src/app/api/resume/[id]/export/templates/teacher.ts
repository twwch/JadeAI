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

const PRIMARY = '#9a3412';
const ACCENT = '#ea580c';
const WARM_BG = '#fff7ed';
const BODY_TEXT = '#374151';
const MUTED = '#78716c';
const TAG_BG = '#fed7aa';

function buildTeacherSectionContent(section: Section): string {
  const c = section.content as any;

  if (section.type === 'summary') {
    return `<p class="rounded-lg p-3 text-sm leading-relaxed" style="color:${BODY_TEXT};background-color:${WARM_BG}">${esc((c as SummaryContent).text)}</p>`;
  }

  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div class="rounded-lg border-l-3 p-3" style="border-color:${ACCENT};background-color:${WARM_BG}">
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.position)}</span>${it.company ? `<span class="text-sm" style="color:${ACCENT}"> at ${esc(it.company)}</span>` : ''}</div><span class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium" style="background-color:${TAG_BG};color:${PRIMARY}">${esc(it.startDate)} - ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.description ? `<p class="mt-1 text-sm" style="color:${BODY_TEXT}">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1.5 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm" style="color:${BODY_TEXT}"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style="background-color:${ACCENT}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div class="rounded-lg border-l-3 p-3" style="border-color:${ACCENT};background-color:${WARM_BG}">
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</span>${it.institution ? `<span class="text-sm" style="color:${MUTED}"> — ${esc(it.institution)}</span>` : ''}</div><span class="shrink-0 text-xs" style="color:${MUTED}">${esc(it.startDate)} - ${esc(it.endDate)}</span></div>
      ${it.gpa ? `<p class="text-xs" style="color:${MUTED}">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm" style="color:${BODY_TEXT}"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style="background-color:${ACCENT}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'skills') {
    return `<div class="flex flex-wrap gap-2">${((c as SkillsContent).categories || []).map((cat: any) =>
      `<div class="rounded-lg p-2.5" style="background-color:${WARM_BG}"><span class="text-xs font-bold" style="color:${PRIMARY}">${esc(cat.name)}</span><div class="mt-1 flex flex-wrap gap-1">${(cat.skills || []).map((skill: string) => `<span class="rounded-full px-2 py-0.5 text-[10px]" style="background-color:${TAG_BG};color:${PRIMARY}">${esc(skill)}</span>`).join('')}</div></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'projects') {
    return `<div class="space-y-3">${((c as ProjectsContent).items || []).map((it: any) => `<div class="rounded-lg border-l-3 p-3" style="border-color:${ACCENT};background-color:${WARM_BG}">
      <div class="flex items-baseline justify-between"><span class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.name)}</span>${it.startDate ? `<span class="shrink-0 text-xs" style="color:${MUTED}">${esc(it.startDate)}${it.endDate ? ` - ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-1 text-sm" style="color:${BODY_TEXT}">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<div class="mt-1 flex flex-wrap gap-1">${it.technologies.map((t: string) => `<span class="rounded-full px-2 py-0.5 text-[10px]" style="background-color:${TAG_BG};color:${PRIMARY}">${esc(t)}</span>`).join('')}</div>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1.5 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm" style="color:${BODY_TEXT}"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style="background-color:${ACCENT}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'certifications') {
    return `<div class="space-y-1.5">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div class="flex items-center gap-2"><span class="h-1.5 w-1.5 shrink-0 rounded-full" style="background-color:${ACCENT}"></span><span class="text-sm font-medium" style="color:${PRIMARY}">${esc(it.name)}</span><span class="text-sm" style="color:${MUTED}"> — ${esc(it.issuer)} (${esc(it.date)})</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'languages') {
    return `<div class="flex flex-wrap gap-2">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div class="rounded-full px-3 py-1 text-sm" style="background-color:${WARM_BG}"><span class="font-medium" style="color:${PRIMARY}">${esc(it.language)}</span><span style="color:${MUTED}"> — ${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'custom') {
    return `<div class="space-y-3">${((c as CustomContent).items || []).map((it: any) => `<div class="rounded-lg border-l-3 p-3" style="border-color:${ACCENT};background-color:${WARM_BG}">
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.title)}</span>${it.subtitle ? `<span class="text-sm" style="color:${MUTED}"> — ${esc(it.subtitle)}</span>` : ''}</div>${it.date ? `<span class="shrink-0 text-xs" style="color:${MUTED}">${esc(it.date)}</span>` : ''}</div>
      ${it.description ? `<p class="mt-1 text-sm" style="color:${BODY_TEXT}">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }

  // Generic items fallback
  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div class="flex items-center gap-2"><span class="h-1.5 w-1.5 shrink-0 rounded-full" style="background-color:${ACCENT}"></span><span class="text-sm font-medium" style="color:${PRIMARY}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<span class="text-sm" style="color:${BODY_TEXT}"> — ${esc(it.description)}</span>` : ''}</div>`).join('')}</div>`;
  }

  return buildClassicSectionContent(section);
}

export function buildTeacherHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);

  return `<div class="mx-auto max-w-[210mm] bg-white p-10 shadow-lg" style="font-family:Inter,sans-serif">
    <div class="mb-6 flex items-center gap-5">
      ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="h-18 w-18 shrink-0 rounded-full object-cover" style="border:3px solid ${ACCENT}"/>` : ''}
      <div class="flex-1">
        <h1 class="text-2xl font-bold" style="color:${PRIMARY}">${esc(pi.fullName || 'Your Name')}</h1>
        ${pi.jobTitle ? `<p class="mt-1 inline-block rounded-full px-3 py-0.5 text-sm font-medium text-white" style="background-color:${ACCENT}">${esc(pi.jobTitle)}</p>` : ''}
        ${contacts.length ? `<div class="mt-2 flex flex-wrap gap-3 text-xs" style="color:${MUTED}">${contacts.map(ct => `<span>${esc(ct)}</span>`).join('')}</div>` : ''}
      </div>
    </div>
    <div class="mb-6 h-0.5 w-full rounded-full" style="background-color:${ACCENT};opacity:0.3"></div>
    ${sections.map(s => `<div class="mb-6" data-section>
      <h2 class="mb-3 inline-block rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider text-white" style="background-color:${PRIMARY}">${esc(s.title)}</h2>
      ${buildTeacherSectionContent(s)}
    </div>`).join('')}
  </div>`;
}
