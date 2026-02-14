import { esc, getPersonalInfo, visibleSections, buildHighlights, type ResumeWithSections, type Section } from '../utils';

function buildEuroSectionContent(s: Section): string {
  const c = s.content as any;
  const BL = '#1e40af';

  if (s.type === 'summary') return `<p class="text-sm leading-relaxed text-zinc-600">${esc(c.text)}</p>`;

  if (s.type === 'work_experience') {
    return `<div class="space-y-3">${(c.items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between">
        <div><span class="text-sm font-bold text-zinc-800">${esc(it.position)}</span>${it.company ? `<span class="text-sm text-zinc-500"> — ${esc(it.company)}</span>` : ''}</div>
        <span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)} – ${it.current ? 'Present' : esc(it.endDate || '')}</span>
      </div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (s.type === 'education') {
    return `<div class="space-y-3">${(c.items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between">
        <div><span class="text-sm font-bold text-zinc-800">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</span>${it.institution ? `<span class="text-sm text-zinc-500"> — ${esc(it.institution)}</span>` : ''}</div>
        <span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)} – ${esc(it.endDate || '')}</span>
      </div>
      ${it.gpa ? `<p class="text-sm text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
    </div>`).join('')}</div>`;
  }

  if (s.type === 'skills') {
    return `<div class="space-y-1">${(c.categories || []).map((cat: any) =>
      `<div class="flex text-sm"><span class="w-28 shrink-0 font-medium" style="color:${BL}">${esc(cat.name)}:</span><span class="text-zinc-600">${esc((cat.skills || []).join(', '))}</span></div>`
    ).join('')}</div>`;
  }

  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div>
      <span class="text-sm font-medium text-zinc-700">${esc(it.name || it.title || it.language)}</span>
      ${it.description ? `<p class="text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }

  return '';
}

export function buildEuroHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const BL = '#1e40af';

  return `<div class="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style="font-family:Inter,sans-serif">
    <div class="mb-6 flex items-start gap-6">
      <div class="flex-1">
        <h1 class="text-3xl font-bold" style="color:${BL}">${esc(pi.fullName || 'Your Name')}</h1>
        ${pi.jobTitle ? `<p class="mt-1 text-base text-zinc-500">${esc(pi.jobTitle)}</p>` : ''}
        <div class="mt-3 space-y-0.5 text-sm text-zinc-600">
          ${pi.email ? `<div><span class="inline-block w-20 text-xs font-semibold uppercase text-zinc-400">Email</span>${esc(pi.email)}</div>` : ''}
          ${pi.phone ? `<div><span class="inline-block w-20 text-xs font-semibold uppercase text-zinc-400">Phone</span>${esc(pi.phone)}</div>` : ''}
          ${pi.location ? `<div><span class="inline-block w-20 text-xs font-semibold uppercase text-zinc-400">Address</span>${esc(pi.location)}</div>` : ''}
          ${pi.website ? `<div><span class="inline-block w-20 text-xs font-semibold uppercase text-zinc-400">Website</span>${esc(pi.website)}</div>` : ''}
        </div>
      </div>
      ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="h-28 shrink-0 rounded border-2 object-cover" style="width:5.5rem;border-color:${BL}"/>` : ''}
    </div>
    <div class="h-1 w-full rounded" style="background:${BL}"></div>
    <div class="mt-6">
      ${sections.map(s => `<div class="mb-5 flex gap-4" data-section>
        <div class="w-28 shrink-0 pt-0.5 text-right">
          <h2 class="text-xs font-bold uppercase tracking-wider" style="color:${BL}">${esc(s.title)}</h2>
        </div>
        <div class="flex-1 border-l-2 pl-4" style="border-color:#dbeafe">
          ${buildEuroSectionContent(s)}
        </div>
      </div>`).join('')}
    </div>
  </div>`;
}
