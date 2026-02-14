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

function buildAtsSectionContent(section: Section): string {
  const c = section.content as any;
  if (section.type === 'summary') return `<p class="text-sm leading-relaxed text-zinc-700">${esc((c as SummaryContent).text)}</p>`;
  if (section.type === 'work_experience') {
    return `<div class="space-y-3">${((c as WorkExperienceContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold text-black">${esc(it.position)}</span>${it.company ? `<span class="text-sm text-zinc-700">, ${esc(it.company)}</span>` : ''}${it.location ? `<span class="text-sm text-zinc-500">, ${esc(it.location)}</span>` : ''}</div><span class="shrink-0 text-sm text-zinc-600">${esc(it.startDate)} - ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.description ? `<p class="mt-0.5 text-sm text-zinc-700">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-5">${buildHighlights(it.highlights, 'text-sm text-zinc-700')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'education') {
    return `<div class="space-y-2">${((c as EducationContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold text-black">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</span>${it.institution ? `<span class="text-sm text-zinc-700">, ${esc(it.institution)}</span>` : ''}${it.location ? `<span class="text-sm text-zinc-500">, ${esc(it.location)}</span>` : ''}</div><span class="shrink-0 text-sm text-zinc-600">${esc(it.startDate)} - ${esc(it.endDate)}</span></div>
      ${it.gpa ? `<p class="text-sm text-zinc-600">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-5">${buildHighlights(it.highlights, 'text-sm text-zinc-700')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'skills') {
    return `<div class="space-y-1">${((c as SkillsContent).categories || []).map((cat: any) =>
      `<p class="text-sm text-zinc-700"><span class="font-bold text-black">${esc(cat.name)}: </span>${esc((cat.skills || []).join(', '))}</p>`
    ).join('')}</div>`;
  }
  if (section.type === 'projects') {
    return `<div class="space-y-3">${((c as ProjectsContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><span class="text-sm font-bold text-black">${esc(it.name)}</span>${it.startDate ? `<span class="shrink-0 text-sm text-zinc-600">${esc(it.startDate)}${it.endDate ? ` - ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-0.5 text-sm text-zinc-700">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<p class="text-sm text-zinc-600">Technologies: ${esc(it.technologies.join(', '))}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-5">${buildHighlights(it.highlights, 'text-sm text-zinc-700')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'certifications') {
    return `<div class="space-y-1">${((c as CertificationsContent).items || []).map((it: any) =>
      `<p class="text-sm text-zinc-700"><span class="font-bold text-black">${esc(it.name)}</span>${it.issuer ? `<span> - ${esc(it.issuer)}</span>` : ''}${it.date ? `<span> (${esc(it.date)})</span>` : ''}</p>`
    ).join('')}</div>`;
  }
  if (section.type === 'languages') {
    return `<p class="text-sm text-zinc-700">${((c as LanguagesContent).items || []).map((it: any, i: number, arr: any[]) =>
      `${esc(it.language)} (${esc(it.proficiency)})${i < arr.length - 1 ? ', ' : ''}`
    ).join('')}</p>`;
  }
  if (section.type === 'custom') {
    return `<div class="space-y-2">${((c as CustomContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold text-black">${esc(it.title)}</span>${it.subtitle ? `<span class="text-sm text-zinc-600"> - ${esc(it.subtitle)}</span>` : ''}</div>${it.date ? `<span class="shrink-0 text-sm text-zinc-600">${esc(it.date)}</span>` : ''}</div>
      ${it.description ? `<p class="mt-0.5 text-sm text-zinc-700">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }
  if (c.items) {
    return `<div class="space-y-1">${c.items.map((it: any) => `<div><span class="text-sm font-bold text-black">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm text-zinc-700">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }
  return '';
}

export function buildAtsHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);

  return `<div class="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style="font-family:Arial,Helvetica,sans-serif">
    <div class="mb-4 text-center">
      <h1 class="text-2xl font-bold text-black">${esc(pi.fullName || 'Your Name')}</h1>
      ${pi.jobTitle ? `<p class="mt-0.5 text-base text-zinc-700">${esc(pi.jobTitle)}</p>` : ''}
      ${contacts.length ? `<p class="mt-1 text-sm text-zinc-600">${contacts.map(c => esc(c)).join(' | ')}</p>` : ''}
    </div>
    <hr class="mb-4 border-black"/>
    ${sections.map(s => `<div class="mb-4" data-section>
      <h2 class="mb-1.5 border-b border-black pb-0.5 text-base font-bold uppercase text-black">${esc(s.title)}</h2>
      ${buildAtsSectionContent(s)}
    </div>`).join('')}
  </div>`;
}
