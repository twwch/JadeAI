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

const GRADIENT = 'linear-gradient(135deg,#ec4899 0%,#8b5cf6 100%)';
const ACCENT = '#a855f7';

function buildGradientSectionContent(section: Section): string {
  const c = section.content as any;

  if (section.type === 'summary') return `<p class="text-sm leading-relaxed text-zinc-600">${esc((c as SummaryContent).text)}</p>`;

  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div class="border-l-2 pl-4" style="border-image:${GRADIENT};border-image-slice:1">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-semibold text-zinc-800">${esc(it.position)}</h3><span class="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white" style="background:${GRADIENT}">${esc(it.startDate)} - ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.company ? `<p class="text-sm font-medium" style="color:${ACCENT}">${esc(it.company)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div class="border-l-2 pl-4" style="border-image:${GRADIENT};border-image-slice:1">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-semibold text-zinc-800">${esc(it.institution)}</h3><span class="text-xs text-zinc-400">${esc(it.startDate)} - ${esc(it.endDate)}</span></div>
      <p class="text-sm text-zinc-600">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</p>
      ${it.gpa ? `<p class="text-xs text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'skills') {
    return `<div class="space-y-3">${((c as SkillsContent).categories || []).map((cat: any) => `<div>
      <p class="mb-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500">${esc(cat.name)}</p>
      <div class="flex flex-wrap gap-1.5">${(cat.skills || []).map((skill: string) =>
        `<span class="rounded-full px-3 py-0.5 text-xs font-medium text-zinc-700" style="border:1.5px solid transparent;background-image:linear-gradient(white,white),${GRADIENT};background-origin:border-box;background-clip:padding-box,border-box">${esc(skill)}</span>`
      ).join('')}</div>
    </div>`).join('')}</div>`;
  }

  if (section.type === 'projects') {
    return `<div class="space-y-3">${((c as ProjectsContent).items || []).map((it: any) => `<div class="border-l-2 pl-4" style="border-image:${GRADIENT};border-image-slice:1">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-semibold" style="color:${ACCENT}">${esc(it.name)}</h3>${it.startDate ? `<span class="text-xs text-zinc-400">${esc(it.startDate)}${it.endDate ? ` - ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<div class="mt-1.5 flex flex-wrap gap-1">${it.technologies.map((t: string) => `<span class="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style="background:${GRADIENT}">${esc(t)}</span>`).join('')}</div>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'certifications') {
    return `<div class="space-y-1.5">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div class="flex items-baseline justify-between"><span class="text-sm font-semibold" style="color:${ACCENT}">${esc(it.name)}</span><span class="text-xs text-zinc-500">${esc(it.issuer)}${it.date ? ` | ${esc(it.date)}` : ''}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'languages') {
    return `<div class="flex flex-wrap gap-3">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div class="flex items-center gap-2 rounded-full px-4 py-1.5" style="border:1.5px solid transparent;background-image:linear-gradient(white,white),${GRADIENT};background-origin:border-box;background-clip:padding-box,border-box"><span class="text-sm font-medium text-zinc-700">${esc(it.language)}</span><span class="text-xs text-zinc-400">${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'custom') {
    return `<div class="space-y-3">${((c as CustomContent).items || []).map((it: any) => `<div class="border-l-2 pl-4" style="border-image:${GRADIENT};border-image-slice:1">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-semibold" style="color:${ACCENT}">${esc(it.title)}</h3>${it.date ? `<span class="text-xs text-zinc-400">${esc(it.date)}</span>` : ''}</div>
      ${it.subtitle ? `<p class="text-sm text-zinc-500">${esc(it.subtitle)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }

  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div class="border-l-2 pl-4" style="border-image:${GRADIENT};border-image-slice:1"><span class="text-sm font-medium" style="color:${ACCENT}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm text-zinc-600">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }

  return '';
}

export function buildGradientHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);

  return `<div class="mx-auto max-w-[210mm] overflow-hidden bg-white shadow-lg" style="font-family:Inter,sans-serif">
    <div class="relative px-10 py-8 text-white" style="background:${GRADIENT}">
      <div class="absolute -right-8 -top-8 h-36 w-36 rounded-full border-4 border-white/10"></div>
      <div class="absolute bottom-2 right-16 h-20 w-20 rounded-full bg-white/5"></div>
      <div class="absolute -left-4 top-1/2 h-12 w-12 rounded-full bg-white/10"></div>
      <div class="relative flex items-center gap-6">
        ${pi.avatar ? `<div class="shrink-0 rounded-full p-[3px] bg-white/20"><img src="${esc(pi.avatar)}" alt="" class="h-[80px] w-[80px] rounded-full border-2 border-white/20 object-cover"/></div>` : ''}
        <div class="min-w-0 flex-1">
          <h1 class="text-3xl font-bold tracking-tight">${esc(pi.fullName || 'Your Name')}</h1>
          ${pi.jobTitle ? `<p class="mt-1.5 text-base font-light tracking-wide text-white/80">${esc(pi.jobTitle)}</p>` : ''}
          ${contacts.length ? `<div class="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-white/70">${contacts.map((c, i) => `<span class="flex items-center gap-2">${esc(c)}${i < contacts.length - 1 ? '<span class="text-white/30">|</span>' : ''}</span>`).join('')}</div>` : ''}
        </div>
      </div>
      <div class="absolute bottom-0 left-0 h-1 w-full" style="background:linear-gradient(90deg,#ec4899 0%,#8b5cf6 50%,transparent 100%)"></div>
    </div>
    <div class="p-8 pt-6">
      ${sections.map(s => `<div class="mb-6" data-section>
        <h2 class="mb-3 text-sm font-bold uppercase tracking-wider" style="color:${ACCENT}"><span class="inline-block pb-1 border-b-2" style="border-image:${GRADIENT};border-image-slice:1">${esc(s.title)}</span></h2>
        ${buildGradientSectionContent(s)}
      </div>`).join('')}
    </div>
  </div>`;
}
