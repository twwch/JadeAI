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
import { esc, getPersonalInfo, visibleSections, type ResumeWithSections, type Section } from '../utils';

const GOLD = '#d4af37';
const TEXT = '#000000';
const BG = '#fafaf9';

function buildLuxeSectionContent(section: Section): string {
  const c = section.content as any;

  if (section.type === 'summary') return `<p class="text-center text-sm italic leading-relaxed" style="color:#44403c">${esc((c as SummaryContent).text)}</p>`;

  if (section.type === 'work_experience') {
    return `<div class="space-y-5">${((c as WorkExperienceContent).items || []).map((it: any) => `<div class="border-l-2 pl-4" style="border-color:${GOLD}">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${TEXT}">${esc(it.position)}</h3><span class="shrink-0 text-xs italic" style="color:#a8a29e">${esc(it.startDate)} &ndash; ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.company ? `<p class="text-sm" style="color:${GOLD}">${esc(it.company)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm" style="color:#44403c">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1.5 list-none space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm" style="color:#44403c"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45" style="background-color:${GOLD}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'education') {
    return `<div class="space-y-4">${((c as EducationContent).items || []).map((it: any) => `<div class="border-l-2 pl-4" style="border-color:${GOLD}">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${TEXT}">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</h3><span class="shrink-0 text-xs italic" style="color:#a8a29e">${esc(it.startDate)} &ndash; ${esc(it.endDate)}</span></div>
      ${it.institution ? `<p class="text-sm" style="color:${GOLD}">${esc(it.institution)}</p>` : ''}
      ${it.gpa ? `<p class="text-xs" style="color:#a8a29e">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-none space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm" style="color:#44403c"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45" style="background-color:${GOLD}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'skills') {
    return `<div class="space-y-1.5">${((c as SkillsContent).categories || []).map((cat: any) =>
      `<div class="flex text-sm"><span class="w-32 shrink-0 font-bold" style="color:${GOLD}">${esc(cat.name)}:</span><span style="color:#44403c">${esc((cat.skills || []).join(', '))}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'projects') {
    return `<div class="space-y-4">${((c as ProjectsContent).items || []).map((it: any) => `<div class="border-l-2 pl-4" style="border-color:${GOLD}">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${TEXT}">${esc(it.name)}</h3>${it.startDate ? `<span class="shrink-0 text-xs italic" style="color:#a8a29e">${esc(it.startDate)}${it.endDate ? ` \u2013 ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-0.5 text-sm" style="color:#44403c">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<p class="mt-0.5 text-xs italic" style="color:#a8a29e">Tech: ${esc(it.technologies.join(', '))}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-none space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm" style="color:#44403c"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45" style="background-color:${GOLD}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'certifications') {
    return `<div class="space-y-2">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${TEXT}">${esc(it.name)}</span><span class="text-sm" style="color:#a8a29e"> &mdash; ${esc(it.issuer)}</span></div>${it.date ? `<span class="shrink-0 text-xs italic" style="color:${GOLD}">${esc(it.date)}</span>` : ''}</div>`
    ).join('')}</div>`;
  }

  if (section.type === 'languages') {
    return `<div class="flex flex-wrap gap-4">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div class="flex items-center gap-2"><span class="h-1.5 w-1.5 rotate-45" style="background-color:${GOLD}"></span><span class="text-sm font-bold" style="color:${TEXT}">${esc(it.language)}</span><span class="text-xs" style="color:#a8a29e">${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'custom') {
    return `<div class="space-y-4">${((c as CustomContent).items || []).map((it: any) => `<div class="border-l-2 pl-4" style="border-color:${GOLD}">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${TEXT}">${esc(it.title)}</h3>${it.date ? `<span class="shrink-0 text-xs italic" style="color:${GOLD}">${esc(it.date)}</span>` : ''}</div>
      ${it.subtitle ? `<p class="text-sm" style="color:${GOLD}">${esc(it.subtitle)}</p>` : ''}
      ${it.description ? `<p class="mt-0.5 text-sm" style="color:#44403c">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }

  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div><span class="text-sm font-bold" style="color:${TEXT}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm" style="color:#44403c">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }

  return '';
}

export function buildLuxeHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);

  return `<div class="mx-auto max-w-[210mm] p-8 shadow-lg" style="font-family:Georgia,serif;background-color:${BG}">
    <div class="mb-8 border-b-2 pb-6" style="border-color:${GOLD}">
      <div class="text-center">
        ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="mx-auto mb-3 h-20 w-20 rounded-full border-2 object-cover" style="border-color:${GOLD}"/>` : ''}
        <h1 class="text-3xl font-bold tracking-wider uppercase" style="color:${TEXT};letter-spacing:0.15em">${esc(pi.fullName || 'Your Name')}</h1>
        ${pi.jobTitle ? `<p class="mt-2 text-sm tracking-[0.2em] uppercase" style="color:${GOLD}">${esc(pi.jobTitle)}</p>` : ''}
        <div class="mx-auto mt-4 flex items-center justify-center gap-2">
          <div class="h-px w-16" style="background-color:${GOLD}"></div>
          <div class="h-2 w-2 rotate-45" style="background-color:${GOLD}"></div>
          <div class="h-px w-16" style="background-color:${GOLD}"></div>
        </div>
        ${contacts.length ? `<div class="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs" style="color:#78716c">${contacts.map(c => `<span>${esc(c)}</span>`).join('')}</div>` : ''}
      </div>
    </div>
    ${sections.map(s => `<div class="mb-7" data-section>
      <div class="mb-4 flex items-center gap-3">
        <div class="h-px flex-1" style="background-color:${GOLD}"></div>
        <h2 class="shrink-0 text-xs font-bold uppercase tracking-[0.2em]" style="color:${GOLD}">${esc(s.title)}</h2>
        <div class="h-px flex-1" style="background-color:${GOLD}"></div>
      </div>
      ${buildLuxeSectionContent(s)}
    </div>`).join('')}
  </div>`;
}
