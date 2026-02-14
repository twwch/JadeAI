import type {
  SummaryContent,
  WorkExperienceContent,
  EducationContent,
  SkillsContent,
} from '@/types/resume';
import { esc, getPersonalInfo, visibleSections, buildHighlights, type ResumeWithSections, type Section } from '../utils';

function buildFormalSectionContent(section: Section): string {
  const c = section.content as any;
  const DG = '#004d40';
  if (section.type === 'summary') return `<p class="text-sm leading-relaxed text-zinc-600">${esc((c as SummaryContent).text)}</p>`;
  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${DG}">${esc(it.position)}</span>${it.company ? `<span class="text-sm text-zinc-600">, ${esc(it.company)}</span>` : ''}${it.location ? `<span class="text-sm text-zinc-400"> (${esc(it.location)})</span>` : ''}</div><span class="shrink-0 text-xs italic text-zinc-400">${esc(it.startDate)} – ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-5">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${DG}">${esc(it.institution)}</span>${it.location ? `<span class="text-sm text-zinc-400"> (${esc(it.location)})</span>` : ''}</div><span class="shrink-0 text-xs italic text-zinc-400">${esc(it.startDate)} – ${esc(it.endDate)}</span></div>
      <p class="text-sm text-zinc-600">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</p>
      ${it.gpa ? `<p class="text-xs text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'skills') {
    return `<div class="space-y-1">${((c as SkillsContent).categories || []).map((cat: any) =>
      `<div class="flex text-sm"><span class="w-32 shrink-0 font-semibold" style="color:${DG}">${esc(cat.name)}:</span><span class="text-zinc-600">${esc((cat.skills || []).join(', '))}</span></div>`
    ).join('')}</div>`;
  }
  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div><span class="text-sm font-medium" style="color:${DG}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm text-zinc-600">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }
  return '';
}

export function buildFormalHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);
  const DG = '#004d40';

  return `<div class="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style="font-family:Georgia,'Times New Roman',serif">
    <div class="mb-6 border-b-2 pb-4" style="border-color:${DG}">
      <div class="flex items-center justify-center gap-4">
        ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="h-16 w-16 shrink-0 rounded-full border-2 object-cover" style="border-color:${DG}"/>` : ''}
        <div class="text-center">
          <h1 class="text-2xl font-bold" style="color:${DG}">${esc(pi.fullName || 'Your Name')}</h1>
          ${pi.jobTitle ? `<p class="mt-0.5 text-base text-zinc-500">${esc(pi.jobTitle)}</p>` : ''}
        </div>
      </div>
      ${contacts.length ? `<div class="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-500">${contacts.map(c => `<span>${esc(c)}</span>`).join('')}</div>` : ''}
    </div>
    ${sections.map(s => `<div class="mb-5" data-section>
      <div class="mb-2 flex items-center gap-2">
        <h2 class="shrink-0 text-sm font-bold uppercase tracking-wider" style="color:${DG}">${esc(s.title)}</h2>
        <div class="h-px flex-1 bg-zinc-200"></div>
      </div>
      ${buildFormalSectionContent(s)}
    </div>`).join('')}
  </div>`;
}
