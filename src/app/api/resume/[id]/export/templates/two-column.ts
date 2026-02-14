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

export function buildTwoColumnLeftContent(section: Section): string {
  const c = section.content as any;
  if (section.type === 'skills') {
    return `<div class="space-y-2">${((c as SkillsContent).categories || []).map((cat: any) => `<div>
      <p class="text-xs font-semibold text-zinc-200">${esc(cat.name)}</p>
      <div class="mt-1 flex flex-wrap gap-1">${(cat.skills || []).map((s: string) => `<span class="rounded-sm bg-white/10 px-1.5 py-0.5 text-[10px] text-zinc-300">${esc(s)}</span>`).join('')}</div>
    </div>`).join('')}</div>`;
  }
  if (section.type === 'languages') {
    return `<div class="space-y-1.5">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div class="flex items-center justify-between text-xs"><span class="text-zinc-200">${esc(it.language)}</span><span class="text-zinc-400">${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }
  if (section.type === 'certifications') {
    return `<div class="space-y-1.5">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div><p class="text-xs font-semibold text-zinc-200">${esc(it.name)}</p><p class="text-[10px] text-zinc-400">${esc(it.issuer)}${it.date ? ` (${esc(it.date)})` : ''}</p></div>`
    ).join('')}</div>`;
  }
  if (section.type === 'custom') {
    return `<div class="space-y-1.5">${((c as CustomContent).items || []).map((it: any) =>
      `<div><p class="text-xs font-semibold text-zinc-200">${esc(it.title)}</p>${it.subtitle ? `<p class="text-[10px] text-zinc-400">${esc(it.subtitle)}</p>` : ''}${it.description ? `<p class="text-[10px] text-zinc-400">${esc(it.description)}</p>` : ''}</div>`
    ).join('')}</div>`;
  }
  if (c.items) {
    return `<div class="space-y-1.5">${c.items.map((it: any) => `<div><span class="text-xs font-medium text-zinc-200">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-[10px] text-zinc-400">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }
  return '';
}

function buildTwoColumnRightContent(section: Section): string {
  const c = section.content as any;
  if (section.type === 'summary') return `<p class="text-sm leading-relaxed text-zinc-600">${esc((c as SummaryContent).text)}</p>`;
  if (section.type === 'work_experience') {
    return `<div class="space-y-3">${((c as WorkExperienceContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-semibold text-zinc-800">${esc(it.position)}</span>${it.company ? `<span class="text-sm text-zinc-500"> | ${esc(it.company)}</span>` : ''}</div><span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)} – ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><span class="text-sm font-semibold text-zinc-800">${esc(it.institution)}</span><span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)} – ${esc(it.endDate)}</span></div>
      <p class="text-sm text-zinc-600">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</p>
      ${it.gpa ? `<p class="text-xs text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'projects') {
    return `<div class="space-y-3">${((c as ProjectsContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><span class="text-sm font-semibold text-zinc-800">${esc(it.name)}</span>${it.startDate ? `<span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)}${it.endDate ? ` – ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<div class="mt-1 flex flex-wrap gap-1">${it.technologies.map((t: string) => `<span class="rounded-sm bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500">${esc(t)}</span>`).join('')}</div>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'certifications') {
    return `<div class="space-y-1.5">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div class="flex items-baseline justify-between text-sm"><div><span class="font-semibold text-zinc-800">${esc(it.name)}</span>${it.issuer ? `<span class="text-zinc-600"> — ${esc(it.issuer)}</span>` : ''}</div>${it.date ? `<span class="text-xs text-zinc-400">${esc(it.date)}</span>` : ''}</div>`
    ).join('')}</div>`;
  }
  if (section.type === 'languages') {
    return `<div class="flex flex-wrap gap-x-6 gap-y-1">${((c as LanguagesContent).items || []).map((it: any) =>
      `<span class="text-sm"><span class="font-medium text-zinc-800">${esc(it.language)}</span><span class="text-zinc-500"> — ${esc(it.proficiency)}</span></span>`
    ).join('')}</div>`;
  }
  if (section.type === 'custom') {
    return `<div class="space-y-2">${((c as CustomContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><span class="text-sm font-semibold text-zinc-800">${esc(it.title)}</span>${it.date ? `<span class="text-xs text-zinc-400">${esc(it.date)}</span>` : ''}</div>
      ${it.subtitle ? `<p class="text-sm text-zinc-500">${esc(it.subtitle)}</p>` : ''}
      ${it.description ? `<p class="text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }
  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div><span class="text-sm font-medium text-zinc-700">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm text-zinc-600">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }
  return '';
}

export function buildTwoColumnHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const LEFT_TYPES = new Set(['skills', 'languages', 'certifications', 'custom']);
  const sections = visibleSections(resume);
  const leftSections = sections.filter(s => LEFT_TYPES.has(s.type));
  const rightSections = sections.filter(s => !LEFT_TYPES.has(s.type));

  return `<div class="mx-auto flex max-w-[210mm] overflow-hidden bg-white shadow-lg" style="font-family:Inter,sans-serif;min-height:297mm">
    <div class="w-[35%] shrink-0 p-6 text-white" style="background:linear-gradient(180deg,#1a1a2e 0%,#16213e 100%)">
      <div class="mb-6 text-center">
        ${pi.avatar ? `<div class="mx-auto mb-3 h-24 w-24 overflow-hidden rounded-full border-[3px] border-white/20"><img src="${esc(pi.avatar)}" alt="" class="h-full w-full object-cover"/></div>` : ''}
        <h1 class="text-xl font-bold tracking-tight text-white">${esc(pi.fullName || 'Your Name')}</h1>
        ${pi.jobTitle ? `<p class="mt-1 text-sm font-light text-zinc-300">${esc(pi.jobTitle)}</p>` : ''}
      </div>
      <div class="mb-6 space-y-1.5 text-xs">
        ${pi.email ? `<div class="flex items-start gap-2 text-zinc-300"><span class="shrink-0 text-zinc-400">Email:</span><span class="break-all">${esc(pi.email)}</span></div>` : ''}
        ${pi.phone ? `<div class="flex items-start gap-2 text-zinc-300"><span class="shrink-0 text-zinc-400">Phone:</span><span>${esc(pi.phone)}</span></div>` : ''}
        ${pi.location ? `<div class="flex items-start gap-2 text-zinc-300"><span class="shrink-0 text-zinc-400">Location:</span><span>${esc(pi.location)}</span></div>` : ''}
        ${pi.website ? `<div class="flex items-start gap-2 text-zinc-300"><span class="shrink-0 text-zinc-400">Web:</span><span class="break-all">${esc(pi.website)}</span></div>` : ''}
        ${pi.linkedin ? `<div class="flex items-start gap-2 text-zinc-300"><span class="shrink-0 text-zinc-400">LinkedIn:</span><span class="break-all">${esc(pi.linkedin)}</span></div>` : ''}
        ${pi.github ? `<div class="flex items-start gap-2 text-zinc-300"><span class="shrink-0 text-zinc-400">GitHub:</span><span class="break-all">${esc(pi.github)}</span></div>` : ''}
      </div>
      ${leftSections.map(s => `<div class="mb-5" data-section>
        <h2 class="mb-2 border-b border-white/20 pb-1 text-xs font-bold uppercase tracking-wider text-white">${esc(s.title)}</h2>
        ${buildTwoColumnLeftContent(s)}
      </div>`).join('')}
    </div>
    <div class="flex-1 p-6">
      ${rightSections.map(s => `<div class="mb-5" data-section>
        <h2 class="mb-2 border-b-2 pb-1 text-sm font-bold uppercase tracking-wider" style="color:#1a1a2e;border-color:#1a1a2e">${esc(s.title)}</h2>
        ${buildTwoColumnRightContent(s)}
      </div>`).join('')}
    </div>
  </div>`;
}
