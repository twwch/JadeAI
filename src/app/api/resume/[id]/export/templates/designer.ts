import type {
  SummaryContent,
  WorkExperienceContent,
  EducationContent,
  SkillsContent,
} from '@/types/resume';
import { esc, getPersonalInfo, visibleSections, buildHighlights, type ResumeWithSections, type Section } from '../utils';
import { buildClassicSectionContent } from './classic';

function buildDesignerSectionContent(section: Section): string {
  const c = section.content as any;
  const CORAL = '#ff6b6b';
  if (section.type === 'summary') return `<p class="border-l-4 pl-4 text-sm leading-relaxed text-zinc-600" style="border-color:${CORAL}">${esc((c as SummaryContent).text)}</p>`;
  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div class="rounded-lg bg-zinc-50 p-4">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold text-black">${esc(it.position)}</h3><span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)} – ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.company ? `<p class="text-sm font-medium" style="color:${CORAL}">${esc(it.company)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div class="rounded-lg bg-zinc-50 p-4">
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold text-black">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</span>${it.institution ? `<span class="text-sm text-zinc-500"> — ${esc(it.institution)}</span>` : ''}</div><span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)} – ${esc(it.endDate)}</span></div>
      ${it.gpa ? `<p class="text-sm text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'skills') {
    return `<div class="flex flex-wrap gap-2">${((c as SkillsContent).categories || []).flatMap((cat: any) =>
      (cat.skills || []).map((skill: string) => `<span class="rounded-full px-3 py-1 text-xs font-medium text-white" style="background:${CORAL}">${esc(skill)}</span>`)
    ).join('')}</div>`;
  }
  return buildClassicSectionContent(section);
}

export function buildDesignerHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const CORAL = '#ff6b6b';

  return `<div class="mx-auto max-w-[210mm] bg-white shadow-lg" style="font-family:Inter,sans-serif">
    <div class="flex">
      <div class="flex-1 px-8 py-8">
        <h1 class="text-4xl font-black tracking-tight text-black">${esc(pi.fullName || 'Your Name')}</h1>
        ${pi.jobTitle ? `<p class="mt-1 text-lg font-light" style="color:${CORAL}">${esc(pi.jobTitle)}</p>` : ''}
        <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500">
          ${[pi.email, pi.phone, pi.location, pi.website].filter(Boolean).map(c => `<span>${esc(c)}</span>`).join('')}
        </div>
      </div>
      ${pi.avatar ? `<div class="w-32 shrink-0"><img src="${esc(pi.avatar)}" alt="" class="h-full w-full object-cover"/></div>` : ''}
    </div>
    <div class="h-1 w-full" style="background:${CORAL}"></div>
    <div class="p-8">
      ${sections.map(s => `<div class="mb-6" data-section>
        <h2 class="mb-3 text-xs font-black uppercase tracking-[0.3em]" style="color:${CORAL}">${esc(s.title)}</h2>
        ${buildDesignerSectionContent(s)}
      </div>`).join('')}
    </div>
  </div>`;
}
