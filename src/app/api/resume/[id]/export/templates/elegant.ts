import type {
  SummaryContent,
  WorkExperienceContent,
  EducationContent,
  SkillsContent,
} from '@/types/resume';
import { esc, getPersonalInfo, visibleSections, type ResumeWithSections, type Section } from '../utils';
import { buildClassicSectionContent } from './classic';

function buildElegantSectionContent(section: Section): string {
  const c = section.content as any;
  const GOLD = '#d4af37';
  if (section.type === 'summary') return `<p class="text-center text-sm leading-relaxed text-zinc-600 italic">${esc((c as SummaryContent).text)}</p>`;
  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:#2c2c2c">${esc(it.position)}</span>${it.company ? `<span class="text-sm text-zinc-500"> — ${esc(it.company)}</span>` : ''}</div><span class="shrink-0 text-xs italic text-zinc-400">${esc(it.startDate)} – ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-5">${it.highlights.filter(Boolean).map((h: string) => `<li class="text-sm text-zinc-600">${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:#2c2c2c">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</span>${it.institution ? `<span class="text-sm text-zinc-500"> — ${esc(it.institution)}</span>` : ''}</div><span class="shrink-0 text-xs italic text-zinc-400">${esc(it.startDate)} – ${esc(it.endDate)}</span></div>
      ${it.gpa ? `<p class="text-sm text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'skills') {
    return `<div class="space-y-1">${((c as SkillsContent).categories || []).map((cat: any) =>
      `<div class="flex text-sm"><span class="w-32 shrink-0 font-semibold" style="color:${GOLD}">${esc(cat.name)}:</span><span class="text-zinc-600">${esc((cat.skills || []).join(', '))}</span></div>`
    ).join('')}</div>`;
  }
  return buildClassicSectionContent(section);
}

export function buildElegantHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);
  const GOLD = '#d4af37';

  return `<div class="mx-auto max-w-[210mm] bg-white p-10 shadow-lg" style="font-family:Georgia,'Times New Roman',serif">
    <div class="mb-8 text-center">
      ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="mx-auto mb-3 h-20 w-20 rounded-full border-2 object-cover" style="border-color:${GOLD}"/>` : ''}
      <h1 class="text-3xl font-bold tracking-wide" style="color:#2c2c2c">${esc(pi.fullName || 'Your Name')}</h1>
      ${pi.jobTitle ? `<p class="mt-1 text-base tracking-widest text-zinc-500 uppercase">${esc(pi.jobTitle)}</p>` : ''}
      <div class="mx-auto mt-3 flex items-center justify-center gap-1">
        <div class="h-px flex-1" style="max-width:4rem;background:${GOLD}"></div>
        <div class="h-2 w-2 rotate-45" style="background:${GOLD}"></div>
        <div class="h-px flex-1" style="max-width:4rem;background:${GOLD}"></div>
      </div>
      ${contacts.length ? `<div class="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-500">${contacts.map(c => `<span>${esc(c)}</span>`).join('')}</div>` : ''}
    </div>
    ${sections.map(s => `<div class="mb-6" data-section>
      <div class="mb-3 flex items-center gap-3">
        <div class="h-px flex-1" style="background:${GOLD}"></div>
        <h2 class="shrink-0 text-sm font-bold uppercase tracking-[0.2em]" style="color:${GOLD}">${esc(s.title)}</h2>
        <div class="h-px flex-1" style="background:${GOLD}"></div>
      </div>
      ${buildElegantSectionContent(s)}
    </div>`).join('')}
  </div>`;
}
