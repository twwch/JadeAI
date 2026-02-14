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

const PRIMARY = '#881337';
const ACCENT = '#be185d';
const ROSE_50 = '#fff1f2';
const ROSE_100 = '#ffe4e6';

function buildRoseSectionContent(section: Section): string {
  const c = section.content as any;

  if (section.type === 'summary') return `<p class="rounded-xl px-4 py-3 text-sm italic leading-relaxed" style="background-color:${ROSE_50};color:#57534e">${esc((c as SummaryContent).text)}</p>`;

  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div class="rounded-xl border p-4" style="border-color:${ROSE_100}">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-semibold" style="color:${PRIMARY}">${esc(it.position)}</h3><span class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium" style="background-color:${ROSE_50};color:${ACCENT}">${esc(it.startDate)} &ndash; ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.company ? `<p class="text-sm" style="color:${ACCENT}">${esc(it.company)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1.5 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm text-zinc-600"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style="background-color:${ACCENT}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div class="rounded-xl border p-4" style="border-color:${ROSE_100}">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-semibold" style="color:${PRIMARY}">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</h3><span class="shrink-0 text-xs" style="color:${ACCENT}">${esc(it.startDate)} &ndash; ${esc(it.endDate)}</span></div>
      ${it.institution ? `<p class="text-sm" style="color:${ACCENT}">${esc(it.institution)}</p>` : ''}
      ${it.gpa ? `<p class="text-xs" style="color:#a8a29e">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm text-zinc-600"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style="background-color:${ACCENT}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'skills') {
    return `<div class="space-y-3">${((c as SkillsContent).categories || []).map((cat: any) => `<div>
      <p class="mb-1.5 text-xs font-semibold uppercase tracking-wider" style="color:${PRIMARY}">${esc(cat.name)}</p>
      <div class="flex flex-wrap gap-1.5">${(cat.skills || []).map((skill: string) =>
        `<span class="rounded-full px-2.5 py-0.5 text-xs font-medium" style="background-color:${ROSE_50};color:${ACCENT}">${esc(skill)}</span>`
      ).join('')}</div>
    </div>`).join('')}</div>`;
  }

  if (section.type === 'projects') {
    return `<div class="space-y-3">${((c as ProjectsContent).items || []).map((it: any) => `<div class="rounded-xl border p-4" style="border-color:${ROSE_100}">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-semibold" style="color:${PRIMARY}">${esc(it.name)}</h3>${it.startDate ? `<span class="shrink-0 text-xs" style="color:${ACCENT}">${esc(it.startDate)}${it.endDate ? ` \u2013 ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-0.5 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<div class="mt-1.5 flex flex-wrap gap-1">${it.technologies.map((t: string) => `<span class="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style="background-color:${ACCENT}">${esc(t)}</span>`).join('')}</div>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1.5 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm text-zinc-600"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style="background-color:${ACCENT}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'certifications') {
    return `<div class="flex flex-wrap gap-2">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div class="rounded-xl border px-4 py-2" style="border-color:${ROSE_100}"><p class="text-sm font-semibold" style="color:${PRIMARY}">${esc(it.name)}</p><p class="text-xs" style="color:${ACCENT}">${esc(it.issuer)}${it.date ? ` | ${esc(it.date)}` : ''}</p></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'languages') {
    return `<div class="flex flex-wrap gap-2">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div class="flex items-center gap-2 rounded-full px-4 py-1.5" style="background-color:${ROSE_50}"><span class="h-1.5 w-1.5 rounded-full" style="background-color:${ACCENT}"></span><span class="text-sm font-medium" style="color:${PRIMARY}">${esc(it.language)}</span><span class="text-xs" style="color:${ACCENT}">${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'custom') {
    return `<div class="space-y-3">${((c as CustomContent).items || []).map((it: any) => `<div class="rounded-xl border p-4" style="border-color:${ROSE_100}">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-semibold" style="color:${PRIMARY}">${esc(it.title)}</h3>${it.date ? `<span class="shrink-0 text-xs" style="color:${ACCENT}">${esc(it.date)}</span>` : ''}</div>
      ${it.subtitle ? `<p class="text-sm" style="color:${ACCENT}">${esc(it.subtitle)}</p>` : ''}
      ${it.description ? `<p class="mt-0.5 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }

  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div class="rounded-xl border p-3" style="border-color:${ROSE_100}"><span class="text-sm font-medium" style="color:${PRIMARY}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm text-zinc-600">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }

  return '';
}

export function buildRoseHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);

  return `<div class="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style="font-family:Inter,sans-serif">
    <div class="mb-8 rounded-2xl px-8 py-6 text-center" style="background-color:${ROSE_50}">
      ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="mx-auto mb-3 h-20 w-20 rounded-full border-3 object-cover" style="border-color:${ACCENT}"/>` : ''}
      <h1 class="text-2xl font-semibold tracking-wide" style="color:${PRIMARY}">${esc(pi.fullName || 'Your Name')}</h1>
      ${pi.jobTitle ? `<p class="mt-1 text-sm" style="color:${ACCENT}">${esc(pi.jobTitle)}</p>` : ''}
      <div class="mt-3 flex items-center justify-center gap-1">
        <span class="h-1 w-1 rounded-full" style="background-color:${ACCENT};opacity:0.4"></span>
        <span class="h-1.5 w-1.5 rounded-full" style="background-color:${ACCENT};opacity:0.6"></span>
        <span class="h-1 w-1 rounded-full" style="background-color:${ACCENT}"></span>
        <span class="h-1.5 w-1.5 rounded-full" style="background-color:${ACCENT};opacity:0.6"></span>
        <span class="h-1 w-1 rounded-full" style="background-color:${ACCENT};opacity:0.4"></span>
      </div>
      ${contacts.length ? `<div class="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs" style="color:${ACCENT}">${contacts.map(c => `<span>${esc(c)}</span>`).join('')}</div>` : ''}
    </div>
    ${sections.map(s => `<div class="mb-6" data-section>
      <div class="mb-3 flex items-center gap-2">
        <div class="h-0.5 w-6 rounded-full" style="background-color:${ACCENT}"></div>
        <h2 class="text-xs font-semibold uppercase tracking-[0.15em]" style="color:${PRIMARY}">${esc(s.title)}</h2>
      </div>
      ${buildRoseSectionContent(s)}
    </div>`).join('')}
  </div>`;
}
