import { esc, getPersonalInfo, visibleSections, buildHighlights, type ResumeWithSections, type Section } from '../utils';

function buildCleanSectionContent(s: Section): string {
  const c = s.content as any;
  const TL = '#0d9488';

  if (s.type === 'summary') return `<p class="text-sm leading-relaxed text-zinc-600">${esc(c.text)}</p>`;

  if (s.type === 'work_experience') {
    return `<div class="space-y-4">${(c.items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between">
        <div><span class="text-sm font-bold text-zinc-800">${esc(it.position)}</span>${it.company ? `<span class="text-sm" style="color:${TL}"> | ${esc(it.company)}</span>` : ''}</div>
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
    return `<div class="flex flex-wrap gap-2">${(c.categories || []).flatMap((cat: any) =>
      (cat.skills || []).map((skill: string) =>
        `<span class="rounded-full border px-3 py-0.5 text-xs font-medium" style="border-color:${TL};color:${TL}">${esc(skill)}</span>`
      )
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

export function buildCleanHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);
  const BL = '#0066cc';
  const TL = '#0d9488';

  return `<div class="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style="font-family:Inter,sans-serif">
    <div class="mb-6">
      <div class="flex items-center gap-4">
        ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="h-16 w-16 shrink-0 rounded-full border-2 object-cover" style="border-color:${BL}"/>` : ''}
        <div>
          <h1 class="text-2xl font-bold" style="color:${BL}">${esc(pi.fullName || 'Your Name')}</h1>
          ${pi.jobTitle ? `<p class="mt-0.5 text-base" style="color:${TL}">${esc(pi.jobTitle)}</p>` : ''}
        </div>
      </div>
      ${contacts.length ? `<div class="mt-3 flex flex-wrap gap-4 text-sm text-zinc-500">${contacts.map(c => `<span>${esc(c)}</span>`).join('')}</div>` : ''}
      <div class="mt-3 h-0.5 w-full rounded" style="background:linear-gradient(90deg,${BL},${TL})"></div>
    </div>
    ${sections.map(s => `<div class="mb-5" data-section>
      <h2 class="mb-2 text-sm font-bold uppercase tracking-wider" style="color:${BL}">${esc(s.title)}</h2>
      ${buildCleanSectionContent(s)}
    </div>`).join('')}
  </div>`;
}
