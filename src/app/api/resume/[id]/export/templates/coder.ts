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

const DARK = '#0d1117';
const BLUE = '#58a6ff';
const GREEN = '#3fb950';
const BORDER = '#21262d';

const SIDEBAR_TYPES = new Set(['skills', 'languages', 'certifications']);

function buildCoderHighlights(highlights: string[] | undefined): string {
  if (!highlights?.length) return '';
  return highlights.filter(Boolean).map(h =>
    `<li class="flex items-start gap-2 text-sm text-zinc-600"><span class="mt-1 shrink-0 text-xs" style="color:${GREEN}">$</span>${esc(h)}</li>`
  ).join('');
}

function buildCoderSidebarContent(section: Section): string {
  const c = section.content as any;

  if (section.type === 'skills') {
    return `<div class="space-y-2">${((c as SkillsContent).categories || []).map((cat: any) => `<div>
      <p class="text-[10px] font-semibold" style="color:#c9d1d9">${esc(cat.name)}</p>
      <div class="mt-1 flex flex-wrap gap-1">${(cat.skills || []).map((skill: string) =>
        `<span class="rounded-sm px-1.5 py-0.5 text-[9px] font-medium" style="background-color:#161b22;color:${BLUE};border:1px solid ${BORDER}">${esc(skill)}</span>`
      ).join('')}</div>
    </div>`).join('')}</div>`;
  }

  if (section.type === 'languages') {
    return `<div class="space-y-1">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div class="flex items-center justify-between text-[10px]"><span style="color:#c9d1d9">${esc(it.language)}</span><span style="color:#484f58">${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'certifications') {
    return `<div class="space-y-1.5">${((c as CertificationsContent).items || []).map((it: any) => `<div>
      <p class="text-[10px] font-semibold" style="color:#c9d1d9">${esc(it.name)}</p>
      <p class="text-[9px]" style="color:#484f58">${esc(it.issuer)}${it.date ? ` (${esc(it.date)})` : ''}</p>
    </div>`).join('')}</div>`;
  }

  if (c.items) {
    return `<div class="space-y-1.5">${c.items.map((it: any) => `<div><span class="text-[10px] font-medium" style="color:#c9d1d9">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-[9px]" style="color:#484f58">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }

  return '';
}

function buildCoderMainContent(section: Section): string {
  const c = section.content as any;

  if (section.type === 'summary') return `<p class="text-sm leading-relaxed text-zinc-600">${esc((c as SummaryContent).text)}</p>`;

  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${DARK}">${esc(it.position)}</span>${it.company ? `<span class="text-sm" style="color:${BLUE}"> @ ${esc(it.company)}</span>` : ''}</div><span class="shrink-0 rounded px-2 py-0.5 text-[10px] font-medium" style="background-color:#f6f8fa;color:#57606a">${esc(it.startDate)} - ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 space-y-0.5">${buildCoderHighlights(it.highlights)}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${DARK}">${esc(it.institution)}</h3><span class="text-xs text-zinc-400">${esc(it.startDate)} - ${esc(it.endDate)}</span></div>
      <p class="text-sm text-zinc-600">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</p>
      ${it.gpa ? `<p class="text-xs text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 space-y-0.5">${buildCoderHighlights(it.highlights)}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'projects') {
    return `<div class="space-y-3">${((c as ProjectsContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${BLUE}">${esc(it.name)}</h3>${it.startDate ? `<span class="text-xs text-zinc-400">${esc(it.startDate)}${it.endDate ? ` - ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<div class="mt-1 flex flex-wrap gap-1">${it.technologies.map((t: string) => `<span class="rounded-sm px-1.5 py-0.5 text-[10px] font-medium" style="background-color:#f6f8fa;color:#57606a;border:1px solid #d0d7de">${esc(t)}</span>`).join('')}</div>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 space-y-0.5">${buildCoderHighlights(it.highlights)}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'custom') {
    return `<div class="space-y-3">${((c as CustomContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${DARK}">${esc(it.title)}</h3>${it.date ? `<span class="text-xs text-zinc-400">${esc(it.date)}</span>` : ''}</div>
      ${it.subtitle ? `<p class="text-sm text-zinc-500">${esc(it.subtitle)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }

  if (section.type === 'skills') {
    return `<div class="space-y-2">${((c as SkillsContent).categories || []).map((cat: any) => `<div>
      <span class="text-xs font-bold" style="color:${BLUE}">${esc(cat.name)}: </span>
      <span class="text-sm text-zinc-600">${esc((cat.skills || []).join(' | '))}</span>
    </div>`).join('')}</div>`;
  }

  if (section.type === 'certifications') {
    return `<div class="space-y-1.5">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div><span class="text-sm font-bold" style="color:${DARK}">${esc(it.name)}</span><span class="text-xs text-zinc-500"> - ${esc(it.issuer)}${it.date ? ` (${esc(it.date)})` : ''}</span></div>`
    ).join('')}</div>`;
  }

  if (section.type === 'languages') {
    return `<div class="flex flex-wrap gap-x-6 gap-y-1">${((c as LanguagesContent).items || []).map((it: any) =>
      `<span class="text-sm"><span class="font-medium" style="color:${DARK}">${esc(it.language)}</span><span class="text-zinc-500"> - ${esc(it.proficiency)}</span></span>`
    ).join('')}</div>`;
  }

  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div><span class="text-sm font-medium" style="color:${DARK}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm text-zinc-600">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }

  return '';
}

export function buildCoderHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const sidebarSections = sections.filter(s => SIDEBAR_TYPES.has(s.type));
  const mainSections = sections.filter(s => !SIDEBAR_TYPES.has(s.type));

  return `<div class="mx-auto flex max-w-[210mm] overflow-hidden bg-white shadow-lg" style="font-family:'JetBrains Mono','Fira Code',monospace;min-height:297mm">
    <div class="w-[32%] shrink-0 p-5" style="background-color:${DARK}">
      <div class="mb-4 flex items-center gap-1.5">
        <div class="h-2.5 w-2.5 rounded-full bg-[#ff5f56]"></div>
        <div class="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]"></div>
        <div class="h-2.5 w-2.5 rounded-full bg-[#27c93f]"></div>
        <span class="ml-2 text-[10px]" style="color:#484f58">~/whoami</span>
      </div>
      <div class="mb-5">
        ${pi.avatar ? `<div class="mb-3 h-20 w-20 overflow-hidden rounded-lg" style="border:2px solid ${BORDER}"><img src="${esc(pi.avatar)}" alt="" class="h-full w-full object-cover"/></div>` : ''}
        <h1 class="text-lg font-bold" style="color:${GREEN}">${esc(pi.fullName || 'Your Name')}</h1>
        ${pi.jobTitle ? `<p class="mt-0.5 text-xs" style="color:${BLUE}">// ${esc(pi.jobTitle)}</p>` : ''}
      </div>
      <div class="mb-5 space-y-1.5 text-[11px]" style="border-top:1px solid ${BORDER};padding-top:12px">
        ${pi.email ? `<div class="flex items-start gap-2"><span style="color:${GREEN}">$</span><span class="break-all" style="color:#8b949e">${esc(pi.email)}</span></div>` : ''}
        ${pi.phone ? `<div class="flex items-start gap-2"><span style="color:${GREEN}">$</span><span style="color:#8b949e">${esc(pi.phone)}</span></div>` : ''}
        ${pi.location ? `<div class="flex items-start gap-2"><span style="color:${GREEN}">$</span><span style="color:#8b949e">${esc(pi.location)}</span></div>` : ''}
        ${pi.website ? `<div class="flex items-start gap-2"><span style="color:${GREEN}">$</span><span class="break-all" style="color:#8b949e">${esc(pi.website)}</span></div>` : ''}
        ${pi.github ? `<div class="flex items-start gap-2"><span style="color:${GREEN}">$</span><span class="break-all" style="color:#8b949e">${esc(pi.github)}</span></div>` : ''}
        ${pi.linkedin ? `<div class="flex items-start gap-2"><span style="color:${GREEN}">$</span><span class="break-all" style="color:#8b949e">${esc(pi.linkedin)}</span></div>` : ''}
      </div>
      ${sidebarSections.map(s => `<div class="mb-5" data-section style="border-top:1px solid ${BORDER};padding-top:12px">
        <h2 class="mb-2 text-[10px] font-bold uppercase tracking-wider" style="color:${BLUE}">&gt; ${esc(s.title)}</h2>
        ${buildCoderSidebarContent(s)}
      </div>`).join('')}
    </div>
    <div class="flex-1 p-6">
      ${mainSections.map(s => `<div class="mb-5" data-section>
        <h2 class="mb-2 text-xs font-bold" style="color:${DARK}"><span style="color:${GREEN}">&gt; </span><span class="uppercase tracking-wider">${esc(s.title)}</span></h2>
        <div class="border-l-2 pl-4" style="border-color:${BORDER}">
          ${buildCoderMainContent(s)}
        </div>
      </div>`).join('')}
    </div>
  </div>`;
}
