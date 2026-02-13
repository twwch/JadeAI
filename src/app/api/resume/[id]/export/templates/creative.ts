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

function buildCreativeSectionContent(section: Section): string {
  const c = section.content as any;
  const GRADIENT = 'linear-gradient(135deg,#7c3aed 0%,#f97316 100%)';
  const PRIMARY = '#7c3aed';

  if (section.type === 'summary') return `<p class="rounded-lg bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-600 italic">${esc((c as SummaryContent).text)}</p>`;
  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div class="relative rounded-lg border border-zinc-100 p-4">
      <div class="absolute left-0 top-0 h-full w-1 rounded-l-lg" style="background:${GRADIENT}"></div>
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold text-zinc-800">${esc(it.position)}</h3><span class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white" style="background:${PRIMARY}">${esc(it.startDate)} – ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.company ? `<p class="text-sm font-medium" style="color:${PRIMARY}">${esc(it.company)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1.5 space-y-0.5">${buildHighlights(it.highlights, '', 'custom-dot')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div class="rounded-lg border border-zinc-100 p-4">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold text-zinc-800">${esc(it.institution)}</h3><span class="text-xs text-zinc-400">${esc(it.startDate)} – ${esc(it.endDate)}</span></div>
      <p class="text-sm text-zinc-600">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</p>
      ${it.gpa ? `<p class="text-xs text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1.5 space-y-0.5">${buildHighlights(it.highlights, '', 'custom-dot')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'skills') {
    return `<div class="space-y-3">${((c as SkillsContent).categories || []).map((cat: any) => `<div>
      <p class="mb-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500">${esc(cat.name)}</p>
      <div class="flex flex-wrap gap-1.5">${(cat.skills || []).map((skill: string) =>
        `<span class="rounded-full border px-2.5 py-0.5 text-xs font-medium text-zinc-700" style="border-color:${PRIMARY}40;background-color:${PRIMARY}08">${esc(skill)}</span>`
      ).join('')}</div>
    </div>`).join('')}</div>`;
  }
  if (section.type === 'projects') {
    return `<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">${((c as ProjectsContent).items || []).map((it: any) => `<div class="rounded-lg border border-zinc-100 p-4">
      <h3 class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.name)}</h3>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<div class="mt-2 flex flex-wrap gap-1">${it.technologies.map((t: string) => `<span class="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style="background:${GRADIENT}">${esc(t)}</span>`).join('')}</div>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1.5 space-y-0.5">${buildHighlights(it.highlights, '', 'custom-dot')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'certifications') {
    return `<div class="flex flex-wrap gap-2">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div class="rounded-lg border border-zinc-100 px-4 py-2"><p class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.name)}</p><p class="text-xs text-zinc-500">${esc(it.issuer)}${it.date ? ` | ${esc(it.date)}` : ''}</p></div>`
    ).join('')}</div>`;
  }
  if (section.type === 'languages') {
    return `<div class="flex flex-wrap gap-3">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div class="flex items-center gap-2 rounded-full border border-zinc-100 px-4 py-1.5"><span class="h-2 w-2 rounded-full" style="background:${GRADIENT}"></span><span class="text-sm font-medium text-zinc-700">${esc(it.language)}</span><span class="text-xs text-zinc-400">${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }
  if (section.type === 'custom') {
    return `<div class="space-y-3">${((c as CustomContent).items || []).map((it: any) => `<div class="rounded-lg border border-zinc-100 p-4">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.title)}</h3>${it.date ? `<span class="text-xs text-zinc-400">${esc(it.date)}</span>` : ''}</div>
      ${it.subtitle ? `<p class="text-sm text-zinc-500">${esc(it.subtitle)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }
  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div class="rounded-lg border border-zinc-100 p-3"><span class="text-sm font-medium" style="color:${PRIMARY}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm text-zinc-600">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }
  return '';
}

export function buildCreativeHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);
  const GRADIENT = 'linear-gradient(135deg,#7c3aed 0%,#f97316 100%)';
  const PRIMARY = '#7c3aed';

  return `<div class="mx-auto max-w-[210mm] overflow-hidden bg-white shadow-lg" style="font-family:Inter,sans-serif">
    <div class="relative px-8 py-10 text-white" style="background:${GRADIENT}">
      <div class="absolute right-8 top-6 h-32 w-32 rounded-full border-4 border-white/10"></div>
      <div class="absolute right-20 top-16 h-16 w-16 rounded-full border-2 border-white/10"></div>
      <div class="absolute bottom-4 left-4 h-20 w-20 rounded-full bg-white/5"></div>
      <div class="relative flex items-center gap-6">
        ${pi.avatar ? `<div class="shrink-0 rounded-2xl border-4 border-white/30 p-0.5"><img src="${esc(pi.avatar)}" alt="" class="h-24 w-24 rounded-xl object-cover"/></div>` : ''}
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight">${esc(pi.fullName || 'Your Name')}</h1>
          ${pi.jobTitle ? `<p class="mt-1 text-lg font-light text-white/80">${esc(pi.jobTitle)}</p>` : ''}
          ${contacts.length ? `<div class="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-white/70">${contacts.map((c, i) => `<span>${esc(c)}${i < contacts.length - 1 ? '<span class="mx-0.5 text-white/30">|</span>' : ''}</span>`).join('')}</div>` : ''}
        </div>
      </div>
    </div>
    <div class="p-8">
      ${sections.map(s => `<div class="mb-6" data-section>
        <div class="mb-3 flex items-center gap-3"><div class="h-8 w-1 rounded-full" style="background:${GRADIENT}"></div><h2 class="text-base font-extrabold uppercase tracking-wide" style="color:${PRIMARY}">${esc(s.title)}</h2></div>
        ${buildCreativeSectionContent(s)}
      </div>`).join('')}
    </div>
  </div>`;
}
