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

const PRIMARY = '#1e1b4b';
const ACCENT = '#f43f5e';
const HIGHLIGHT = '#fbbf24';

function buildArtisticSectionContent(section: Section): string {
  const c = section.content as any;

  if (section.type === 'summary') {
    return `<div class="rounded-lg p-4" style="border:2px dashed ${ACCENT}30;background-color:${PRIMARY}05"><p class="text-sm leading-relaxed text-zinc-600 italic">${esc((c as SummaryContent).text)}</p></div>`;
  }

  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div class="relative rounded-lg p-4" style="border:1px dashed ${ACCENT}30">
      <div class="absolute -left-1.5 top-4 h-3 w-3 rounded-full" style="background-color:${ACCENT}"></div>
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.position)}</h3><span class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white" style="background-color:${ACCENT}">${esc(it.startDate)} - ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.company ? `<p class="text-sm font-medium" style="color:${ACCENT}">${esc(it.company)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1.5 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm text-zinc-600"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style="background-color:${HIGHLIGHT}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div class="rounded-lg p-4" style="border:1px dashed ${ACCENT}30">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.institution)}</h3><span class="text-xs text-zinc-400">${esc(it.startDate)} - ${esc(it.endDate)}</span></div>
      <p class="text-sm text-zinc-600">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</p>
      ${it.gpa ? `<p class="text-xs text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm text-zinc-600"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style="background-color:${HIGHLIGHT}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'skills') {
    return `<div class="space-y-3">${((c as SkillsContent).categories || []).map((cat: any) => `<div>
      <p class="mb-1.5 text-xs font-bold uppercase tracking-wider" style="color:${ACCENT}">${esc(cat.name)}</p>
      <div class="flex flex-wrap gap-2">${(cat.skills || []).map((skill: string, i: number) =>
        `<span class="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium" style="background-color:${PRIMARY}10;color:${PRIMARY}"><span class="h-2 w-2 rounded-full" style="background-color:${i % 2 === 0 ? ACCENT : HIGHLIGHT}"></span>${esc(skill)}</span>`
      ).join('')}</div>
    </div>`).join('')}</div>`;
  }

  if (section.type === 'projects') {
    return `<div class="space-y-3">${((c as ProjectsContent).items || []).map((it: any) => `<div class="rounded-lg p-4" style="border:1px dashed ${ACCENT}30">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.name)}</h3>${it.startDate ? `<span class="text-xs text-zinc-400">${esc(it.startDate)}${it.endDate ? ` - ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-0.5 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<div class="mt-2 flex flex-wrap gap-1">${it.technologies.map((t: string, i: number) => `<span class="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style="background-color:${i % 2 === 0 ? ACCENT : PRIMARY}">${esc(t)}</span>`).join('')}</div>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1.5 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm text-zinc-600"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style="background-color:${HIGHLIGHT}"></span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'certifications') {
    return `<div class="flex flex-wrap gap-2">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div class="rounded-lg px-4 py-2" style="border:1px dashed ${ACCENT}30;background-color:${HIGHLIGHT}10"><p class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.name)}</p><p class="text-xs text-zinc-500">${esc(it.issuer)}${it.date ? ` | ${esc(it.date)}` : ''}</p></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'languages') {
    return `<div class="flex flex-wrap gap-3">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div class="flex items-center gap-2 rounded-full px-4 py-1.5" style="border:2px dashed ${ACCENT}30"><span class="h-2.5 w-2.5 rounded-full" style="background-color:${ACCENT}"></span><span class="text-sm font-medium" style="color:${PRIMARY}">${esc(it.language)}</span><span class="text-xs text-zinc-400">${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'custom') {
    return `<div class="space-y-3">${((c as CustomContent).items || []).map((it: any) => `<div class="rounded-lg p-4" style="border:1px dashed ${ACCENT}30">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.title)}</h3>${it.date ? `<span class="text-xs text-zinc-400">${esc(it.date)}</span>` : ''}</div>
      ${it.subtitle ? `<p class="text-sm" style="color:${ACCENT}">${esc(it.subtitle)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }

  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div class="rounded-lg p-3" style="border:1px dashed ${ACCENT}30"><span class="text-sm font-medium" style="color:${PRIMARY}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm text-zinc-600">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }

  return '';
}

export function buildArtisticHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);

  return `<div class="mx-auto max-w-[210mm] overflow-hidden bg-white shadow-lg" style="font-family:Inter,sans-serif">
    <div class="relative px-10 py-8 text-white" style="background:${PRIMARY}">
      <div class="absolute right-6 top-4 h-24 w-24 rounded-full opacity-20" style="background-color:${ACCENT}"></div>
      <div class="absolute right-16 bottom-2 h-12 w-12 rounded-full opacity-30" style="background-color:${HIGHLIGHT}"></div>
      <div class="absolute left-0 bottom-0 h-2 w-full" style="background:linear-gradient(90deg,${ACCENT},${HIGHLIGHT})"></div>
      <div class="relative flex items-center gap-5">
        ${pi.avatar ? `<div class="shrink-0 rounded-full p-1" style="border:3px dashed ${HIGHLIGHT}"><img src="${esc(pi.avatar)}" alt="" class="h-20 w-20 rounded-full object-cover"/></div>` : ''}
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight">${esc(pi.fullName || 'Your Name')}</h1>
          ${pi.jobTitle ? `<p class="mt-1 text-sm font-medium" style="color:${HIGHLIGHT}">${esc(pi.jobTitle)}</p>` : ''}
          ${contacts.length ? `<div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/70">${contacts.map(c => `<span>${esc(c)}</span>`).join('')}</div>` : ''}
        </div>
      </div>
    </div>
    <div class="p-8 pt-6">
      ${sections.map(s => `<div class="mb-6" data-section>
        <div class="mb-2 flex items-center gap-2"><h2 class="text-sm font-extrabold uppercase tracking-widest" style="color:${PRIMARY}">${esc(s.title)}</h2><div class="h-0.5 flex-1" style="border-top:2px dashed ${ACCENT}40"></div></div>
        ${buildArtisticSectionContent(s)}
      </div>`).join('')}
    </div>
  </div>`;
}
