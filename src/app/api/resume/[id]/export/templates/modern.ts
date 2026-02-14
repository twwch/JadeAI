import type {
  SummaryContent,
  WorkExperienceContent,
  EducationContent,
  SkillsContent,
} from '@/types/resume';
import { esc, getPersonalInfo, visibleSections, buildHighlights, type ResumeWithSections, type Section } from '../utils';

function buildModernSectionContent(section: Section): string {
  const c = section.content as any;
  if (section.type === 'summary') return `<p class="text-sm leading-relaxed text-zinc-600">${esc((c as SummaryContent).text)}</p>`;
  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div class="border-l-2 pl-4" style="border-color:#e94560">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-semibold text-zinc-800">${esc(it.position)}</h3><span class="shrink-0 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-500">${esc(it.startDate)} - ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.company ? `<p class="text-sm" style="color:#e94560">${esc(it.company)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div class="border-l-2 pl-4" style="border-color:#0f3460">
      <h3 class="text-sm font-semibold text-zinc-800">${esc(it.institution)}</h3>
      <p class="text-sm text-zinc-600">${esc(it.degree)} ${it.field ? `- ${esc(it.field)}` : ''}</p>
      <span class="text-xs text-zinc-400">${esc(it.startDate)} - ${esc(it.endDate)}</span>
    </div>`).join('')}</div>`;
  }
  if (section.type === 'skills') {
    const allSkills = ((c as SkillsContent).categories || []).flatMap((cat: any) => cat.skills || []);
    return `<div class="flex flex-wrap gap-2">${allSkills.map((skill: string) =>
      `<span class="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700">${esc(skill)}</span>`
    ).join('')}</div>`;
  }
  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div class="border-l-2 border-zinc-200 pl-4"><span class="text-sm font-medium text-zinc-700">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm text-zinc-600">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }
  return '';
}

export function buildModernHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);

  return `<div class="mx-auto max-w-[210mm] overflow-hidden bg-white shadow-lg" style="font-family:Inter,sans-serif">
    <div class="relative px-10 py-8 text-white" style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)">
      <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-10" style="background:radial-gradient(circle,#e94560 0%,transparent 70%)"></div>
      <div class="absolute -bottom-6 right-20 h-24 w-24 rounded-full" style="opacity:0.08;background:radial-gradient(circle,#e94560 0%,transparent 70%)"></div>
      <div class="relative flex items-center gap-6">
        ${pi.avatar ? `<div class="shrink-0 rounded-full p-[2px]" style="background:linear-gradient(135deg,#e94560,#0f3460)"><img src="${esc(pi.avatar)}" alt="" class="h-[80px] w-[80px] rounded-full border-2 border-white/10 object-cover"/></div>` : ''}
        <div class="min-w-0 flex-1">
          <h1 class="text-3xl font-bold tracking-tight">${esc(pi.fullName || 'Your Name')}</h1>
          ${pi.jobTitle ? `<p class="mt-1.5 text-base font-light tracking-wide" style="color:#e94560">${esc(pi.jobTitle)}</p>` : ''}
          <div class="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-zinc-300">
            ${contacts.map((c, i) => `<span class="flex items-center gap-1.5">${esc(c)}${i < contacts.length - 1 ? '<span class="text-zinc-500">|</span>' : ''}</span>`).join('')}
          </div>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 h-[3px] w-full" style="background:linear-gradient(90deg,#e94560 0%,#0f3460 60%,transparent 100%)"></div>
    </div>
    <div class="p-8 pt-6">
      ${sections.map(s => `<div class="mb-6" data-section>
        <h2 class="mb-3 flex items-center gap-2.5 text-sm font-bold uppercase tracking-wider" style="color:#e94560">
          <span class="h-[3px] w-7 rounded-full" style="background:linear-gradient(90deg,#e94560,#0f3460)"></span>${esc(s.title)}
        </h2>
        ${buildModernSectionContent(s)}
      </div>`).join('')}
    </div>
  </div>`;
}
