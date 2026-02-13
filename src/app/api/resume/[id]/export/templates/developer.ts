import type {
  SummaryContent,
  WorkExperienceContent,
  EducationContent,
  SkillsContent,
} from '@/types/resume';
import { esc, getPersonalInfo, visibleSections, type ResumeWithSections, type Section } from '../utils';
import { buildClassicSectionContent } from './classic';

function buildDeveloperSectionContent(section: Section): string {
  const c = section.content as any;
  const DARK = '#282c34';
  const GREEN = '#98c379';
  const BLUE = '#61afef';
  const ORANGE = '#e5c07b';
  if (section.type === 'summary') return `<p class="text-sm leading-relaxed text-zinc-600">${esc((c as SummaryContent).text)}</p>`;
  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${DARK}">${esc(it.position)}</span>${it.company ? `<span class="text-sm" style="color:${BLUE}"> @ ${esc(it.company)}</span>` : ''}</div><span class="shrink-0 rounded px-2 py-0.5 text-[10px] font-medium" style="background:#f0f0f0;color:#636d83">${esc(it.startDate)} – ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 space-y-0.5">${it.highlights.filter(Boolean).map((h: string) => `<li class="flex items-start gap-2 text-sm text-zinc-600"><span class="mt-1 shrink-0 text-xs" style="color:${GREEN}">$</span>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${DARK}">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</span>${it.institution ? `<span class="text-sm text-zinc-500"> — ${esc(it.institution)}</span>` : ''}</div><span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)} – ${esc(it.endDate)}</span></div>
      ${it.gpa ? `<p class="text-sm text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'skills') {
    return `<div class="space-y-2">${((c as SkillsContent).categories || []).map((cat: any) =>
      `<div><span class="text-xs font-bold" style="color:${ORANGE}">${esc(cat.name)}: </span><span class="text-sm text-zinc-600">${esc((cat.skills || []).join(' | '))}</span></div>`
    ).join('')}</div>`;
  }
  return buildClassicSectionContent(section);
}

export function buildDeveloperHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);
  const DARK = '#282c34';
  const GREEN = '#98c379';
  const BLUE = '#61afef';
  const ORANGE = '#e5c07b';

  return `<div class="mx-auto max-w-[210mm] bg-white shadow-lg" style="font-family:'JetBrains Mono','Fira Code',monospace">
    <div class="px-8 py-6" style="background:${DARK}">
      <div class="mb-3 flex items-center gap-1.5">
        <div class="h-3 w-3 rounded-full bg-[#ff5f56]"></div>
        <div class="h-3 w-3 rounded-full bg-[#ffbd2e]"></div>
        <div class="h-3 w-3 rounded-full bg-[#27c93f]"></div>
        <span class="ml-3 text-xs text-zinc-500">~/resume</span>
      </div>
      <div class="flex items-center gap-4">
        ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="h-16 w-16 shrink-0 rounded-lg object-cover"/>` : ''}
        <div>
          <h1 class="text-2xl font-bold" style="color:${GREEN}">${esc(pi.fullName || 'Your Name')}</h1>
          ${pi.jobTitle ? `<p class="mt-0.5 text-sm" style="color:${BLUE}">// ${esc(pi.jobTitle)}</p>` : ''}
          ${contacts.length ? `<div class="mt-2 flex flex-wrap gap-3 text-xs text-zinc-400">${contacts.map(c => `<span>${esc(c)}</span>`).join('')}</div>` : ''}
        </div>
      </div>
    </div>
    <div class="p-8">
      ${sections.map(s => `<div class="mb-6" data-section>
        <h2 class="mb-2 text-sm font-bold" style="color:${ORANGE}">&gt; ${esc(s.title).toUpperCase()}</h2>
        <div class="border-l-2 pl-4" style="border-color:#3e4451">
          ${buildDeveloperSectionContent(s)}
        </div>
      </div>`).join('')}
    </div>
  </div>`;
}
