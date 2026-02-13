import type {
  SummaryContent,
  WorkExperienceContent,
  EducationContent,
  SkillsContent,
} from '@/types/resume';
import { esc, getPersonalInfo, visibleSections, buildHighlights, type ResumeWithSections, type Section } from '../utils';
import { buildClassicSectionContent } from './classic';

function buildInfographicSectionContent(section: Section, color: string): string {
  const c = section.content as any;
  if (section.type === 'summary') return `<p class="rounded-lg border-l-4 bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-600" style="border-color:${color}">${esc((c as SummaryContent).text)}</p>`;
  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div class="rounded-lg border border-zinc-100 p-4">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold text-zinc-800">${esc(it.position)}</h3><span class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style="background:${color}">${esc(it.startDate)} – ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.company ? `<p class="text-sm" style="color:${color}">${esc(it.company)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div class="rounded-lg border border-zinc-100 p-4">
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold text-zinc-800">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</span>${it.institution ? `<span class="text-sm text-zinc-500"> — ${esc(it.institution)}</span>` : ''}</div><span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)} – ${esc(it.endDate)}</span></div>
      ${it.gpa ? `<p class="text-sm text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'skills') {
    const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];
    return `<div class="space-y-2">${((c as SkillsContent).categories || []).map((cat: any, ci: number) => `<div>
      <p class="mb-1 text-xs font-bold text-zinc-500">${esc(cat.name)}</p>
      <div class="flex flex-wrap gap-1.5">${(cat.skills || []).map((skill: string) =>
        `<span class="rounded-full px-2.5 py-0.5 text-xs font-medium text-white" style="background:${COLORS[ci % COLORS.length]}">${esc(skill)}</span>`
      ).join('')}</div>
    </div>`).join('')}</div>`;
  }
  return buildClassicSectionContent(section);
}

export function buildInfographicHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);
  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];

  return `<div class="mx-auto max-w-[210mm] bg-white shadow-lg" style="font-family:Inter,sans-serif">
    <div class="relative overflow-hidden px-8 py-8" style="background:linear-gradient(135deg,#1e40af,#7c3aed)">
      <div class="relative flex items-center gap-5">
        ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="h-20 w-20 shrink-0 rounded-full border-white/30 object-cover" style="border-width:3px"/>` : ''}
        <div>
          <h1 class="text-3xl font-bold text-white">${esc(pi.fullName || 'Your Name')}</h1>
          ${pi.jobTitle ? `<p class="mt-1 text-base text-white/70">${esc(pi.jobTitle)}</p>` : ''}
          ${contacts.length ? `<div class="mt-2 flex flex-wrap gap-3 text-sm text-white/60">${contacts.map(c => `<span>${esc(c)}</span>`).join('')}</div>` : ''}
        </div>
      </div>
    </div>
    <div class="p-8">
      ${sections.map((s, idx) => `<div class="mb-6" data-section>
        <h2 class="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
          <span class="inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] text-white" style="background:${COLORS[idx % COLORS.length]}">${idx + 1}</span>
          <span style="color:${COLORS[idx % COLORS.length]}">${esc(s.title)}</span>
        </h2>
        ${buildInfographicSectionContent(s, COLORS[idx % COLORS.length])}
      </div>`).join('')}
    </div>
  </div>`;
}
