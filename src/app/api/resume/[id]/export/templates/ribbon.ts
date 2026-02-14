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

const PRIMARY = '#1e293b';
const ACCENT = '#b91c1c';
const RIBBON = '#dc2626';

function buildRibbonSectionContent(section: Section): string {
  const c = section.content as any;

  if (section.type === 'summary') {
    return `<p class="text-sm leading-relaxed text-zinc-600">${esc((c as SummaryContent).text)}</p>`;
  }
  if (section.type === 'work_experience') {
    return `<div class="space-y-3">${((c as WorkExperienceContent).items || []).map((it: any) => `<div class="border-l-2 pl-3" style="border-color:${RIBBON}">
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-semibold" style="color:${PRIMARY}">${esc(it.position)}</span>${it.company ? `<span class="text-sm" style="color:${ACCENT}"> | ${esc(it.company)}</span>` : ''}</div><span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)} – ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div class="border-l-2 pl-3" style="border-color:${RIBBON}">
      <div class="flex items-baseline justify-between"><span class="text-sm font-semibold" style="color:${PRIMARY}">${esc(it.institution)}</span><span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)} – ${esc(it.endDate)}</span></div>
      <p class="text-sm text-zinc-600">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</p>
      ${it.gpa ? `<p class="text-xs text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'skills') {
    return `<div class="space-y-2">${((c as SkillsContent).categories || []).map((cat: any) => `<div>
      <p class="mb-1 text-xs font-semibold text-zinc-500">${esc(cat.name)}</p>
      <div class="flex flex-wrap gap-1.5">${(cat.skills || []).map((s: string) => `<span class="rounded-sm border px-2 py-0.5 text-xs" style="border-color:${RIBBON}40;color:${ACCENT}">${esc(s)}</span>`).join('')}</div>
    </div>`).join('')}</div>`;
  }
  if (section.type === 'projects') {
    return `<div class="space-y-3">${((c as ProjectsContent).items || []).map((it: any) => `<div class="border-l-2 pl-3" style="border-color:${RIBBON}">
      <div class="flex items-baseline justify-between"><span class="text-sm font-semibold" style="color:${ACCENT}">${esc(it.name)}</span>${it.startDate ? `<span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)}${it.endDate ? ` – ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<div class="mt-1 flex flex-wrap gap-1">${it.technologies.map((t: string) => `<span class="rounded-sm bg-red-50 px-1.5 py-0.5 text-[10px]" style="color:${ACCENT}">${esc(t)}</span>`).join('')}</div>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'certifications') {
    return `<div class="space-y-1.5">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div class="flex items-baseline justify-between"><div><span class="text-sm font-semibold" style="color:${PRIMARY}">${esc(it.name)}</span>${it.issuer ? `<span class="text-sm text-zinc-600"> — ${esc(it.issuer)}</span>` : ''}</div>${it.date ? `<span class="text-xs text-zinc-400">${esc(it.date)}</span>` : ''}</div>`
    ).join('')}</div>`;
  }
  if (section.type === 'languages') {
    return `<div class="flex flex-wrap gap-3">${((c as LanguagesContent).items || []).map((it: any) =>
      `<span class="text-sm"><span class="font-medium" style="color:${PRIMARY}">${esc(it.language)}</span><span class="text-zinc-500"> — ${esc(it.proficiency)}</span></span>`
    ).join('')}</div>`;
  }
  if (section.type === 'custom') {
    return `<div class="space-y-2">${((c as CustomContent).items || []).map((it: any) => `<div class="border-l-2 pl-3" style="border-color:${RIBBON}">
      <div class="flex items-baseline justify-between"><span class="text-sm font-semibold" style="color:${PRIMARY}">${esc(it.title)}</span>${it.date ? `<span class="text-xs text-zinc-400">${esc(it.date)}</span>` : ''}</div>
      ${it.subtitle ? `<p class="text-sm text-zinc-500">${esc(it.subtitle)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }
  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div><span class="text-sm font-medium" style="color:${PRIMARY}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm text-zinc-600">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }
  return '';
}

export function buildRibbonHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);

  return `<div class="mx-auto max-w-[210mm] overflow-hidden bg-white shadow-lg" style="font-family:Inter,sans-serif">
    <div class="relative px-8 py-8 text-white" style="background-color:${RIBBON}">
      <div class="absolute bottom-0 left-0 h-0 w-0" style="border-left:20px solid transparent;border-top:12px solid ${ACCENT}"></div>
      <div class="absolute bottom-0 right-0 h-0 w-0" style="border-right:20px solid transparent;border-top:12px solid ${ACCENT}"></div>
      <div class="flex items-center gap-5">
        ${pi.avatar ? `<div class="shrink-0 rounded-full border-[3px] border-white/40 p-0.5"><img src="${esc(pi.avatar)}" alt="" class="h-20 w-20 rounded-full object-cover"/></div>` : ''}
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-white">${esc(pi.fullName || 'Your Name')}</h1>
          ${pi.jobTitle ? `<p class="mt-1 text-sm font-light text-red-100">${esc(pi.jobTitle)}</p>` : ''}
          ${contacts.length ? `<div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-red-100/80">${contacts.map(ct => `<span>${esc(ct)}</span>`).join('')}</div>` : ''}
        </div>
      </div>
    </div>
    <div class="p-8">
      ${sections.map(s => `<div class="mb-5" data-section>
        <div class="relative mb-3 flex items-center">
          <div class="relative z-10 rounded-r-md px-4 py-1 text-white" style="background-color:${RIBBON}"><h2 class="text-xs font-bold uppercase tracking-wider text-white">${esc(s.title)}</h2></div>
          <div class="h-0 w-0" style="border-top:13px solid transparent;border-bottom:13px solid transparent;border-left:8px solid ${RIBBON}"></div>
          <div class="ml-2 h-px flex-1" style="background-color:#e5e7eb"></div>
        </div>
        ${buildRibbonSectionContent(s)}
      </div>`).join('')}
    </div>
  </div>`;
}
