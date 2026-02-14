import type {
  SummaryContent,
  WorkExperienceContent,
  EducationContent,
  SkillsContent,
  ProjectsContent,
  CertificationsContent,
  LanguagesContent,
} from '@/types/resume';
import { esc, getPersonalInfo, visibleSections, buildHighlights, type ResumeWithSections, type Section } from '../utils';

function buildCompactRightContent(section: Section): string {
  const c = section.content as any;
  if (section.type === 'summary') return `<p class="text-xs leading-relaxed text-zinc-600">${esc((c as SummaryContent).text)}</p>`;
  if (section.type === 'work_experience') {
    return `<div class="space-y-2.5">${((c as WorkExperienceContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-xs font-bold text-zinc-800">${esc(it.position)}</span>${it.company ? `<span class="text-xs text-zinc-500"> | ${esc(it.company)}</span>` : ''}</div><span class="shrink-0 text-[10px] text-zinc-400">${esc(it.startDate)} – ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.description ? `<p class="mt-0.5 text-xs text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-0.5 list-disc pl-3.5">${buildHighlights(it.highlights, 'text-xs text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'education') {
    return `<div class="space-y-2">${((c as EducationContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-xs font-bold text-zinc-800">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</span>${it.institution ? `<span class="text-xs text-zinc-500"> — ${esc(it.institution)}</span>` : ''}</div><span class="shrink-0 text-[10px] text-zinc-400">${esc(it.startDate)} – ${esc(it.endDate)}</span></div>
      ${it.gpa ? `<p class="text-[10px] text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'projects') {
    return `<div class="space-y-2">${((c as ProjectsContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><span class="text-xs font-bold text-zinc-800">${esc(it.name)}</span>${it.startDate ? `<span class="shrink-0 text-[10px] text-zinc-400">${esc(it.startDate)}${it.endDate ? ` – ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-0.5 text-xs text-zinc-600">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }
  if (c.items) {
    return `<div class="space-y-1.5">${c.items.map((it: any) => `<div>
      <span class="text-xs font-medium text-zinc-700">${esc(it.name || it.title || it.language)}</span>
      ${it.description ? `<p class="text-xs text-zinc-600">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }
  return '';
}

function buildCompactLeftContent(section: Section): string {
  const c = section.content as any;
  if (section.type === 'skills') {
    return `<div class="space-y-1.5">${((c as SkillsContent).categories || []).map((cat: any) =>
      `<div><p class="text-[10px] font-semibold text-zinc-600">${esc(cat.name)}</p><p class="text-[10px] text-zinc-500">${esc((cat.skills || []).join(', '))}</p></div>`
    ).join('')}</div>`;
  }
  if (section.type === 'languages') {
    return `<div class="space-y-0.5">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div class="flex items-center justify-between text-[10px]"><span class="font-medium text-zinc-700">${esc(it.language)}</span><span class="text-zinc-400">${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }
  if (section.type === 'certifications') {
    return `<div class="space-y-1">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div><p class="text-[10px] font-semibold text-zinc-700">${esc(it.name)}</p><p class="text-[9px] text-zinc-400">${esc(it.issuer)}${it.date ? ` (${esc(it.date)})` : ''}</p></div>`
    ).join('')}</div>`;
  }
  if (c.items) {
    return `<div class="space-y-1">${c.items.map((it: any) => `<div>
      <span class="text-[10px] font-medium text-zinc-700">${esc(it.name || it.title || it.language)}</span>
      ${it.description ? `<p class="text-[9px] text-zinc-400">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }
  return '';
}

export function buildCompactHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const LEFT_TYPES = new Set(['skills', 'languages', 'certifications', 'custom']);
  const sections = visibleSections(resume);
  const leftSections = sections.filter(s => LEFT_TYPES.has(s.type));
  const rightSections = sections.filter(s => !LEFT_TYPES.has(s.type));

  const contactParts: string[] = [];
  if (pi.jobTitle) contactParts.push(`<span class="font-medium text-zinc-700">${esc(pi.jobTitle)}</span>`);
  if (pi.email) { contactParts.push(`<span class="text-zinc-300">|</span>`); contactParts.push(`<span>${esc(pi.email)}</span>`); }
  if (pi.phone) { contactParts.push(`<span class="text-zinc-300">|</span>`); contactParts.push(`<span>${esc(pi.phone)}</span>`); }
  if (pi.location) { contactParts.push(`<span class="text-zinc-300">|</span>`); contactParts.push(`<span>${esc(pi.location)}</span>`); }
  if (pi.website) { contactParts.push(`<span class="text-zinc-300">|</span>`); contactParts.push(`<span>${esc(pi.website)}</span>`); }

  return `<div class="mx-auto max-w-[210mm] bg-white shadow-lg" style="font-family:Inter,sans-serif">
    <div class="border-b border-zinc-200 px-6 py-4">
      <div class="flex items-center gap-3">
        ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="h-12 w-12 shrink-0 rounded-full object-cover"/>` : ''}
        <div class="flex-1">
          <h1 class="text-xl font-bold text-zinc-900">${esc(pi.fullName || 'Your Name')}</h1>
          <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-zinc-500">${contactParts.join('')}</div>
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="w-[32%] shrink-0 border-r border-zinc-100 bg-zinc-50 p-4">
        ${leftSections.map(s => `<div class="mb-4" data-section>
          <h2 class="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">${esc(s.title)}</h2>
          ${buildCompactLeftContent(s)}
        </div>`).join('')}
      </div>
      <div class="flex-1 p-4">
        ${rightSections.map(s => `<div class="mb-4" data-section>
          <h2 class="mb-1.5 border-b border-zinc-200 pb-0.5 text-xs font-bold uppercase tracking-wider text-zinc-700">${esc(s.title)}</h2>
          ${buildCompactRightContent(s)}
        </div>`).join('')}
      </div>
    </div>
  </div>`;
}
