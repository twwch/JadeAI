import { esc, getPersonalInfo, visibleSections, buildHighlights, type ResumeWithSections, type Section } from '../utils';

function buildTimelineSectionContent(s: Section): string {
  const c = s.content as any;
  const BG = '#475569';
  const AC = '#3b82f6';

  if (s.type === 'summary') return `<p class="text-sm leading-relaxed text-zinc-600">${esc(c.text)}</p>`;

  if (s.type === 'work_experience') {
    const items = c.items || [];
    return `<div class="relative border-l-2 pl-6 ml-2" style="border-color:#e2e8f0">${items.map((it: any, idx: number) => `<div class="relative${idx < items.length - 1 ? ' pb-5' : ''}">
      <div class="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 bg-white" style="border-color:${AC}"></div>
      <div class="flex items-baseline justify-between">
        <div><span class="text-sm font-bold" style="color:${BG}">${esc(it.position)}</span>${it.company ? `<span class="text-sm text-zinc-500"> | ${esc(it.company)}</span>` : ''}</div>
        <span class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium" style="background:#eff6ff;color:${AC}">${esc(it.startDate)} – ${it.current ? 'Present' : esc(it.endDate || '')}</span>
      </div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (s.type === 'education') {
    const items = c.items || [];
    return `<div class="relative border-l-2 pl-6 ml-2" style="border-color:#e2e8f0">${items.map((it: any, idx: number) => `<div class="relative${idx < items.length - 1 ? ' pb-4' : ''}">
      <div class="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 bg-white" style="border-color:${AC}"></div>
      <div class="flex items-baseline justify-between">
        <div><span class="text-sm font-bold" style="color:${BG}">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</span>${it.institution ? `<span class="text-sm text-zinc-500"> — ${esc(it.institution)}</span>` : ''}</div>
        <span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)} – ${esc(it.endDate || '')}</span>
      </div>
      ${it.gpa ? `<p class="text-sm text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
    </div>`).join('')}</div>`;
  }

  if (s.type === 'skills') {
    return `<div class="space-y-1">${(c.categories || []).map((cat: any) =>
      `<div class="flex text-sm"><span class="w-28 shrink-0 font-medium" style="color:${AC}">${esc(cat.name)}:</span><span class="text-zinc-600">${esc((cat.skills || []).join(', '))}</span></div>`
    ).join('')}</div>`;
  }

  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div>
      <span class="text-sm font-medium" style="color:${BG}">${esc(it.name || it.title || it.language)}</span>
      ${it.description ? `<p class="text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }

  return '';
}

export function buildTimelineHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);
  const BG = '#475569';
  const AC = '#3b82f6';

  return `<div class="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style="font-family:Inter,sans-serif">
    <div class="mb-6 text-center">
      ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="mx-auto mb-3 h-18 w-18 rounded-full border-2 object-cover" style="border-color:${AC}"/>` : ''}
      <h1 class="text-2xl font-bold" style="color:${BG}">${esc(pi.fullName || 'Your Name')}</h1>
      ${pi.jobTitle ? `<p class="mt-0.5 text-base" style="color:${AC}">${esc(pi.jobTitle)}</p>` : ''}
      ${contacts.length ? `<div class="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-500">${contacts.map(c => `<span>${esc(c)}</span>`).join('')}</div>` : ''}
    </div>
    ${sections.map(s => `<div class="mb-6" data-section>
      <h2 class="mb-3 text-sm font-bold uppercase tracking-wider" style="color:${BG}">${esc(s.title)}</h2>
      ${buildTimelineSectionContent(s)}
    </div>`).join('')}
  </div>`;
}
