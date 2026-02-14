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

function buildAcademicSectionContent(section: Section): string {
  const c = section.content as any;
  if (section.type === 'summary') return `<p class="text-sm leading-relaxed text-zinc-600 indent-8">${esc((c as SummaryContent).text)}</p>`;
  if (section.type === 'work_experience') {
    return `<div class="space-y-2.5">${((c as WorkExperienceContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold text-zinc-800">${esc(it.position)}</span>${it.company ? `<span class="text-sm text-zinc-600">, ${esc(it.company)}</span>` : ''}${it.location ? `<span class="text-sm text-zinc-400">, ${esc(it.location)}</span>` : ''}</div><span class="shrink-0 text-xs text-zinc-500">${esc(it.startDate)} – ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.description ? `<p class="mt-0.5 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-0.5 list-disc pl-5">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'education') {
    return `<div class="space-y-2.5">${((c as EducationContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold text-zinc-800">${esc(it.degree)}</span>${it.field ? `<span class="text-sm text-zinc-600"> in ${esc(it.field)}</span>` : ''}</div><span class="shrink-0 text-xs text-zinc-500">${esc(it.startDate)} – ${esc(it.endDate)}</span></div>
      <p class="text-sm text-zinc-600">${esc(it.institution)}${it.location ? `, ${esc(it.location)}` : ''}</p>
      ${it.gpa ? `<p class="text-xs text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-0.5 list-disc pl-5">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'skills') {
    return `<div class="space-y-0.5">${((c as SkillsContent).categories || []).map((cat: any) =>
      `<p class="text-sm text-zinc-600"><span class="font-bold text-zinc-700">${esc(cat.name)}: </span>${esc((cat.skills || []).join(', '))}</p>`
    ).join('')}</div>`;
  }
  if (section.type === 'projects') {
    return `<div class="space-y-2.5">${((c as ProjectsContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold text-zinc-800">${esc(it.name)}</span>${it.url ? `<span class="text-xs text-zinc-400 ml-1">[${esc(it.url)}]</span>` : ''}</div>${it.startDate ? `<span class="shrink-0 text-xs text-zinc-500">${esc(it.startDate)}${it.endDate ? ` – ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-0.5 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<p class="text-xs text-zinc-500 italic">Technologies: ${esc(it.technologies.join(', '))}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-0.5 list-disc pl-5">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'certifications') {
    return `<div class="space-y-1">${((c as CertificationsContent).items || []).map((it: any) =>
      `<p class="text-sm text-zinc-600"><span class="font-bold text-zinc-700">${esc(it.name)}</span>${it.issuer ? `<span>, ${esc(it.issuer)}</span>` : ''}${it.date ? `<span class="text-zinc-500"> (${esc(it.date)})</span>` : ''}</p>`
    ).join('')}</div>`;
  }
  if (section.type === 'languages') {
    return `<p class="text-sm text-zinc-600">${((c as LanguagesContent).items || []).map((it: any, i: number, arr: any[]) =>
      `<span class="font-bold text-zinc-700">${esc(it.language)}</span> (${esc(it.proficiency)})${i < arr.length - 1 ? '; ' : ''}`
    ).join('')}</p>`;
  }
  if (section.type === 'custom') {
    return `<div class="space-y-2">${((c as CustomContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold text-zinc-800">${esc(it.title)}</span>${it.subtitle ? `<span class="text-sm text-zinc-600">, ${esc(it.subtitle)}</span>` : ''}</div>${it.date ? `<span class="shrink-0 text-xs text-zinc-500">${esc(it.date)}</span>` : ''}</div>
      ${it.description ? `<p class="mt-0.5 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }
  if (c.items) {
    return `<div class="space-y-1">${c.items.map((it: any) => `<div><span class="text-sm font-bold text-zinc-700">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm text-zinc-600">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }
  return '';
}

export function buildAcademicHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);

  return `<div class="mx-auto max-w-[210mm] bg-white px-10 py-8 shadow-lg" style="font-family:'Computer Modern','CMU Serif',Georgia,'Times New Roman',serif">
    <div class="mb-6 text-center">
      <h1 class="text-2xl font-bold text-zinc-900" style="letter-spacing:0.02em">${esc(pi.fullName || 'Your Name')}</h1>
      ${pi.jobTitle ? `<p class="mt-0.5 text-base text-zinc-500 italic">${esc(pi.jobTitle)}</p>` : ''}
      ${contacts.length ? `<p class="mt-1.5 text-xs text-zinc-500">${contacts.map((c, i) => `${esc(c)}${i < contacts.length - 1 ? ' \u00B7 ' : ''}`).join('')}</p>` : ''}
      <div class="mt-3 border-b-2 border-zinc-800"></div>
    </div>
    ${sections.map(s => `<div class="mb-4" data-section>
      <h2 class="mb-1.5 text-xs font-bold uppercase tracking-[0.25em] text-zinc-800" style="border-bottom:1px solid #d4d4d8;padding-bottom:2px">${esc(s.title)}</h2>
      ${buildAcademicSectionContent(s)}
    </div>`).join('')}
  </div>`;
}
