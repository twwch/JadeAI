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

const BLUE = '#2563eb';
const YELLOW = '#eab308';
const RED_B = '#dc2626';
const TEXT = '#18181b';

function buildBerlinSectionContent(section: Section): string {
  const c = section.content as any;

  if (section.type === 'summary') return `<div class="border-l-4 pl-4" style="border-color:${BLUE}"><p class="text-sm leading-relaxed text-zinc-600">${esc((c as SummaryContent).text)}</p></div>`;

  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div class="border-l-4 pl-4" style="border-color:${YELLOW}">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${TEXT}">${esc(it.position)}</h3><span class="shrink-0 text-xs font-bold" style="color:${BLUE}">${esc(it.startDate)} &ndash; ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.company ? `<p class="text-sm font-semibold" style="color:${BLUE}">${esc(it.company)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1.5 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm text-zinc-600"><span class="mt-1.5 h-1.5 w-1.5 shrink-0" style="background-color:${RED_B}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div class="border-l-4 pl-4" style="border-color:${BLUE}">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${TEXT}">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</h3><span class="shrink-0 text-xs" style="color:${BLUE}">${esc(it.startDate)} &ndash; ${esc(it.endDate)}</span></div>
      ${it.institution ? `<p class="text-sm font-semibold" style="color:${YELLOW}">${esc(it.institution)}</p>` : ''}
      ${it.gpa ? `<p class="text-xs text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm text-zinc-600"><span class="mt-1.5 h-1.5 w-1.5 shrink-0" style="background-color:${RED_B}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'skills') {
    return `<div class="space-y-3">${((c as SkillsContent).categories || []).map((cat: any) => `<div>
      <p class="mb-1 text-xs font-bold uppercase tracking-wider" style="color:${BLUE}">${esc(cat.name)}</p>
      <div class="flex flex-wrap gap-1.5">${(cat.skills || []).map((skill: string) =>
        `<span class="border px-2.5 py-0.5 text-xs font-medium" style="border-color:${BLUE};color:${TEXT}">${esc(skill)}</span>`
      ).join('')}</div>
    </div>`).join('')}</div>`;
  }

  if (section.type === 'projects') {
    return `<div class="space-y-3">${((c as ProjectsContent).items || []).map((it: any) => `<div class="border-l-4 pl-4" style="border-color:${YELLOW}">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${BLUE}">${esc(it.name)}</h3>${it.startDate ? `<span class="shrink-0 text-xs" style="color:${BLUE}">${esc(it.startDate)}${it.endDate ? ` \u2013 ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-0.5 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<div class="mt-1.5 flex flex-wrap gap-1">${it.technologies.map((t: string) => `<span class="px-2 py-0.5 text-[10px] font-bold text-white" style="background-color:${BLUE}">${esc(t)}</span>`).join('')}</div>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1.5 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm text-zinc-600"><span class="mt-1.5 h-1.5 w-1.5 shrink-0" style="background-color:${RED_B}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'certifications') {
    return `<div class="space-y-1.5">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${TEXT}">${esc(it.name)}</span><span class="text-sm text-zinc-500"> &mdash; ${esc(it.issuer)}</span></div>${it.date ? `<span class="shrink-0 text-xs font-bold" style="color:${BLUE}">${esc(it.date)}</span>` : ''}</div>`
    ).join('')}</div>`;
  }

  if (section.type === 'languages') {
    return `<div class="flex flex-wrap gap-2">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div class="flex items-center gap-2 border px-3 py-1" style="border-color:${BLUE}"><span class="h-2 w-2 rounded-full" style="background-color:${YELLOW}"></span><span class="text-sm font-medium" style="color:${TEXT}">${esc(it.language)}</span><span class="text-xs text-zinc-400">${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'custom') {
    return `<div class="space-y-3">${((c as CustomContent).items || []).map((it: any) => `<div class="border-l-4 pl-4" style="border-color:${BLUE}">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${TEXT}">${esc(it.title)}</h3>${it.date ? `<span class="shrink-0 text-xs" style="color:${BLUE}">${esc(it.date)}</span>` : ''}</div>
      ${it.subtitle ? `<p class="text-sm font-semibold" style="color:${YELLOW}">${esc(it.subtitle)}</p>` : ''}
      ${it.description ? `<p class="mt-0.5 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }

  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div class="border-l-4 pl-4" style="border-color:${BLUE}"><span class="text-sm font-bold" style="color:${TEXT}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm text-zinc-600">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }

  return '';
}

export function buildBerlinHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);

  return `<div class="mx-auto max-w-[210mm] overflow-hidden bg-white shadow-lg" style="font-family:Inter,sans-serif">
    <div class="relative px-10 py-8 text-white" style="background-color:#000000">
      <div class="absolute right-8 top-4 h-20 w-20 rounded-full border-4" style="border-color:${YELLOW};opacity:0.6"></div>
      <div class="absolute right-24 bottom-3 h-8 w-8" style="background-color:${RED_B};opacity:0.7"></div>
      <div class="absolute right-6 bottom-6 h-12 w-3" style="background-color:${BLUE};opacity:0.7"></div>
      <div class="relative flex items-center gap-6">
        ${pi.avatar ? `<div class="shrink-0 border-4 p-0.5" style="border-color:${YELLOW}"><img src="${esc(pi.avatar)}" alt="" class="h-20 w-20 object-cover"/></div>` : ''}
        <div>
          <h1 class="text-3xl font-extrabold uppercase tracking-tight">${esc(pi.fullName || 'Your Name')}</h1>
          ${pi.jobTitle ? `<p class="mt-1 text-sm font-light tracking-wider" style="color:${YELLOW}">${esc(pi.jobTitle)}</p>` : ''}
          ${contacts.length ? `<div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/70">${contacts.map(c => `<span>${esc(c)}</span>`).join('')}</div>` : ''}
        </div>
      </div>
    </div>
    <div class="p-8 pt-6">
      ${sections.map(s => `<div class="mb-6" data-section>
        <div class="mb-3 flex items-center gap-2">
          <div class="h-5 w-5 rounded-full" style="background-color:${BLUE}"></div>
          <h2 class="text-sm font-extrabold uppercase tracking-wider" style="color:${TEXT}">${esc(s.title)}</h2>
          <div class="ml-auto h-1 w-12" style="background-color:${YELLOW}"></div>
        </div>
        ${buildBerlinSectionContent(s)}
      </div>`).join('')}
    </div>
  </div>`;
}
