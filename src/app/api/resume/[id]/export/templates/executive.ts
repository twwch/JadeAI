import type {
  SummaryContent,
  WorkExperienceContent,
  EducationContent,
  SkillsContent,
} from '@/types/resume';
import { esc, getPersonalInfo, visibleSections, buildHighlights, type ResumeWithSections, type Section } from '../utils';

function buildExecutiveSectionContent(section: Section): string {
  const c = section.content as any;
  const CHARCOAL = '#2d3436';
  const EMERALD = '#00b894';
  if (section.type === 'summary') return `<p class="text-sm leading-relaxed text-zinc-600">${esc((c as SummaryContent).text)}</p>`;
  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${CHARCOAL}">${esc(it.position)}</span>${it.company ? `<span class="text-sm text-zinc-600"> | ${esc(it.company)}</span>` : ''}</div><span class="shrink-0 rounded px-2 py-0.5 text-xs font-medium text-white" style="background:${EMERALD}">${esc(it.startDate)} – ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-5">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${CHARCOAL}">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</span>${it.institution ? `<span class="text-sm text-zinc-600"> — ${esc(it.institution)}</span>` : ''}</div><span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)} – ${esc(it.endDate)}</span></div>
      ${it.gpa ? `<p class="text-sm text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'skills') {
    return `<div class="flex flex-wrap gap-2">${((c as SkillsContent).categories || []).flatMap((cat: any) =>
      (cat.skills || []).map((skill: string) => `<span class="rounded border px-2.5 py-1 text-xs font-medium" style="border-color:${EMERALD};color:${CHARCOAL}">${esc(skill)}</span>`)
    ).join('')}</div>`;
  }
  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div><span class="text-sm font-medium" style="color:${CHARCOAL}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm text-zinc-600">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }
  return '';
}

export function buildExecutiveHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);
  const CHARCOAL = '#2d3436';
  const EMERALD = '#00b894';

  return `<div class="mx-auto max-w-[210mm] bg-white shadow-lg" style="font-family:Inter,sans-serif">
    <div class="px-8 py-8" style="background:${CHARCOAL}">
      <div class="flex items-center gap-6">
        ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="h-20 w-20 shrink-0 rounded-lg border-2 object-cover" style="border-color:${EMERALD}"/>` : ''}
        <div class="flex-1">
          <h1 class="text-3xl font-bold tracking-tight text-white">${esc(pi.fullName || 'Your Name')}</h1>
          ${pi.jobTitle ? `<p class="mt-1 text-base font-light" style="color:${EMERALD}">${esc(pi.jobTitle)}</p>` : ''}
          ${contacts.length ? `<div class="mt-2 flex flex-wrap gap-3 text-sm text-zinc-400">${contacts.map(c => `<span>${esc(c)}</span>`).join('')}</div>` : ''}
        </div>
      </div>
    </div>
    <div class="p-8">
      ${sections.map(s => `<div class="mb-6" data-section>
        <h2 class="mb-3 border-b-2 pb-1 text-sm font-bold uppercase tracking-wider" style="color:${CHARCOAL};border-color:${EMERALD}">${esc(s.title)}</h2>
        ${buildExecutiveSectionContent(s)}
      </div>`).join('')}
    </div>
  </div>`;
}
