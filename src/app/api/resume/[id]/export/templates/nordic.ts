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

const SLATE_500 = '#64748b';
const SLATE_400 = '#94a3b8';
const SLATE_50 = '#f8fafc';

function buildNordicSectionContent(section: Section): string {
  const c = section.content as any;

  if (section.type === 'summary') {
    return `<p class="text-sm font-light leading-relaxed" style="color:${SLATE_500}">${esc((c as SummaryContent).text)}</p>`;
  }

  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div class="rounded-sm p-3" style="background-color:${SLATE_50}">
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-medium" style="color:${SLATE_500}">${esc(it.position)}</span>${it.company ? `<span class="text-sm font-light" style="color:${SLATE_400}"> | ${esc(it.company)}</span>` : ''}</div><span class="shrink-0 text-xs font-light" style="color:${SLATE_400}">${esc(it.startDate)} - ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.description ? `<p class="mt-1 text-sm font-light" style="color:${SLATE_500}">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1.5 list-disc pl-4">${it.highlights.map((h: string) => `<li class="text-sm font-light" style="color:${SLATE_500}">${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div class="rounded-sm p-3" style="background-color:${SLATE_50}">
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-medium" style="color:${SLATE_500}">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</span>${it.institution ? `<span class="text-sm font-light" style="color:${SLATE_400}"> - ${esc(it.institution)}</span>` : ''}</div><span class="shrink-0 text-xs font-light" style="color:${SLATE_400}">${esc(it.startDate)} - ${esc(it.endDate)}</span></div>
      ${it.gpa ? `<p class="text-xs font-light" style="color:${SLATE_400}">GPA: ${esc(it.gpa)}</p>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'skills') {
    return `<div class="space-y-1.5">${((c as SkillsContent).categories || []).map((cat: any) =>
      `<div class="flex text-sm"><span class="w-28 shrink-0 font-medium" style="color:${SLATE_500}">${esc(cat.name)}:</span><span class="font-light" style="color:${SLATE_400}">${esc((cat.skills || []).join(', '))}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'projects') {
    return `<div class="space-y-3">${((c as ProjectsContent).items || []).map((it: any) => `<div class="rounded-sm p-3" style="background-color:${SLATE_50}">
      <div class="flex items-baseline justify-between"><span class="text-sm font-medium" style="color:${SLATE_500}">${esc(it.name)}</span>${it.startDate ? `<span class="shrink-0 text-xs font-light" style="color:${SLATE_400}">${esc(it.startDate)}${it.endDate ? ` - ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-1 text-sm font-light" style="color:${SLATE_500}">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<p class="mt-0.5 text-xs font-light" style="color:${SLATE_400}">Tech: ${esc(it.technologies.join(', '))}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1.5 list-disc pl-4">${it.highlights.map((h: string) => `<li class="text-sm font-light" style="color:${SLATE_500}">${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'certifications') {
    return `<div class="space-y-1.5">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div><span class="text-sm font-medium" style="color:${SLATE_500}">${esc(it.name)}</span><span class="text-sm font-light" style="color:${SLATE_400}"> — ${esc(it.issuer)} (${esc(it.date)})</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'languages') {
    return `<div class="space-y-1.5">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div><span class="text-sm font-medium" style="color:${SLATE_500}">${esc(it.language)}</span><span class="text-sm font-light" style="color:${SLATE_400}"> — ${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'custom') {
    return `<div class="space-y-3">${((c as CustomContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-medium" style="color:${SLATE_500}">${esc(it.title)}</span>${it.subtitle ? `<span class="text-sm font-light" style="color:${SLATE_400}"> — ${esc(it.subtitle)}</span>` : ''}</div>${it.date ? `<span class="shrink-0 text-xs font-light" style="color:${SLATE_400}">${esc(it.date)}</span>` : ''}</div>
      ${it.description ? `<p class="mt-0.5 text-sm font-light" style="color:${SLATE_500}">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }

  // Generic items fallback
  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div><span class="text-sm font-medium" style="color:${SLATE_500}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm font-light" style="color:${SLATE_400}">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }

  return '';
}

export function buildNordicHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);

  return `<div class="mx-auto max-w-[210mm] bg-white p-10 shadow-lg" style="font-family:Inter,sans-serif">
    <div class="mb-8 text-center">
      ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="mx-auto mb-3 h-16 w-16 rounded-full object-cover" style="border:2px solid ${SLATE_400}"/>` : ''}
      <h1 class="text-2xl font-light tracking-wide" style="color:${SLATE_500}">${esc(pi.fullName || 'Your Name')}</h1>
      ${pi.jobTitle ? `<p class="mt-1 text-sm font-light tracking-wider" style="color:${SLATE_400}">${esc(pi.jobTitle)}</p>` : ''}
      ${contacts.length ? `<div class="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs" style="color:${SLATE_400}">${contacts.map(ct => `<span>${esc(ct)}</span>`).join('')}</div>` : ''}
    </div>
    <div class="mx-auto mb-8 h-px w-full" style="background-color:${SLATE_400}"></div>
    ${sections.map(s => `<div class="mb-7" data-section>
      <h2 class="mb-3 text-xs font-medium uppercase tracking-[0.2em]" style="color:${SLATE_500}">${esc(s.title)}</h2>
      ${buildNordicSectionContent(s)}
    </div>`).join('')}
  </div>`;
}
