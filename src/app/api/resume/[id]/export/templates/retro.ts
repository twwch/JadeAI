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

const PRIMARY = '#78350f';
const ACCENT = '#92400e';
const BG = '#fefce8';
const TEXT = '#57534e';

function buildRetroSectionContent(section: Section): string {
  const c = section.content as any;

  if (section.type === 'summary') {
    return `<p class="text-center text-sm italic leading-relaxed" style="color:${ACCENT}">&ldquo;${esc((c as SummaryContent).text)}&rdquo;</p>`;
  }

  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.position)}</h3><span class="shrink-0 text-xs" style="color:${ACCENT};font-family:'Courier New',monospace">${esc(it.startDate)} - ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.company ? `<p class="text-sm italic" style="color:${ACCENT}">${esc(it.company)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm" style="color:${TEXT}">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1.5 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm" style="color:${TEXT}"><span class="mt-1 shrink-0 text-xs" style="color:${PRIMARY}">&bull;</span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.institution)}</h3><span class="text-xs" style="color:${ACCENT};font-family:'Courier New',monospace">${esc(it.startDate)} - ${esc(it.endDate)}</span></div>
      <p class="text-sm" style="color:${TEXT}">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</p>
      ${it.gpa ? `<p class="text-xs" style="color:${ACCENT}">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm" style="color:${TEXT}"><span class="mt-1 shrink-0 text-xs" style="color:${PRIMARY}">&bull;</span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'skills') {
    return `<div class="space-y-2">${((c as SkillsContent).categories || []).map((cat: any) =>
      `<div class="flex text-sm"><span class="w-32 shrink-0 font-bold" style="color:${PRIMARY};font-family:'Courier New',monospace">${esc(cat.name)}:</span><span style="color:${TEXT}">${esc((cat.skills || []).join(' \u2022 '))}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'projects') {
    return `<div class="space-y-3">${((c as ProjectsContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.name)}</h3>${it.startDate ? `<span class="text-xs" style="color:${ACCENT};font-family:'Courier New',monospace">${esc(it.startDate)}${it.endDate ? ` - ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-0.5 text-sm" style="color:${TEXT}">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<p class="mt-1 text-xs italic" style="color:${ACCENT}">Technologies: ${esc(it.technologies.join(', '))}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm" style="color:${TEXT}"><span class="mt-1 shrink-0 text-xs" style="color:${PRIMARY}">&bull;</span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'certifications') {
    return `<div class="space-y-1.5">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div class="flex items-baseline gap-2"><span class="shrink-0 text-xs" style="color:${PRIMARY}">&diams;</span><span class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.name)}</span><span class="text-xs" style="color:${ACCENT}">${esc(it.issuer)}${it.date ? ` (${esc(it.date)})` : ''}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'languages') {
    return `<div class="flex flex-wrap gap-4">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div class="flex items-baseline gap-2"><span class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.language)}</span><span class="text-xs italic" style="color:${ACCENT}">${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'custom') {
    return `<div class="space-y-3">${((c as CustomContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.title)}</h3>${it.date ? `<span class="text-xs" style="color:${ACCENT};font-family:'Courier New',monospace">${esc(it.date)}</span>` : ''}</div>
      ${it.subtitle ? `<p class="text-sm italic" style="color:${ACCENT}">${esc(it.subtitle)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm" style="color:${TEXT}">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }

  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div><span class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm" style="color:${TEXT}">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }

  return '';
}

export function buildRetroHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);

  const sectionHtml = sections.map((s, idx) => {
    const divider = idx < sections.length - 1
      ? `<div class="mb-4 flex items-center justify-center gap-2 text-xs" style="color:${PRIMARY}40"><div class="h-px w-12" style="background-color:${PRIMARY}20"></div><span>&#10022;</span><div class="h-px w-12" style="background-color:${PRIMARY}20"></div></div>`
      : '';
    return `<div data-section>
      <div class="mb-2 text-center"><h2 class="inline-block text-xs font-bold uppercase tracking-[0.3em]" style="color:${PRIMARY};border-bottom:1px solid ${PRIMARY};border-top:1px solid ${PRIMARY};padding:4px 16px">${esc(s.title)}</h2></div>
      <div class="mb-4">${buildRetroSectionContent(s)}</div>
      ${divider}
    </div>`;
  }).join('');

  return `<div class="mx-auto max-w-[210mm] p-8 shadow-lg" style="font-family:Georgia,serif;background-color:${BG}">
    <div class="mb-6 pb-4 text-center" style="border-bottom:3px double ${PRIMARY}">
      ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="mx-auto mb-3 h-20 w-20 rounded-full object-cover" style="border:2px solid ${PRIMARY}"/>` : ''}
      <h1 class="text-3xl font-bold" style="color:${PRIMARY};font-family:'Courier New',monospace">${esc(pi.fullName || 'Your Name')}</h1>
      ${pi.jobTitle ? `<p class="mt-1 text-sm italic" style="color:${ACCENT}">${esc(pi.jobTitle)}</p>` : ''}
      ${contacts.length ? `<div class="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs" style="color:${ACCENT}">${contacts.map((c, i) => `<span class="flex items-center gap-1.5" style="font-family:'Courier New',monospace">${esc(c)}${i < contacts.length - 1 ? `<span style="color:${PRIMARY}40">&bull;</span>` : ''}</span>`).join('')}</div>` : ''}
      <div class="mx-auto mt-3 flex items-center justify-center gap-2 text-sm" style="color:${PRIMARY}60"><span>~</span><span>&diams;</span><span>~</span></div>
    </div>
    ${sectionHtml}
  </div>`;
}
