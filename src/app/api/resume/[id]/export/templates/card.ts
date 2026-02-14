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
import { esc, getPersonalInfo, visibleSections, buildHighlights, type ResumeWithSections, type Section } from '../utils';

const PRIMARY = '#18181b';
const ACCENT = '#6366f1';
const CARD_BG = '#fafafa';

function buildCardSectionContent(section: Section): string {
  const c = section.content as any;

  if (section.type === 'summary') {
    return `<p class="text-sm leading-relaxed text-zinc-600">${esc((c as SummaryContent).text)}</p>`;
  }
  if (section.type === 'work_experience') {
    return `<div class="space-y-3">${((c as WorkExperienceContent).items || []).map((it: any) => `<div class="rounded-md bg-white p-3" style="border:1px solid #f4f4f5">
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-semibold" style="color:${PRIMARY}">${esc(it.position)}</span>${it.company ? `<span class="text-sm" style="color:${ACCENT}"> | ${esc(it.company)}</span>` : ''}</div><span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)} – ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div class="rounded-md bg-white p-3" style="border:1px solid #f4f4f5">
      <div class="flex items-baseline justify-between"><span class="text-sm font-semibold" style="color:${PRIMARY}">${esc(it.institution)}</span><span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)} – ${esc(it.endDate)}</span></div>
      <p class="text-sm text-zinc-600">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</p>
      ${it.gpa ? `<p class="text-xs text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'skills') {
    return `<div class="space-y-2">${((c as SkillsContent).categories || []).map((cat: any) => `<div>
      <p class="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">${esc(cat.name)}</p>
      <div class="flex flex-wrap gap-1.5">${(cat.skills || []).map((s: string) => `<span class="rounded-full px-2.5 py-0.5 text-xs font-medium text-white" style="background-color:${ACCENT}">${esc(s)}</span>`).join('')}</div>
    </div>`).join('')}</div>`;
  }
  if (section.type === 'projects') {
    return `<div class="space-y-3">${((c as ProjectsContent).items || []).map((it: any) => `<div class="rounded-md bg-white p-3" style="border:1px solid #f4f4f5">
      <div class="flex items-baseline justify-between"><span class="text-sm font-semibold" style="color:${ACCENT}">${esc(it.name)}</span>${it.startDate ? `<span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)}${it.endDate ? ` – ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<div class="mt-1 flex flex-wrap gap-1">${it.technologies.map((t: string) => `<span class="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600">${esc(t)}</span>`).join('')}</div>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'certifications') {
    return `<div class="space-y-2">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div class="flex items-baseline justify-between"><div><span class="text-sm font-semibold" style="color:${PRIMARY}">${esc(it.name)}</span>${it.issuer ? `<span class="text-sm text-zinc-600"> — ${esc(it.issuer)}</span>` : ''}</div>${it.date ? `<span class="text-xs text-zinc-400">${esc(it.date)}</span>` : ''}</div>`
    ).join('')}</div>`;
  }
  if (section.type === 'languages') {
    return `<div class="flex flex-wrap gap-3">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div class="flex items-center gap-2 rounded-full bg-white px-3 py-1" style="border:1px solid #e4e4e7"><span class="h-2 w-2 rounded-full" style="background-color:${ACCENT}"></span><span class="text-sm font-medium" style="color:${PRIMARY}">${esc(it.language)}</span><span class="text-xs text-zinc-400">${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }
  if (section.type === 'custom') {
    return `<div class="space-y-2">${((c as CustomContent).items || []).map((it: any) => `<div class="rounded-md bg-white p-3" style="border:1px solid #f4f4f5">
      <div class="flex items-baseline justify-between"><span class="text-sm font-semibold" style="color:${PRIMARY}">${esc(it.title)}</span>${it.date ? `<span class="text-xs text-zinc-400">${esc(it.date)}</span>` : ''}</div>
      ${it.subtitle ? `<p class="text-sm text-zinc-500">${esc(it.subtitle)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }
  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div class="rounded-md bg-white p-3" style="border:1px solid #f4f4f5"><span class="text-sm font-medium" style="color:${PRIMARY}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm text-zinc-600">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }
  return '';
}

export function buildCardHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);

  return `<div class="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style="font-family:Inter,sans-serif">
    <div class="mb-6 text-center">
      ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="mx-auto mb-3 h-20 w-20 rounded-full object-cover" style="border:3px solid ${ACCENT}"/>` : ''}
      <h1 class="text-2xl font-bold" style="color:${PRIMARY}">${esc(pi.fullName || 'Your Name')}</h1>
      ${pi.jobTitle ? `<p class="mt-1 text-sm font-medium" style="color:${ACCENT}">${esc(pi.jobTitle)}</p>` : ''}
      ${contacts.length ? `<div class="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-500">${contacts.map(ct => `<span>${esc(ct)}</span>`).join('')}</div>` : ''}
    </div>
    ${sections.map(s => `<div class="mb-4" data-section>
      <div class="rounded-lg p-4 shadow-sm" style="background-color:${CARD_BG};border:1px solid #e4e4e7">
        <div class="mb-3 flex items-center gap-2"><div class="h-5 w-1 rounded-full" style="background-color:${ACCENT}"></div><h2 class="text-sm font-bold uppercase tracking-wider" style="color:${PRIMARY}">${esc(s.title)}</h2></div>
        ${buildCardSectionContent(s)}
      </div>
    </div>`).join('')}
  </div>`;
}
