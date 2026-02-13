import type {
  SummaryContent,
  WorkExperienceContent,
  EducationContent,
  SkillsContent,
} from '@/types/resume';
import { esc, getPersonalInfo, visibleSections, buildHighlights, type ResumeWithSections, type Section } from '../utils';
import { buildClassicSectionContent } from './classic';

function buildMinimalSectionContent(section: Section): string {
  const c = section.content as any;
  if (section.type === 'summary') return `<p class="text-sm text-zinc-600 leading-relaxed">${esc((c as SummaryContent).text)}</p>`;
  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div>
      <p class="text-sm"><span class="font-medium text-zinc-800">${esc(it.position)}</span>${it.company ? ` <span class="text-zinc-500">/ ${esc(it.company)}</span>` : ''}</p>
      <p class="text-xs text-zinc-400">${esc(it.startDate)} - ${it.current ? 'Present' : esc(it.endDate)}</p>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div>
      <p class="text-sm"><span class="font-medium text-zinc-800">${esc(it.institution)}</span></p>
      <p class="text-sm text-zinc-600">${esc(it.degree)} ${it.field ? `- ${esc(it.field)}` : ''}</p>
      <p class="text-xs text-zinc-400">${esc(it.startDate)} - ${esc(it.endDate)}</p>
      ${it.gpa ? `<p class="text-sm text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'skills') {
    return `<div class="space-y-1">${((c as SkillsContent).categories || []).map((cat: any) =>
      `<p class="text-sm text-zinc-600">${esc((cat.skills || []).join(' / '))}</p>`
    ).join('')}</div>`;
  }
  return buildClassicSectionContent(section);
}

export function buildMinimalHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);

  return `<div class="mx-auto max-w-[210mm] bg-white p-10 shadow-lg" style="font-family:Inter,sans-serif">
    <div class="mb-8">
      <div class="flex items-center gap-3">
        ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="h-12 w-12 shrink-0 rounded-full object-cover"/>` : ''}
        <div>
          <h1 class="text-xl font-medium text-zinc-900">${esc(pi.fullName || 'Your Name')}</h1>
          <div class="mt-1 flex flex-wrap gap-3 text-sm text-zinc-500">
            ${pi.jobTitle ? `<span>${esc(pi.jobTitle)}</span>` : ''}
            ${pi.email ? `<span>${esc(pi.email)}</span>` : ''}
            ${pi.phone ? `<span>${esc(pi.phone)}</span>` : ''}
            ${pi.location ? `<span>${esc(pi.location)}</span>` : ''}
          </div>
        </div>
      </div>
    </div>
    ${sections.map(s => `<div class="mb-6" data-section>
      <h2 class="mb-2 text-xs font-medium uppercase tracking-widest text-zinc-400">${esc(s.title)}</h2>
      ${buildMinimalSectionContent(s)}
    </div>`).join('')}
  </div>`;
}
