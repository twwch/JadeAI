import { esc, getPersonalInfo, visibleSections, type ResumeWithSections, type Section } from '../utils';

function buildBoldSectionContent(s: Section): string {
  const c = s.content as any;

  if (s.type === 'summary') return `<p class="text-sm leading-relaxed text-zinc-600">${esc(c.text)}</p>`;

  if (s.type === 'work_experience') {
    return `<div class="space-y-4">${(c.items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between">
        <div><span class="text-base font-bold text-black">${esc(it.position)}</span>${it.company ? `<span class="text-sm text-zinc-500"> | ${esc(it.company)}</span>` : ''}</div>
        <span class="shrink-0 bg-black px-2 py-0.5 text-xs font-medium text-white">${esc(it.startDate)} – ${it.current ? 'Present' : esc(it.endDate || '')}</span>
      </div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-5">${it.highlights.map((h: string) => `<li class="text-sm text-zinc-600">${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }

  if (s.type === 'education') {
    return `<div class="space-y-3">${(c.items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between">
        <div><span class="text-base font-bold text-black">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</span>${it.institution ? `<span class="text-sm text-zinc-500"> — ${esc(it.institution)}</span>` : ''}</div>
        <span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)} – ${esc(it.endDate || '')}</span>
      </div>
      ${it.gpa ? `<p class="text-sm text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
    </div>`).join('')}</div>`;
  }

  if (s.type === 'skills') {
    return `<div class="flex flex-wrap gap-2">${(c.categories || []).flatMap((cat: any) =>
      (cat.skills || []).map((skill: string) =>
        `<span class="border-2 border-black px-3 py-1 text-xs font-bold text-black">${esc(skill)}</span>`
      )
    ).join('')}</div>`;
  }

  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div>
      <span class="text-sm font-bold text-black">${esc(it.name || it.title || it.language)}</span>
      ${it.description ? `<p class="text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }

  return '';
}

export function buildBoldHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);

  return `<div class="mx-auto max-w-[210mm] bg-white shadow-lg" style="font-family:Inter,sans-serif">
    <div class="bg-black px-8 py-8 text-white">
      <div class="flex items-center gap-5">
        ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="h-20 w-20 shrink-0 rounded-full border-3 border-white object-cover"/>` : ''}
        <div>
          <h1 class="text-4xl font-black tracking-tight">${esc(pi.fullName || 'Your Name')}</h1>
          ${pi.jobTitle ? `<p class="mt-1 text-lg font-light text-zinc-400">${esc(pi.jobTitle)}</p>` : ''}
        </div>
      </div>
      ${contacts.length ? `<div class="mt-3 flex flex-wrap gap-4 text-sm text-zinc-400">${contacts.map(c => `<span>${esc(c)}</span>`).join('')}</div>` : ''}
    </div>
    <div class="p-8">
      ${sections.map(s => `<div class="mb-6" data-section>
        <h2 class="mb-3 border-b-4 border-black pb-1 text-lg font-black uppercase tracking-wider text-black">${esc(s.title)}</h2>
        ${buildBoldSectionContent(s)}
      </div>`).join('')}
    </div>
  </div>`;
}
