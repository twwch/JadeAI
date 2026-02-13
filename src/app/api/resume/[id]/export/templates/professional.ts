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
import { buildClassicSectionContent } from './classic';

function buildProfessionalSectionContent(section: Section): string {
  const c = section.content as any;
  const BLUE = '#1e3a5f';
  if (section.type === 'summary') return `<p class="text-sm leading-relaxed text-zinc-600" style="font-family:Georgia,serif">${esc((c as SummaryContent).text)}</p>`;
  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${BLUE}">${esc(it.position)}</span>${it.company ? `<span class="text-sm text-zinc-600"> — ${esc(it.company)}</span>` : ''}${it.location ? `<span class="text-sm text-zinc-400"> (${esc(it.location)})</span>` : ''}</div><span class="shrink-0 text-xs text-zinc-400 italic">${esc(it.startDate)} – ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-5">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${BLUE}">${esc(it.institution)}</span>${it.location ? `<span class="text-sm text-zinc-400"> (${esc(it.location)})</span>` : ''}</div><span class="shrink-0 text-xs text-zinc-400 italic">${esc(it.startDate)} – ${esc(it.endDate)}</span></div>
      <p class="text-sm text-zinc-600">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</p>
      ${it.gpa ? `<p class="text-xs text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-5">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'skills') {
    return `<div class="space-y-1.5">${((c as SkillsContent).categories || []).map((cat: any) =>
      `<div class="flex text-sm"><span class="w-32 shrink-0 font-semibold" style="color:${BLUE}">${esc(cat.name)}:</span><span class="text-zinc-600">${esc((cat.skills || []).join(', '))}</span></div>`
    ).join('')}</div>`;
  }
  if (section.type === 'projects') {
    return `<div class="space-y-3">${((c as ProjectsContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><span class="text-sm font-bold" style="color:${BLUE}">${esc(it.name)}</span>${it.startDate ? `<span class="shrink-0 text-xs text-zinc-400 italic">${esc(it.startDate)}${it.endDate ? ` – ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<p class="mt-0.5 text-xs text-zinc-400">Tech: ${esc(it.technologies.join(', '))}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-5">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'certifications') {
    return `<div class="space-y-1.5">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div class="flex items-baseline justify-between text-sm"><div><span class="font-semibold" style="color:${BLUE}">${esc(it.name)}</span>${it.issuer ? `<span class="text-zinc-600"> — ${esc(it.issuer)}</span>` : ''}</div>${it.date ? `<span class="shrink-0 text-xs text-zinc-400 italic">${esc(it.date)}</span>` : ''}</div>`
    ).join('')}</div>`;
  }
  if (section.type === 'languages') {
    return `<div class="flex flex-wrap gap-x-6 gap-y-1">${((c as LanguagesContent).items || []).map((it: any) =>
      `<span class="text-sm"><span class="font-semibold" style="color:${BLUE}">${esc(it.language)}</span><span class="text-zinc-500"> — ${esc(it.proficiency)}</span></span>`
    ).join('')}</div>`;
  }
  return buildClassicSectionContent(section);
}

export function buildProfessionalHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);
  const BLUE = '#1e3a5f';

  return `<div class="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style="font-family:Georgia,'Times New Roman',serif">
    <div class="mb-6 text-center">
      <div class="flex items-center justify-center gap-4">
        ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="shrink-0 rounded-full border-2 object-cover" style="height:4.5rem;width:4.5rem;border-color:${BLUE}"/>` : ''}
        <div>
          <h1 class="text-3xl font-bold tracking-wide" style="color:${BLUE}">${esc(pi.fullName || 'Your Name')}</h1>
          ${pi.jobTitle ? `<p class="mt-1 text-base font-light tracking-wider text-zinc-500 uppercase">${esc(pi.jobTitle)}</p>` : ''}
        </div>
      </div>
      ${contacts.length ? `<div class="mt-3 flex flex-wrap items-center justify-center gap-x-1.5 text-sm text-zinc-500">${contacts.map((c, i) => `<span class="flex items-center gap-1.5">${esc(c)}${i < contacts.length - 1 ? '<span class="text-zinc-300">|</span>' : ''}</span>`).join('')}</div>` : ''}
      <div class="mt-4 h-[2px] w-full" style="background:linear-gradient(90deg,transparent 0%,${BLUE} 20%,${BLUE} 80%,transparent 100%)"></div>
    </div>
    ${sections.map(s => `<div class="mb-5" data-section>
      <div class="mb-3 flex items-center gap-3"><h2 class="text-sm font-bold uppercase tracking-[0.2em]" style="color:${BLUE}">${esc(s.title)}</h2><div class="h-[1px] flex-1 bg-zinc-200"></div></div>
      ${buildProfessionalSectionContent(s)}
    </div>`).join('')}
  </div>`;
}
