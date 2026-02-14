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

const PRIMARY = '#1a1a1a';
const ACCENT = '#dc2626';
const SECONDARY = '#78716c';

function buildMagazineSectionContent(section: Section): string {
  const c = section.content as any;

  if (section.type === 'summary') {
    const text = (c as SummaryContent).text || '';
    const first = text.length > 0 ? text[0] : '';
    const rest = text.length > 0 ? text.slice(1) : '';
    return `<p class="text-sm leading-relaxed" style="color:${SECONDARY}">${first ? `<span class="float-left mr-1 text-3xl font-black leading-none" style="color:${ACCENT}">${esc(first)}</span>` : ''}${esc(rest)}</p>`;
  }

  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div class="border-l-2 pl-4" style="border-color:${ACCENT}">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.position)}</h3><span class="shrink-0 text-xs font-medium" style="color:${ACCENT}">${esc(it.startDate)} - ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.company ? `<p class="text-sm font-medium italic" style="color:${SECONDARY}">${esc(it.company)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm" style="color:${SECONDARY}">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1.5 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm" style="color:${SECONDARY}"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45" style="background-color:${ACCENT}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div class="border-l-2 pl-4" style="border-color:${ACCENT}">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.institution)}</h3><span class="text-xs" style="color:${SECONDARY}">${esc(it.startDate)} - ${esc(it.endDate)}</span></div>
      <p class="text-sm" style="color:${SECONDARY}">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</p>
      ${it.gpa ? `<p class="text-xs" style="color:${SECONDARY}">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm" style="color:${SECONDARY}"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45" style="background-color:${ACCENT}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'skills') {
    return `<div class="grid grid-cols-2 gap-x-6 gap-y-3">${((c as SkillsContent).categories || []).map((cat: any) =>
      `<div><p class="mb-1 text-xs font-bold uppercase tracking-wider" style="color:${ACCENT}">${esc(cat.name)}</p><p class="text-sm" style="color:${SECONDARY}">${esc((cat.skills || []).join(' / '))}</p></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'projects') {
    return `<div class="grid grid-cols-2 gap-4">${((c as ProjectsContent).items || []).map((it: any) => `<div class="border-l-2 pl-4" style="border-color:${ACCENT}">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.name)}</h3>${it.startDate ? `<span class="text-xs" style="color:${SECONDARY}">${esc(it.startDate)}${it.endDate ? ` - ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-0.5 text-sm" style="color:${SECONDARY}">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<p class="mt-1 text-xs italic" style="color:${ACCENT}">${esc(it.technologies.join(', '))}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm" style="color:${SECONDARY}"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45" style="background-color:${ACCENT}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'certifications') {
    return `<div class="space-y-1.5">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div class="flex items-baseline gap-2"><span class="h-1.5 w-1.5 shrink-0 rotate-45" style="background-color:${ACCENT}"></span><span class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.name)}</span><span class="text-xs" style="color:${SECONDARY}">${esc(it.issuer)}${it.date ? ` | ${esc(it.date)}` : ''}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'languages') {
    return `<div class="flex flex-wrap gap-4">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div class="flex items-baseline gap-2"><span class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.language)}</span><span class="text-xs uppercase tracking-wider" style="color:${ACCENT}">${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'custom') {
    return `<div class="space-y-3">${((c as CustomContent).items || []).map((it: any) => `<div class="border-l-2 pl-4" style="border-color:${ACCENT}">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.title)}</h3>${it.date ? `<span class="text-xs" style="color:${SECONDARY}">${esc(it.date)}</span>` : ''}</div>
      ${it.subtitle ? `<p class="text-sm italic" style="color:${SECONDARY}">${esc(it.subtitle)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm" style="color:${SECONDARY}">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }

  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div class="border-l-2 pl-4" style="border-color:${ACCENT}"><span class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm" style="color:${SECONDARY}">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }

  return '';
}

export function buildMagazineHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);

  return `<div class="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style="font-family:Georgia,serif">
    <div class="mb-6 border-b-2 pb-4" style="border-color:${ACCENT}">
      <div class="flex items-end gap-4">
        ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="h-20 w-20 shrink-0 rounded object-cover grayscale"/>` : ''}
        <div>
          <h1 class="text-4xl font-black uppercase tracking-tight" style="color:${PRIMARY};letter-spacing:-0.02em">${esc(pi.fullName || 'Your Name')}</h1>
          ${pi.jobTitle ? `<p class="mt-1 text-sm font-medium uppercase tracking-widest" style="color:${ACCENT}">${esc(pi.jobTitle)}</p>` : ''}
        </div>
      </div>
      ${contacts.length ? `<div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" style="color:${SECONDARY}">${contacts.map((c, i) => `<span class="flex items-center gap-1.5">${esc(c)}${i < contacts.length - 1 ? `<span style="color:${ACCENT}">|</span>` : ''}</span>`).join('')}</div>` : ''}
    </div>
    ${sections.map(s => `<div class="mb-5" data-section>
      <div class="mb-2 flex items-center gap-2"><div class="h-4 w-4 shrink-0" style="background-color:${ACCENT}"></div><h2 class="text-xs font-bold uppercase tracking-[0.2em]" style="color:${PRIMARY}">${esc(s.title)}</h2><div class="h-px flex-1" style="background-color:#e5e5e5"></div></div>
      ${buildMagazineSectionContent(s)}
    </div>`).join('')}
  </div>`;
}
