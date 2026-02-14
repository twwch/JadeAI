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

const PRIMARY = '#1c1917';
const ACCENT = '#a8a29e';

function buildJapaneseSectionContent(section: Section): string {
  const c = section.content as any;

  if (section.type === 'summary') return `<p class="text-sm font-light leading-loose" style="color:#57534e">${esc((c as SummaryContent).text)}</p>`;

  if (section.type === 'work_experience') {
    return `<div class="space-y-6">${((c as WorkExperienceContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between">
        <h3 class="text-sm font-normal" style="color:${PRIMARY}">${esc(it.position)}</h3>
        <span class="shrink-0 text-[10px] font-light" style="color:${ACCENT}">${esc(it.startDate)} &ndash; ${it.current ? 'Present' : esc(it.endDate)}</span>
      </div>
      ${it.company ? `<p class="mt-0.5 text-xs font-light" style="color:${ACCENT}">${esc(it.company)}</p>` : ''}
      ${it.description ? `<p class="mt-2 text-sm font-light leading-relaxed" style="color:#57534e">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-2 space-y-1">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-3 text-sm font-light" style="color:#57534e"><span class="mt-2 inline-block h-px w-3 shrink-0" style="background-color:${ACCENT}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
      <div class="mt-4 h-px" style="background-color:${ACCENT};opacity:0.2"></div>
    </div>`).join('')}</div>`;
  }

  if (section.type === 'education') {
    return `<div class="space-y-5">${((c as EducationContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between">
        <h3 class="text-sm font-normal" style="color:${PRIMARY}">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</h3>
        <span class="shrink-0 text-[10px] font-light" style="color:${ACCENT}">${esc(it.startDate)} &ndash; ${esc(it.endDate)}</span>
      </div>
      ${it.institution ? `<p class="mt-0.5 text-xs font-light" style="color:${ACCENT}">${esc(it.institution)}</p>` : ''}
      ${it.gpa ? `<p class="mt-1 text-xs font-light" style="color:${ACCENT}">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-2 space-y-1">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-3 text-sm font-light" style="color:#57534e"><span class="mt-2 inline-block h-px w-3 shrink-0" style="background-color:${ACCENT}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'skills') {
    return `<div class="space-y-2">${((c as SkillsContent).categories || []).map((cat: any) =>
      `<div class="flex text-sm"><span class="w-32 shrink-0 font-normal" style="color:${PRIMARY}">${esc(cat.name)}</span><span class="font-light" style="color:#57534e">${esc((cat.skills || []).join(', '))}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'projects') {
    return `<div class="space-y-5">${((c as ProjectsContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between">
        <h3 class="text-sm font-normal" style="color:${PRIMARY}">${esc(it.name)}</h3>
        ${it.startDate ? `<span class="shrink-0 text-[10px] font-light" style="color:${ACCENT}">${esc(it.startDate)}${it.endDate ? ` \u2013 ${esc(it.endDate)}` : ''}</span>` : ''}
      </div>
      ${it.description ? `<p class="mt-1 text-sm font-light leading-relaxed" style="color:#57534e">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<p class="mt-1 text-xs font-light" style="color:${ACCENT}">${esc(it.technologies.join(' \u00b7 '))}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-2 space-y-1">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-3 text-sm font-light" style="color:#57534e"><span class="mt-2 inline-block h-px w-3 shrink-0" style="background-color:${ACCENT}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'certifications') {
    return `<div class="space-y-2">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div class="flex items-baseline justify-between"><div><span class="text-sm font-normal" style="color:${PRIMARY}">${esc(it.name)}</span><span class="text-xs font-light" style="color:${ACCENT}"> &mdash; ${esc(it.issuer)}</span></div>${it.date ? `<span class="shrink-0 text-[10px] font-light" style="color:${ACCENT}">${esc(it.date)}</span>` : ''}</div>`
    ).join('')}</div>`;
  }

  if (section.type === 'languages') {
    return `<div class="flex flex-wrap gap-x-8 gap-y-2">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div class="text-sm"><span class="font-normal" style="color:${PRIMARY}">${esc(it.language)}</span><span class="font-light" style="color:${ACCENT}"> &mdash; ${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'custom') {
    return `<div class="space-y-4">${((c as CustomContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div>
        <h3 class="text-sm font-normal" style="color:${PRIMARY}">${esc(it.title)}</h3>
        ${it.subtitle ? `<span class="text-xs font-light" style="color:${ACCENT}">${esc(it.subtitle)}</span>` : ''}
      </div>${it.date ? `<span class="shrink-0 text-[10px] font-light" style="color:${ACCENT}">${esc(it.date)}</span>` : ''}</div>
      ${it.description ? `<p class="mt-1 text-sm font-light leading-relaxed" style="color:#57534e">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }

  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div><span class="text-sm font-normal" style="color:${PRIMARY}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm font-light" style="color:#57534e">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }

  return '';
}

export function buildJapaneseHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);

  return `<div class="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style="font-family:Inter,sans-serif">
    <div class="mb-12 pt-4 text-center">
      ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="mx-auto mb-4 h-16 w-16 rounded-full object-cover" style="border:1px solid ${ACCENT}"/>` : ''}
      <h1 class="text-2xl font-light tracking-wide" style="color:${PRIMARY}">${esc(pi.fullName || 'Your Name')}</h1>
      ${pi.jobTitle ? `<p class="mt-2 text-xs font-light tracking-[0.25em] uppercase" style="color:${ACCENT}">${esc(pi.jobTitle)}</p>` : ''}
      ${contacts.length ? `<div class="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-light" style="color:${ACCENT}">${contacts.map(c => `<span>${esc(c)}</span>`).join('')}</div>` : ''}
    </div>
    <div class="mx-auto mb-10 h-px" style="background-color:${ACCENT};opacity:0.4"></div>
    ${sections.map(s => `<div class="mb-8" data-section>
      <div class="mb-4 flex items-center gap-2">
        <span class="inline-block h-1 w-1 rounded-full" style="background-color:${ACCENT}"></span>
        <h2 class="text-[10px] font-light uppercase tracking-[0.25em]" style="color:${ACCENT}">${esc(s.title)}</h2>
      </div>
      ${buildJapaneseSectionContent(s)}
    </div>`).join('')}
  </div>`;
}
