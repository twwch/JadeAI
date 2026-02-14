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

const RED = '#dc2626';
const TEXT = '#18181b';

function buildSwissSectionContent(section: Section): string {
  const c = section.content as any;

  if (section.type === 'summary') return `<p class="text-sm leading-relaxed" style="color:#3f3f46">${esc((c as SummaryContent).text)}</p>`;

  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div class="grid grid-cols-[140px_1fr] gap-4">
      <div class="text-xs" style="color:#71717a"><span>${esc(it.startDate)} &ndash; ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      <div>
        <h3 class="text-sm font-bold" style="color:${TEXT}">${esc(it.position)}</h3>
        ${it.company ? `<p class="text-sm" style="color:${RED}">${esc(it.company)}</p>` : ''}
        ${it.description ? `<p class="mt-1 text-sm" style="color:#3f3f46">${esc(it.description)}</p>` : ''}
        ${it.highlights?.length ? `<ul class="mt-1 list-none space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm" style="color:#3f3f46"><span class="mt-1.5 inline-block h-1 w-1 shrink-0" style="background-color:${RED}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
      </div>
    </div>`).join('')}</div>`;
  }

  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div class="grid grid-cols-[140px_1fr] gap-4">
      <span class="text-xs" style="color:#71717a">${esc(it.startDate)} &ndash; ${esc(it.endDate)}</span>
      <div>
        <h3 class="text-sm font-bold" style="color:${TEXT}">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</h3>
        ${it.institution ? `<p class="text-sm" style="color:${RED}">${esc(it.institution)}</p>` : ''}
        ${it.gpa ? `<p class="text-xs" style="color:#71717a">GPA: ${esc(it.gpa)}</p>` : ''}
        ${it.highlights?.length ? `<ul class="mt-1 list-none space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm" style="color:#3f3f46"><span class="mt-1.5 inline-block h-1 w-1 shrink-0" style="background-color:${RED}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
      </div>
    </div>`).join('')}</div>`;
  }

  if (section.type === 'skills') {
    return `<div class="space-y-1.5">${((c as SkillsContent).categories || []).map((cat: any) =>
      `<div class="grid grid-cols-[140px_1fr] gap-4 text-sm"><span class="font-bold" style="color:${TEXT}">${esc(cat.name)}</span><span style="color:#3f3f46">${esc((cat.skills || []).join(' / '))}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'projects') {
    return `<div class="space-y-3">${((c as ProjectsContent).items || []).map((it: any) => `<div class="grid grid-cols-[140px_1fr] gap-4">
      ${it.startDate ? `<span class="text-xs" style="color:#71717a">${esc(it.startDate)}${it.endDate ? ` \u2013 ${esc(it.endDate)}` : ''}</span>` : '<span></span>'}
      <div>
        <h3 class="text-sm font-bold" style="color:${TEXT}">${esc(it.name)}</h3>
        ${it.description ? `<p class="mt-0.5 text-sm" style="color:#3f3f46">${esc(it.description)}</p>` : ''}
        ${it.technologies?.length ? `<p class="mt-0.5 text-xs" style="color:#71717a">Tech: ${esc(it.technologies.join(', '))}</p>` : ''}
        ${it.highlights?.length ? `<ul class="mt-1 list-none space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm" style="color:#3f3f46"><span class="mt-1.5 inline-block h-1 w-1 shrink-0" style="background-color:${RED}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
      </div>
    </div>`).join('')}</div>`;
  }

  if (section.type === 'certifications') {
    return `<div class="space-y-1.5">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div class="grid grid-cols-[140px_1fr] gap-4"><span class="text-xs" style="color:#71717a">${esc(it.date)}</span><div><span class="text-sm font-bold" style="color:${TEXT}">${esc(it.name)}</span><span class="text-sm" style="color:#3f3f46"> &mdash; ${esc(it.issuer)}</span></div></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'languages') {
    return `<div class="flex flex-wrap gap-x-6 gap-y-1.5">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div class="text-sm"><span class="font-bold" style="color:${TEXT}">${esc(it.language)}</span><span style="color:#71717a"> &mdash; ${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'custom') {
    return `<div class="space-y-3">${((c as CustomContent).items || []).map((it: any) => `<div class="grid grid-cols-[140px_1fr] gap-4">
      ${it.date ? `<span class="text-xs" style="color:#71717a">${esc(it.date)}</span>` : '<span></span>'}
      <div>
        <h3 class="text-sm font-bold" style="color:${TEXT}">${esc(it.title)}</h3>
        ${it.subtitle ? `<p class="text-sm" style="color:${RED}">${esc(it.subtitle)}</p>` : ''}
        ${it.description ? `<p class="mt-0.5 text-sm" style="color:#3f3f46">${esc(it.description)}</p>` : ''}
      </div>
    </div>`).join('')}</div>`;
  }

  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div><span class="text-sm font-bold" style="color:${TEXT}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm" style="color:#3f3f46">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }

  return '';
}

export function buildSwissHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);

  return `<div class="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style="font-family:Helvetica Neue,Helvetica,Arial,sans-serif">
    <div class="mb-8">
      <div class="flex items-start gap-6">
        ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="h-16 w-16 shrink-0 object-cover grayscale"/>` : ''}
        <div class="flex-1">
          <h1 class="text-3xl font-bold uppercase tracking-tight" style="color:${TEXT}">${esc(pi.fullName || 'Your Name')}</h1>
          ${pi.jobTitle ? `<p class="mt-1 text-sm font-light uppercase tracking-[0.15em]" style="color:#71717a">${esc(pi.jobTitle)}</p>` : ''}
        </div>
      </div>
      ${contacts.length ? `<div class="mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t border-black pt-3 text-xs" style="color:${TEXT}">${contacts.map(c => `<span>${esc(c)}</span>`).join('')}</div>` : ''}
    </div>
    ${sections.map(s => `<div class="mb-6" data-section>
      <div class="mb-3 flex items-center gap-2 border-b border-zinc-200 pb-2">
        <span class="inline-block h-2.5 w-2.5 shrink-0" style="background-color:${RED}"></span>
        <h2 class="text-xs font-bold uppercase tracking-[0.2em]" style="color:${TEXT}">${esc(s.title)}</h2>
      </div>
      ${buildSwissSectionContent(s)}
    </div>`).join('')}
  </div>`;
}
