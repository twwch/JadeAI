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
import { esc, getPersonalInfo, visibleSections, buildHighlights, type ResumeWithSections, type Section } from '../utils';

const PRIMARY = '#1e293b';
const ACCENT = '#8b5cf6';
const ALT_BG = '#f5f3ff';

function buildZigzagSectionContent(section: Section, isEven: boolean): string {
  const c = section.content as any;
  const alignReverse = isEven ? '' : 'flex-row-reverse';

  if (section.type === 'summary') {
    return `<p class="text-sm leading-relaxed text-zinc-600">${esc((c as SummaryContent).text)}</p>`;
  }
  if (section.type === 'work_experience') {
    return `<div class="space-y-3 text-left">${((c as WorkExperienceContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between ${alignReverse}"><div><span class="text-sm font-semibold" style="color:${PRIMARY}">${esc(it.position)}</span>${it.company ? `<span class="text-sm" style="color:${ACCENT}"> | ${esc(it.company)}</span>` : ''}</div><span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)} – ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'education') {
    return `<div class="space-y-3 text-left">${((c as EducationContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between ${alignReverse}"><span class="text-sm font-semibold" style="color:${PRIMARY}">${esc(it.institution)}</span><span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)} – ${esc(it.endDate)}</span></div>
      <p class="text-sm text-zinc-600">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</p>
      ${it.gpa ? `<p class="text-xs text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'skills') {
    return `<div class="space-y-2 text-left">${((c as SkillsContent).categories || []).map((cat: any) => `<div>
      <p class="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">${esc(cat.name)}</p>
      <div class="flex flex-wrap gap-1.5 ${isEven ? '' : 'justify-end'}">${(cat.skills || []).map((s: string) => `<span class="rounded-full border px-2 py-0.5 text-xs font-medium" style="border-color:${ACCENT}50;color:${ACCENT};background-color:${ACCENT}08">${esc(s)}</span>`).join('')}</div>
    </div>`).join('')}</div>`;
  }
  if (section.type === 'projects') {
    return `<div class="space-y-3 text-left">${((c as ProjectsContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between ${alignReverse}"><span class="text-sm font-semibold" style="color:${ACCENT}">${esc(it.name)}</span>${it.startDate ? `<span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)}${it.endDate ? ` – ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<div class="mt-1 flex flex-wrap gap-1">${it.technologies.map((t: string) => `<span class="rounded-full px-2 py-0.5 text-[10px] text-white" style="background-color:${ACCENT}">${esc(t)}</span>`).join('')}</div>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'certifications') {
    return `<div class="space-y-1.5 text-left">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div class="flex items-baseline justify-between ${alignReverse}"><div><span class="text-sm font-semibold" style="color:${PRIMARY}">${esc(it.name)}</span>${it.issuer ? `<span class="text-sm text-zinc-600"> — ${esc(it.issuer)}</span>` : ''}</div>${it.date ? `<span class="text-xs text-zinc-400">${esc(it.date)}</span>` : ''}</div>`
    ).join('')}</div>`;
  }
  if (section.type === 'languages') {
    return `<div class="flex flex-wrap gap-3 ${isEven ? '' : 'justify-end'}">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div class="flex items-center gap-2 rounded-full px-3 py-1" style="background-color:${ACCENT}10;border:1px solid ${ACCENT}30"><span class="text-sm font-medium" style="color:${PRIMARY}">${esc(it.language)}</span><span class="text-xs text-zinc-400">${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }
  if (section.type === 'custom') {
    return `<div class="space-y-2 text-left">${((c as CustomContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between ${alignReverse}"><span class="text-sm font-semibold" style="color:${PRIMARY}">${esc(it.title)}</span>${it.date ? `<span class="text-xs text-zinc-400">${esc(it.date)}</span>` : ''}</div>
      ${it.subtitle ? `<p class="text-sm text-zinc-500">${esc(it.subtitle)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }
  if (c.items) {
    return `<div class="space-y-2 text-left">${c.items.map((it: any) => `<div><span class="text-sm font-medium" style="color:${PRIMARY}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm text-zinc-600">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }
  return '';
}

export function buildZigzagHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);

  const zigzagDots = Array.from({ length: 20 }, (_, i) =>
    `<div class="h-1 w-3 rounded-full" style="background-color:${i % 2 === 0 ? ACCENT : `${ACCENT}40`}"></div>`
  ).join('');

  const zigzagSvg = `<svg width="40" height="12" viewBox="0 0 40 12" fill="none"><path d="M0 6 L10 1 L20 6 L30 1 L40 6" stroke="${ACCENT}" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.4"/></svg>`;

  return `<div class="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style="font-family:Inter,sans-serif">
    <div class="mb-6 text-center">
      ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="mx-auto mb-3 h-20 w-20 rounded-full object-cover" style="border:3px solid ${ACCENT}"/>` : ''}
      <h1 class="text-2xl font-bold" style="color:${PRIMARY}">${esc(pi.fullName || 'Your Name')}</h1>
      ${pi.jobTitle ? `<p class="mt-1 text-sm font-medium" style="color:${ACCENT}">${esc(pi.jobTitle)}</p>` : ''}
      ${contacts.length ? `<div class="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-500">${contacts.map(ct => `<span>${esc(ct)}</span>`).join('')}</div>` : ''}
    </div>
    <div class="mb-6 flex items-center justify-center gap-1">${zigzagDots}</div>
    ${sections.map((s, idx) => {
      const isEven = idx % 2 === 0;
      return `<div class="mb-5" data-section>
        <div class="rounded-lg p-4" style="background-color:${isEven ? 'transparent' : ALT_BG}">
          <div class="mb-2 flex items-center gap-2 ${isEven ? '' : 'flex-row-reverse'}"><div class="h-5 w-1 rounded-full" style="background-color:${ACCENT}"></div><h2 class="text-sm font-bold uppercase tracking-wider ${isEven ? '' : 'text-right'}" style="color:${PRIMARY}">${esc(s.title)}</h2></div>
          <div class="${isEven ? '' : 'text-right'}">${buildZigzagSectionContent(s, isEven)}</div>
        </div>
        ${idx < sections.length - 1 ? `<div class="my-2 flex items-center justify-center">${zigzagSvg}</div>` : ''}
      </div>`;
    }).join('')}
  </div>`;
}
