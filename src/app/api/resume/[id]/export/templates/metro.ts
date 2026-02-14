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
const AMBER = '#f59e0b';

function buildMetroSectionContent(section: Section): string {
  const c = section.content as any;

  if (section.type === 'summary') return `<p class="border-l-3 pl-4 text-sm leading-relaxed text-zinc-600" style="border-color:${AMBER}">${esc((c as SummaryContent).text)}</p>`;

  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div class="border-l-3 pl-4" style="border-color:${AMBER}">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.position)}</h3><span class="shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase text-white" style="background-color:${PRIMARY}">${esc(it.startDate)} - ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.company ? `<p class="text-sm font-semibold" style="color:${AMBER}">${esc(it.company)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div class="border-l-3 pl-4" style="border-color:${AMBER}">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.institution)}</h3><span class="text-xs text-zinc-400">${esc(it.startDate)} - ${esc(it.endDate)}</span></div>
      <p class="text-sm text-zinc-600">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</p>
      ${it.gpa ? `<p class="text-xs text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'skills') {
    return `<div class="space-y-3">${((c as SkillsContent).categories || []).map((cat: any) => `<div>
      <p class="mb-1.5 text-xs font-bold uppercase tracking-wider" style="color:${PRIMARY}">${esc(cat.name)}</p>
      <div class="flex flex-wrap gap-1.5">${(cat.skills || []).map((skill: string) =>
        `<span class="px-2.5 py-0.5 text-xs font-semibold text-white" style="background-color:${AMBER}">${esc(skill)}</span>`
      ).join('')}</div>
    </div>`).join('')}</div>`;
  }

  if (section.type === 'projects') {
    return `<div class="space-y-3">${((c as ProjectsContent).items || []).map((it: any) => `<div class="border-l-3 pl-4" style="border-color:${AMBER}">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.name)}</h3>${it.startDate ? `<span class="text-xs text-zinc-400">${esc(it.startDate)}${it.endDate ? ` - ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<div class="mt-1 flex flex-wrap gap-1">${it.technologies.map((t: string) => `<span class="px-1.5 py-0.5 text-[10px] font-bold text-white" style="background-color:${PRIMARY}">${esc(t)}</span>`).join('')}</div>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'certifications') {
    return `<div class="space-y-1.5">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div class="flex items-baseline justify-between border-l-3 pl-4" style="border-color:${AMBER}"><span class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.name)}</span><span class="text-xs text-zinc-500">${esc(it.issuer)}${it.date ? ` | ${esc(it.date)}` : ''}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'languages') {
    return `<div class="flex flex-wrap gap-2">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div class="flex items-center gap-2 px-3 py-1" style="background-color:#f8fafc;border-left:3px solid ${AMBER}"><span class="text-sm font-semibold" style="color:${PRIMARY}">${esc(it.language)}</span><span class="text-xs text-zinc-400">${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'custom') {
    return `<div class="space-y-3">${((c as CustomContent).items || []).map((it: any) => `<div class="border-l-3 pl-4" style="border-color:${AMBER}">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.title)}</h3>${it.date ? `<span class="text-xs text-zinc-400">${esc(it.date)}</span>` : ''}</div>
      ${it.subtitle ? `<p class="text-sm text-zinc-500">${esc(it.subtitle)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }

  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div class="border-l-3 pl-4" style="border-color:${AMBER}"><span class="text-sm font-semibold" style="color:${PRIMARY}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm text-zinc-600">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }

  return '';
}

export function buildMetroHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);

  return `<div class="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style="font-family:Inter,sans-serif">
    <div class="mb-6 flex items-center gap-5">
      ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="h-16 w-16 shrink-0 object-cover" style="border:3px solid ${AMBER}"/>` : ''}
      <div class="min-w-0 flex-1">
        <h1 class="text-2xl font-extrabold uppercase tracking-tight" style="color:${PRIMARY}">${esc(pi.fullName || 'Your Name')}</h1>
        ${pi.jobTitle ? `<p class="mt-0.5 text-sm font-semibold" style="color:${AMBER}">${esc(pi.jobTitle)}</p>` : ''}
        ${contacts.length ? `<div class="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">${contacts.map(c => `<span class="px-2 py-0.5" style="background-color:#f8fafc;border-left:2px solid ${AMBER}">${esc(c)}</span>`).join('')}</div>` : ''}
      </div>
    </div>
    <div class="mb-6 h-1" style="background-color:${PRIMARY}"></div>
    ${sections.map(s => `<div class="mb-6" data-section>
      <div class="mb-3 flex items-center gap-2">
        <div class="px-3 py-1 text-xs font-bold uppercase tracking-wider text-white" style="background-color:${PRIMARY}">${esc(s.title)}</div>
        <div class="h-0.5 flex-1" style="background-color:${AMBER}"></div>
      </div>
      ${buildMetroSectionContent(s)}
    </div>`).join('')}
  </div>`;
}
