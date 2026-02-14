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

const PRIMARY = '#4c1d95';
const ACCENT = '#c084fc';
const WASH = '#f5f3ff';
const TEXT = '#6b7280';
const TEXT_DARK = '#374151';
const GRADIENT = `linear-gradient(135deg, ${ACCENT}, ${PRIMARY})`;

function buildWatercolorSectionContent(section: Section): string {
  const c = section.content as any;

  if (section.type === 'summary') {
    return `<div class="rounded-xl p-4" style="background-color:${WASH}"><p class="text-sm leading-relaxed" style="color:${TEXT_DARK}">${esc((c as SummaryContent).text)}</p></div>`;
  }

  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div class="rounded-xl p-4" style="background-color:${WASH}">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.position)}</h3><span class="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white" style="background:${GRADIENT}">${esc(it.startDate)} - ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.company ? `<p class="text-sm font-medium" style="color:${ACCENT}">${esc(it.company)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm" style="color:${TEXT}">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1.5 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm" style="color:${TEXT}"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style="background-color:${ACCENT}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div class="rounded-xl p-4" style="background-color:${WASH}">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.institution)}</h3><span class="text-xs" style="color:${TEXT}">${esc(it.startDate)} - ${esc(it.endDate)}</span></div>
      <p class="text-sm" style="color:${TEXT_DARK}">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</p>
      ${it.gpa ? `<p class="text-xs" style="color:${ACCENT}">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm" style="color:${TEXT}"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style="background-color:${ACCENT}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'skills') {
    return `<div class="space-y-3">${((c as SkillsContent).categories || []).map((cat: any) => `<div>
      <p class="mb-1.5 text-xs font-bold uppercase tracking-wider" style="color:${ACCENT}">${esc(cat.name)}</p>
      <div class="flex flex-wrap gap-1.5">${(cat.skills || []).map((skill: string) =>
        `<span class="rounded-full px-2.5 py-0.5 text-xs font-medium" style="background-color:${WASH};color:${PRIMARY};border:1px solid ${ACCENT}40">${esc(skill)}</span>`
      ).join('')}</div>
    </div>`).join('')}</div>`;
  }

  if (section.type === 'projects') {
    return `<div class="space-y-3">${((c as ProjectsContent).items || []).map((it: any) => `<div class="rounded-xl p-4" style="background-color:${WASH}">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.name)}</h3>${it.startDate ? `<span class="text-xs" style="color:${TEXT}">${esc(it.startDate)}${it.endDate ? ` - ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-0.5 text-sm" style="color:${TEXT}">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<div class="mt-2 flex flex-wrap gap-1">${it.technologies.map((t: string) => `<span class="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style="background:${GRADIENT}">${esc(t)}</span>`).join('')}</div>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1.5 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm" style="color:${TEXT}"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style="background-color:${ACCENT}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'certifications') {
    return `<div class="flex flex-wrap gap-2">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div class="rounded-xl px-4 py-2" style="background-color:${WASH};border:1px solid ${ACCENT}30"><p class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.name)}</p><p class="text-xs" style="color:${TEXT}">${esc(it.issuer)}${it.date ? ` | ${esc(it.date)}` : ''}</p></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'languages') {
    return `<div class="flex flex-wrap gap-3">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div class="flex items-center gap-2 rounded-full px-4 py-1.5" style="background-color:${WASH};border:1px solid ${ACCENT}30"><span class="h-2 w-2 rounded-full" style="background:${GRADIENT}"></span><span class="text-sm font-medium" style="color:${PRIMARY}">${esc(it.language)}</span><span class="text-xs" style="color:${TEXT}">${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'custom') {
    return `<div class="space-y-3">${((c as CustomContent).items || []).map((it: any) => `<div class="rounded-xl p-4" style="background-color:${WASH}">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.title)}</h3>${it.date ? `<span class="text-xs" style="color:${TEXT}">${esc(it.date)}</span>` : ''}</div>
      ${it.subtitle ? `<p class="text-sm" style="color:${ACCENT}">${esc(it.subtitle)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm" style="color:${TEXT}">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }

  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div class="rounded-xl p-3" style="background-color:${WASH}"><span class="text-sm font-medium" style="color:${PRIMARY}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm" style="color:${TEXT}">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }

  return '';
}

export function buildWatercolorHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);

  return `<div class="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style="font-family:Inter,sans-serif">
    <div class="mb-6 rounded-2xl px-6 py-5" style="background-color:${WASH}">
      <div class="flex items-center gap-5">
        ${pi.avatar ? `<div class="shrink-0 rounded-full p-1" style="background:${GRADIENT}"><img src="${esc(pi.avatar)}" alt="" class="h-20 w-20 rounded-full border-2 border-white object-cover"/></div>` : ''}
        <div>
          <h1 class="text-3xl font-bold" style="color:${PRIMARY}">${esc(pi.fullName || 'Your Name')}</h1>
          ${pi.jobTitle ? `<p class="mt-1 text-sm font-medium" style="color:${ACCENT}">${esc(pi.jobTitle)}</p>` : ''}
          ${contacts.length ? `<div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" style="color:${TEXT}">${contacts.map((c, i) => `<span class="flex items-center gap-1.5">${esc(c)}${i < contacts.length - 1 ? `<span style="color:${ACCENT}">/</span>` : ''}</span>`).join('')}</div>` : ''}
        </div>
      </div>
    </div>
    ${sections.map(s => `<div class="mb-5" data-section>
      <div class="mb-2 flex items-center gap-2"><div class="h-6 w-1.5 rounded-full" style="background:linear-gradient(to bottom,${ACCENT},${PRIMARY})"></div><h2 class="text-sm font-bold uppercase tracking-wider" style="color:${PRIMARY}">${esc(s.title)}</h2></div>
      ${buildWatercolorSectionContent(s)}
    </div>`).join('')}
  </div>`;
}
