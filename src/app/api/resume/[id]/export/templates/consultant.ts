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

const GRAY_700 = '#374151';
const BLUE_600 = '#2563eb';

function buildConsultantSectionContent(section: Section): string {
  const c = section.content as any;

  if (section.type === 'summary') {
    return `<p class="text-sm leading-relaxed text-gray-600">${esc((c as SummaryContent).text)}</p>`;
  }

  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${GRAY_700}">${esc(it.position)}</span>${it.company ? `<span class="text-sm text-gray-500"> | ${esc(it.company)}</span>` : ''}</div><span class="shrink-0 text-xs font-medium" style="color:${BLUE_600}">${esc(it.startDate)} - ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.description ? `<p class="mt-1 text-sm text-gray-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1.5 space-y-0.5">${it.highlights.map((h: string) => `<li class="flex items-start gap-2 text-sm text-gray-600"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style="background-color:${BLUE_600}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${GRAY_700}">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</span>${it.institution ? `<span class="text-sm text-gray-500"> - ${esc(it.institution)}</span>` : ''}</div><span class="shrink-0 text-xs font-medium" style="color:${BLUE_600}">${esc(it.startDate)} - ${esc(it.endDate)}</span></div>
      ${it.gpa ? `<p class="text-sm text-gray-500">GPA: ${esc(it.gpa)}</p>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'skills') {
    return `<div class="space-y-1.5">${((c as SkillsContent).categories || []).map((cat: any) =>
      `<div class="flex text-sm"><span class="w-32 shrink-0 font-semibold" style="color:${GRAY_700}">${esc(cat.name)}:</span><span class="text-gray-600">${esc((cat.skills || []).join(', '))}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'projects') {
    return `<div class="space-y-3">${((c as ProjectsContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><span class="text-sm font-bold" style="color:${GRAY_700}">${esc(it.name)}</span>${it.startDate ? `<span class="shrink-0 text-xs font-medium" style="color:${BLUE_600}">${esc(it.startDate)}${it.endDate ? ` - ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-1 text-sm text-gray-600">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<p class="mt-0.5 text-xs text-gray-400">Tech: ${esc(it.technologies.join(', '))}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1.5 space-y-0.5">${it.highlights.map((h: string) => `<li class="flex items-start gap-2 text-sm text-gray-600"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style="background-color:${BLUE_600}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'certifications') {
    return `<div class="space-y-1.5">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div><span class="text-sm font-bold" style="color:${GRAY_700}">${esc(it.name)}</span><span class="text-sm text-gray-500"> — ${esc(it.issuer)} (${esc(it.date)})</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'languages') {
    return `<div class="space-y-1.5">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div><span class="text-sm font-bold" style="color:${GRAY_700}">${esc(it.language)}</span><span class="text-sm text-gray-500"> — ${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'custom') {
    return `<div class="space-y-3">${((c as CustomContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${GRAY_700}">${esc(it.title)}</span>${it.subtitle ? `<span class="text-sm text-gray-500"> — ${esc(it.subtitle)}</span>` : ''}</div>${it.date ? `<span class="shrink-0 text-xs font-medium" style="color:${BLUE_600}">${esc(it.date)}</span>` : ''}</div>
      ${it.description ? `<p class="mt-0.5 text-sm text-gray-600">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }

  // Generic items fallback
  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div><span class="text-sm font-medium" style="color:${GRAY_700}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm text-gray-600">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }

  return '';
}

export function buildConsultantHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);

  return `<div class="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style="font-family:Inter,sans-serif">
    <div class="mb-6 h-1 w-full rounded" style="background-color:${BLUE_600}"></div>
    <div class="mb-6">
      <div class="flex items-center gap-4">
        ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="h-16 w-16 shrink-0 rounded-full object-cover" style="border:2px solid ${BLUE_600}"/>` : ''}
        <div>
          <h1 class="text-2xl font-bold" style="color:${GRAY_700}">${esc(pi.fullName || 'Your Name')}</h1>
          ${pi.jobTitle ? `<p class="mt-0.5 text-sm font-medium" style="color:${BLUE_600}">${esc(pi.jobTitle)}</p>` : ''}
        </div>
      </div>
      ${contacts.length ? `<div class="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">${contacts.map(ct => `<span>${esc(ct)}</span>`).join('')}</div>` : ''}
    </div>
    ${sections.map(s => `<div class="mb-6" data-section>
      <h2 class="mb-3 border-l-[3px] pl-3 text-sm font-bold uppercase tracking-wider" style="color:${GRAY_700};border-color:${BLUE_600}">${esc(s.title)}</h2>
      ${buildConsultantSectionContent(s)}
    </div>`).join('')}
  </div>`;
}
