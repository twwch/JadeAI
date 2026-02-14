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

const PRIMARY = '#4f46e5';
const VIOLET = '#7c3aed';

function buildMaterialSectionContent(section: Section): string {
  const c = section.content as any;

  if (section.type === 'summary') return `<p class="text-sm leading-relaxed text-zinc-600">${esc((c as SummaryContent).text)}</p>`;

  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div class="rounded-lg bg-zinc-50 p-4">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-semibold text-zinc-800">${esc(it.position)}</h3><span class="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm" style="background-color:${PRIMARY}">${esc(it.startDate)} - ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.company ? `<p class="text-sm font-medium" style="color:${VIOLET}">${esc(it.company)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div class="rounded-lg bg-zinc-50 p-4">
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
        `<span class="rounded-full px-3 py-1 text-xs font-medium text-white shadow-sm" style="background-color:${VIOLET}">${esc(skill)}</span>`
      ).join('')}</div>
    </div>`).join('')}</div>`;
  }

  if (section.type === 'projects') {
    return `<div class="space-y-3">${((c as ProjectsContent).items || []).map((it: any) => `<div class="rounded-lg bg-zinc-50 p-4">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-semibold" style="color:${PRIMARY}">${esc(it.name)}</h3>${it.startDate ? `<span class="text-xs text-zinc-400">${esc(it.startDate)}${it.endDate ? ` - ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<div class="mt-1.5 flex flex-wrap gap-1">${it.technologies.map((t: string) => `<span class="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style="background-color:${PRIMARY}">${esc(t)}</span>`).join('')}</div>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'certifications') {
    return `<div class="space-y-1.5">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div class="flex items-baseline justify-between rounded-lg bg-zinc-50 px-4 py-2"><span class="text-sm font-semibold" style="color:${PRIMARY}">${esc(it.name)}</span><span class="text-xs text-zinc-500">${esc(it.issuer)}${it.date ? ` | ${esc(it.date)}` : ''}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'languages') {
    return `<div class="flex flex-wrap gap-2">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div class="flex items-center gap-2 rounded-full px-4 py-1.5 shadow-sm" style="background-color:${PRIMARY}10"><span class="h-2 w-2 rounded-full" style="background-color:${VIOLET}"></span><span class="text-sm font-medium text-zinc-700">${esc(it.language)}</span><span class="text-xs text-zinc-400">${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'custom') {
    return `<div class="space-y-3">${((c as CustomContent).items || []).map((it: any) => `<div class="rounded-lg bg-zinc-50 p-4">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-semibold" style="color:${PRIMARY}">${esc(it.title)}</h3>${it.date ? `<span class="text-xs text-zinc-400">${esc(it.date)}</span>` : ''}</div>
      ${it.subtitle ? `<p class="text-sm text-zinc-500">${esc(it.subtitle)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }

  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div class="rounded-lg bg-zinc-50 p-3"><span class="text-sm font-medium" style="color:${PRIMARY}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm text-zinc-600">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }

  return '';
}

export function buildMaterialHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);

  return `<div class="mx-auto max-w-[210mm] overflow-hidden bg-zinc-50 shadow-lg" style="font-family:Inter,sans-serif">
    <div class="mx-4 mt-4 rounded-2xl px-8 py-8 text-white shadow-xl" style="background:linear-gradient(135deg,${PRIMARY} 0%,${VIOLET} 100%)">
      <div class="flex items-center gap-6">
        ${pi.avatar ? `<div class="shrink-0 rounded-full bg-white/20 p-1 shadow-lg"><img src="${esc(pi.avatar)}" alt="" class="h-20 w-20 rounded-full object-cover"/></div>` : ''}
        <div class="min-w-0 flex-1">
          <h1 class="text-3xl font-bold tracking-tight">${esc(pi.fullName || 'Your Name')}</h1>
          ${pi.jobTitle ? `<p class="mt-1 text-base font-light text-white/80">${esc(pi.jobTitle)}</p>` : ''}
          ${contacts.length ? `<div class="mt-3 flex flex-wrap gap-2 text-[13px]">${contacts.map(c => `<span class="rounded-full bg-white/15 px-3 py-0.5">${esc(c)}</span>`).join('')}</div>` : ''}
        </div>
      </div>
    </div>
    <div class="p-6 pt-4">
      ${sections.map(s => `<div class="mb-4" data-section>
        <div class="mb-3 rounded-xl bg-white p-5 shadow-sm">
          <h2 class="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider" style="color:${PRIMARY}"><span class="inline-block h-5 w-1 rounded-full" style="background-color:${VIOLET}"></span>${esc(s.title)}</h2>
          ${buildMaterialSectionContent(s)}
        </div>
      </div>`).join('')}
    </div>
  </div>`;
}
