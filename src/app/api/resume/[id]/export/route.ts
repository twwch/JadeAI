import { NextRequest, NextResponse } from 'next/server';
import { resumeRepository } from '@/lib/db/repositories/resume.repository';
import { resolveUser, getUserIdFromRequest } from '@/lib/auth/helpers';
import type {
  PersonalInfoContent,
  WorkExperienceContent,
  EducationContent,
  SkillsContent,
  ProjectsContent,
  CertificationsContent,
  LanguagesContent,
  SummaryContent,
  CustomContent,
} from '@/types/resume';

type ResumeWithSections = NonNullable<Awaited<ReturnType<typeof resumeRepository.findById>>>;
type Section = ResumeWithSections['sections'][number];

// ─── Helpers ──────────────────────────────────────────────────

function esc(text: unknown): string {
  if (text == null) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function safe(val: unknown): string {
  return val != null ? String(val) : '';
}

// ─── Theme CSS for HTML export ────────────────────────────────

const FONT_SIZE_SCALE: Record<string, { body: string; h1: string; h2: string; h3: string }> = {
  small:  { body: '12px', h1: '22px', h2: '15px', h3: '13px' },
  medium: { body: '14px', h1: '26px', h2: '17px', h3: '15px' },
  large:  { body: '16px', h1: '30px', h2: '19px', h3: '17px' },
};

const DEFAULT_THEME = {
  primaryColor: '#1a1a1a',
  accentColor: '#3b82f6',
  fontFamily: 'Inter',
  fontSize: 'medium',
  lineSpacing: 1.5,
  margin: { top: 20, right: 20, bottom: 20, left: 20 },
  sectionSpacing: 16,
};

function buildExportThemeCSS(theme: typeof DEFAULT_THEME): string {
  const fs = FONT_SIZE_SCALE[theme.fontSize] || FONT_SIZE_SCALE.medium;
  const m = theme.margin;
  const sel = '.resume-export';
  return `
    ${sel} > div {
      font-family: ${theme.fontFamily}, sans-serif !important;
      line-height: ${theme.lineSpacing} !important;
      padding: ${m.top}px ${m.right}px ${m.bottom}px ${m.left}px !important;
    }
    ${sel} p, ${sel} li, ${sel} span:not(.shrink-0), ${sel} td, ${sel} a {
      font-size: ${fs.body} !important;
      line-height: ${theme.lineSpacing} !important;
    }
    ${sel} h1 { color: ${theme.primaryColor} !important; font-size: ${fs.h1} !important; }
    ${sel} h2 { color: ${theme.primaryColor} !important; font-size: ${fs.h2} !important; border-color: ${theme.accentColor} !important; }
    ${sel} h3 { color: ${theme.primaryColor} !important; font-size: ${fs.h3} !important; }
    ${sel} [class*="border-b-2"], ${sel} [class*="border-b-"] { border-color: ${theme.accentColor} !important; }
    ${sel} [data-section] { margin-bottom: ${theme.sectionSpacing}px !important; }
  `;
}

// ─── Plain Text ──────────────────────────────────────────────

function generatePlainText(resume: ResumeWithSections): string {
  const lines: string[] = [];

  for (const section of resume.sections) {
    if (!section.visible) continue;

    switch (section.type) {
      case 'personal_info': {
        const info = section.content as PersonalInfoContent;
        if (info.fullName) lines.push(info.fullName);
        if (info.jobTitle) lines.push(info.jobTitle);
        const contactParts: string[] = [];
        if (info.email) contactParts.push(info.email);
        if (info.phone) contactParts.push(info.phone);
        if (info.location) contactParts.push(info.location);
        if (contactParts.length > 0) lines.push(contactParts.join(' | '));
        if (info.website) lines.push(info.website);
        lines.push('');
        break;
      }
      case 'summary': {
        const summary = section.content as SummaryContent;
        lines.push(`== ${section.title} ==`);
        if (summary.text) lines.push(summary.text);
        lines.push('');
        break;
      }
      case 'work_experience': {
        const work = section.content as WorkExperienceContent;
        lines.push(`== ${section.title} ==`);
        for (const item of work.items || []) {
          lines.push(`- ${safe(item.position)} at ${safe(item.company)}`);
          const dateRange = item.current ? `${safe(item.startDate)} - Present` : `${safe(item.startDate)} - ${safe(item.endDate)}`;
          lines.push(`  ${dateRange}${item.location ? ` | ${item.location}` : ''}`);
          if (item.description) lines.push(`  ${item.description}`);
          for (const h of item.highlights || []) {
            if (h) lines.push(`  * ${h}`);
          }
        }
        lines.push('');
        break;
      }
      case 'education': {
        const edu = section.content as EducationContent;
        lines.push(`== ${section.title} ==`);
        for (const item of edu.items || []) {
          lines.push(`- ${safe(item.degree)} in ${safe(item.field)}, ${safe(item.institution)}`);
          lines.push(`  ${safe(item.startDate)} - ${safe(item.endDate)}${item.location ? ` | ${item.location}` : ''}`);
          if (item.gpa) lines.push(`  GPA: ${item.gpa}`);
          for (const h of item.highlights || []) {
            if (h) lines.push(`  * ${h}`);
          }
        }
        lines.push('');
        break;
      }
      case 'skills': {
        const skills = section.content as SkillsContent;
        lines.push(`== ${section.title} ==`);
        for (const cat of skills.categories || []) {
          lines.push(`- ${safe(cat.name)}: ${(cat.skills || []).join(', ')}`);
        }
        lines.push('');
        break;
      }
      case 'projects': {
        const projects = section.content as ProjectsContent;
        lines.push(`== ${section.title} ==`);
        for (const item of projects.items || []) {
          lines.push(`- ${safe(item.name)}${item.url ? ` (${item.url})` : ''}`);
          if (item.startDate) {
            lines.push(`  ${item.startDate}${item.endDate ? ` - ${item.endDate}` : ''}`);
          }
          if (item.description) lines.push(`  ${item.description}`);
          if (item.technologies?.length) lines.push(`  Technologies: ${item.technologies.join(', ')}`);
          for (const h of item.highlights || []) {
            if (h) lines.push(`  * ${h}`);
          }
        }
        lines.push('');
        break;
      }
      case 'certifications': {
        const certs = section.content as CertificationsContent;
        lines.push(`== ${section.title} ==`);
        for (const item of certs.items || []) {
          lines.push(`- ${safe(item.name)}, ${safe(item.issuer)} (${safe(item.date)})`);
        }
        lines.push('');
        break;
      }
      case 'languages': {
        const langs = section.content as LanguagesContent;
        lines.push(`== ${section.title} ==`);
        for (const item of langs.items || []) {
          lines.push(`- ${safe(item.language)}: ${safe(item.proficiency)}`);
        }
        lines.push('');
        break;
      }
      default: {
        const custom = section.content as CustomContent;
        lines.push(`== ${section.title} ==`);
        for (const item of (custom as any).items || []) {
          lines.push(`- ${safe(item.title)}${item.subtitle ? ` - ${item.subtitle}` : ''}`);
          if (item.date) lines.push(`  ${item.date}`);
          if (item.description) lines.push(`  ${item.description}`);
        }
        lines.push('');
        break;
      }
    }
  }

  return lines.join('\n');
}

// ─── Section empty check ──────────────────────────────────────

function isSectionEmpty(section: Section): boolean {
  const content = section.content as any;
  if (section.type === 'summary') return !(content as SummaryContent).text;
  if (section.type === 'skills') {
    const categories = (content as SkillsContent).categories;
    return !categories?.length || categories.every((cat: any) => !cat.skills?.length);
  }
  if ('items' in content) return !content.items?.length;
  return false;
}

// ─── HTML (template-specific string builders) ─────────────────

function visibleSections(resume: ResumeWithSections): Section[] {
  return resume.sections.filter((s: Section) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s));
}

function getPersonalInfo(resume: ResumeWithSections): PersonalInfoContent {
  const sec = resume.sections.find((s: Section) => s.type === 'personal_info');
  return (sec?.content || {}) as PersonalInfoContent;
}

// ── Shared section content builders (per template style) ──

function buildHighlights(highlights: string[] | undefined, liClass: string, bulletStyle?: string): string {
  if (!highlights?.length) return '';
  if (bulletStyle === 'custom-dot') {
    return highlights.map(h =>
      `<li class="flex items-start gap-2 text-sm text-zinc-600"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style="background:linear-gradient(135deg,#7c3aed,#f97316)"></span>${esc(h)}</li>`
    ).join('');
  }
  return highlights.filter(Boolean).map(h => `<li class="${liClass}">${esc(h)}</li>`).join('');
}

function buildClassicSectionContent(section: Section): string {
  const c = section.content as any;
  if (section.type === 'summary') return `<p class="text-sm text-zinc-600 leading-relaxed">${esc((c as SummaryContent).text)}</p>`;
  if (section.type === 'work_experience') {
    return `<div class="space-y-3">${((c as WorkExperienceContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="font-semibold text-zinc-800 text-sm">${esc(it.position)}</span>${it.company ? `<span class="text-sm text-zinc-600"> at ${esc(it.company)}</span>` : ''}</div><span class="text-xs text-zinc-400">${esc(it.startDate)} - ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="font-semibold text-zinc-800 text-sm">${esc(it.degree)} ${it.field ? `in ${esc(it.field)}` : ''}</span>${it.institution ? `<span class="text-sm text-zinc-600"> - ${esc(it.institution)}</span>` : ''}</div><span class="text-xs text-zinc-400">${esc(it.startDate)} - ${esc(it.endDate)}</span></div>
      ${it.gpa ? `<p class="text-sm text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'skills') {
    return `<div class="space-y-1">${((c as SkillsContent).categories || []).map((cat: any) =>
      `<div class="flex text-sm"><span class="font-medium text-zinc-700 w-28 shrink-0">${esc(cat.name)}:</span><span class="text-zinc-600">${esc((cat.skills || []).join(', '))}</span></div>`
    ).join('')}</div>`;
  }
  if (section.type === 'projects') {
    return `<div class="space-y-3">${((c as ProjectsContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><span class="font-semibold text-zinc-800 text-sm">${esc(it.name)}</span>${it.startDate ? `<span class="text-xs text-zinc-400">${esc(it.startDate)}${it.endDate ? ` - ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<p class="mt-0.5 text-xs text-zinc-400">Tech: ${esc(it.technologies.join(', '))}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'certifications') {
    return `<div class="space-y-1">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div><span class="font-semibold text-zinc-800 text-sm">${esc(it.name)}</span><span class="text-sm text-zinc-600"> — ${esc(it.issuer)} (${esc(it.date)})</span></div>`
    ).join('')}</div>`;
  }
  if (section.type === 'languages') {
    return `<div class="space-y-1">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div><span class="font-semibold text-zinc-800 text-sm">${esc(it.language)}</span><span class="text-sm text-zinc-600"> — ${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }
  if (section.type === 'custom') {
    return `<div class="space-y-2">${((c as CustomContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-semibold text-zinc-800">${esc(it.title)}</span>${it.subtitle ? `<span class="text-sm text-zinc-500"> — ${esc(it.subtitle)}</span>` : ''}</div>${it.date ? `<span class="text-xs text-zinc-400">${esc(it.date)}</span>` : ''}</div>
      ${it.description ? `<p class="mt-0.5 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }
  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div><span class="text-sm font-medium text-zinc-700">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm text-zinc-600">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }
  return '';
}

// ── Classic Template ──

function buildClassicHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);

  return `<div class="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style="font-family:Inter,sans-serif">
    <div class="mb-6 border-b-2 border-zinc-800 pb-4">
      <div class="flex items-center justify-center gap-4">
        ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="h-16 w-16 shrink-0 rounded-full object-cover"/>` : ''}
        <div class="text-center">
          <h1 class="text-2xl font-bold text-zinc-900">${esc(pi.fullName || 'Your Name')}</h1>
          ${pi.jobTitle ? `<p class="mt-1 text-lg text-zinc-600">${esc(pi.jobTitle)}</p>` : ''}
        </div>
      </div>
      <div class="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-500">
        ${contacts.map(c => `<span>${esc(c)}</span>`).join('')}
      </div>
    </div>
    ${sections.map(s => `<div class="mb-5" data-section>
      <h2 class="mb-2 border-b border-zinc-300 pb-1 text-sm font-bold uppercase tracking-wider text-zinc-800">${esc(s.title)}</h2>
      ${buildClassicSectionContent(s)}
    </div>`).join('')}
  </div>`;
}

// ── Modern Template ──

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
  // Fallback to classic content for other types
  return buildClassicSectionContent(section);
}

function buildModernHtml(resume: ResumeWithSections): string {
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

// ── Creative Template ──

function buildCreativeSectionContent(section: Section): string {
  const c = section.content as any;
  const GRADIENT = 'linear-gradient(135deg,#7c3aed 0%,#f97316 100%)';
  const PRIMARY = '#7c3aed';

  if (section.type === 'summary') return `<p class="rounded-lg bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-600 italic">${esc((c as SummaryContent).text)}</p>`;
  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div class="relative rounded-lg border border-zinc-100 p-4">
      <div class="absolute left-0 top-0 h-full w-1 rounded-l-lg" style="background:${GRADIENT}"></div>
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold text-zinc-800">${esc(it.position)}</h3><span class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white" style="background:${PRIMARY}">${esc(it.startDate)} – ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.company ? `<p class="text-sm font-medium" style="color:${PRIMARY}">${esc(it.company)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1.5 space-y-0.5">${buildHighlights(it.highlights, '', 'custom-dot')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div class="rounded-lg border border-zinc-100 p-4">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold text-zinc-800">${esc(it.institution)}</h3><span class="text-xs text-zinc-400">${esc(it.startDate)} – ${esc(it.endDate)}</span></div>
      <p class="text-sm text-zinc-600">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</p>
      ${it.gpa ? `<p class="text-xs text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'skills') {
    return `<div class="space-y-3">${((c as SkillsContent).categories || []).map((cat: any) => `<div>
      <p class="mb-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500">${esc(cat.name)}</p>
      <div class="space-y-1.5">${(cat.skills || []).map((skill: string, i: number) => `<div class="flex items-center gap-3">
        <span class="w-24 shrink-0 text-sm text-zinc-700">${esc(skill)}</span>
        <div class="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100"><div class="h-full rounded-full" style="background:${GRADIENT};width:${Math.max(60, 100 - i * 8)}%"></div></div>
      </div>`).join('')}</div>
    </div>`).join('')}</div>`;
  }
  if (section.type === 'projects') {
    return `<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">${((c as ProjectsContent).items || []).map((it: any) => `<div class="rounded-lg border border-zinc-100 p-4">
      <h3 class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.name)}</h3>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<div class="mt-2 flex flex-wrap gap-1">${it.technologies.map((t: string) => `<span class="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style="background:${GRADIENT}">${esc(t)}</span>`).join('')}</div>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1.5 space-y-0.5">${buildHighlights(it.highlights, '', 'custom-dot')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'certifications') {
    return `<div class="flex flex-wrap gap-2">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div class="rounded-lg border border-zinc-100 px-4 py-2"><p class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.name)}</p><p class="text-xs text-zinc-500">${esc(it.issuer)}${it.date ? ` | ${esc(it.date)}` : ''}</p></div>`
    ).join('')}</div>`;
  }
  if (section.type === 'languages') {
    return `<div class="flex flex-wrap gap-3">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div class="flex items-center gap-2 rounded-full border border-zinc-100 px-4 py-1.5"><span class="h-2 w-2 rounded-full" style="background:${GRADIENT}"></span><span class="text-sm font-medium text-zinc-700">${esc(it.language)}</span><span class="text-xs text-zinc-400">${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }
  if (section.type === 'custom') {
    return `<div class="space-y-3">${((c as CustomContent).items || []).map((it: any) => `<div class="rounded-lg border border-zinc-100 p-4">
      <div class="flex items-baseline justify-between"><h3 class="text-sm font-bold" style="color:${PRIMARY}">${esc(it.title)}</h3>${it.date ? `<span class="text-xs text-zinc-400">${esc(it.date)}</span>` : ''}</div>
      ${it.subtitle ? `<p class="text-sm text-zinc-500">${esc(it.subtitle)}</p>` : ''}
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }
  if (c.items) {
    return `<div class="space-y-2">${c.items.map((it: any) => `<div class="rounded-lg border border-zinc-100 p-3"><span class="text-sm font-medium" style="color:${PRIMARY}">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-sm text-zinc-600">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }
  return '';
}

function buildCreativeHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);
  const GRADIENT = 'linear-gradient(135deg,#7c3aed 0%,#f97316 100%)';
  const PRIMARY = '#7c3aed';

  return `<div class="mx-auto max-w-[210mm] overflow-hidden bg-white shadow-lg" style="font-family:Inter,sans-serif">
    <div class="relative px-8 py-10 text-white" style="background:${GRADIENT}">
      <div class="absolute right-8 top-6 h-32 w-32 rounded-full border-4 border-white/10"></div>
      <div class="absolute right-20 top-16 h-16 w-16 rounded-full border-2 border-white/10"></div>
      <div class="absolute bottom-4 left-4 h-20 w-20 rounded-full bg-white/5"></div>
      <div class="relative flex items-center gap-6">
        ${pi.avatar ? `<div class="shrink-0 rounded-2xl border-4 border-white/30 p-0.5"><img src="${esc(pi.avatar)}" alt="" class="h-24 w-24 rounded-xl object-cover"/></div>` : ''}
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight">${esc(pi.fullName || 'Your Name')}</h1>
          ${pi.jobTitle ? `<p class="mt-1 text-lg font-light text-white/80">${esc(pi.jobTitle)}</p>` : ''}
          ${contacts.length ? `<div class="mt-3 flex flex-wrap gap-2 text-xs text-white/70">${contacts.map(c => `<span class="rounded-full bg-white/15 px-2.5 py-0.5 backdrop-blur-sm">${esc(c)}</span>`).join('')}</div>` : ''}
        </div>
      </div>
    </div>
    <div class="p-8">
      ${sections.map(s => `<div class="mb-6" data-section>
        <div class="mb-3 flex items-center gap-3"><div class="h-8 w-1 rounded-full" style="background:${GRADIENT}"></div><h2 class="text-base font-extrabold uppercase tracking-wide" style="color:${PRIMARY}">${esc(s.title)}</h2></div>
        ${buildCreativeSectionContent(s)}
      </div>`).join('')}
    </div>
  </div>`;
}

// ── Professional Template ──

function buildProfessionalSectionContent(section: Section): string {
  const c = section.content as any;
  const BLUE = '#1e3a5f';
  if (section.type === 'summary') return `<p class="text-sm leading-relaxed text-zinc-600" style="font-family:Georgia,serif">${esc((c as SummaryContent).text)}</p>`;
  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${BLUE}">${esc(it.position)}</span>${it.company ? `<span class="text-sm text-zinc-600"> — ${esc(it.company)}</span>` : ''}${it.location ? `<span class="text-sm text-zinc-400"> (${esc(it.location)})</span>` : ''}</div><span class="shrink-0 text-xs text-zinc-400 italic">${esc(it.startDate)} – ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-5">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold" style="color:${BLUE}">${esc(it.institution)}</span>${it.location ? `<span class="text-sm text-zinc-400"> (${esc(it.location)})</span>` : ''}</div><span class="shrink-0 text-xs text-zinc-400 italic">${esc(it.startDate)} – ${esc(it.endDate)}</span></div>
      <p class="text-sm text-zinc-600">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</p>
      ${it.gpa ? `<p class="text-xs text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-5">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'skills') {
    return `<div class="space-y-1.5">${((c as SkillsContent).categories || []).map((cat: any) =>
      `<div class="flex text-sm"><span class="w-32 shrink-0 font-semibold" style="color:${BLUE}">${esc(cat.name)}:</span><span class="text-zinc-600">${esc((cat.skills || []).join(', '))}</span></div>`
    ).join('')}</div>`;
  }
  if (section.type === 'projects') {
    return `<div class="space-y-3">${((c as ProjectsContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><span class="text-sm font-bold" style="color:${BLUE}">${esc(it.name)}</span>${it.startDate ? `<span class="shrink-0 text-xs text-zinc-400 italic">${esc(it.startDate)}${it.endDate ? ` – ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<p class="mt-0.5 text-xs text-zinc-400">Tech: ${esc(it.technologies.join(', '))}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-5">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'certifications') {
    return `<div class="space-y-1.5">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div class="flex items-baseline justify-between text-sm"><div><span class="font-semibold" style="color:${BLUE}">${esc(it.name)}</span>${it.issuer ? `<span class="text-zinc-600"> — ${esc(it.issuer)}</span>` : ''}</div>${it.date ? `<span class="shrink-0 text-xs text-zinc-400 italic">${esc(it.date)}</span>` : ''}</div>`
    ).join('')}</div>`;
  }
  if (section.type === 'languages') {
    return `<div class="flex flex-wrap gap-x-6 gap-y-1">${((c as LanguagesContent).items || []).map((it: any) =>
      `<span class="text-sm"><span class="font-semibold" style="color:${BLUE}">${esc(it.language)}</span><span class="text-zinc-500"> — ${esc(it.proficiency)}</span></span>`
    ).join('')}</div>`;
  }
  return buildClassicSectionContent(section);
}

function buildProfessionalHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);
  const BLUE = '#1e3a5f';

  return `<div class="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style="font-family:Georgia,'Times New Roman',serif">
    <div class="mb-6 text-center">
      <div class="flex items-center justify-center gap-4">
        ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="h-18 w-18 shrink-0 rounded-full border-2 object-cover" style="border-color:${BLUE}"/>` : ''}
        <div>
          <h1 class="text-3xl font-bold tracking-wide" style="color:${BLUE}">${esc(pi.fullName || 'Your Name')}</h1>
          ${pi.jobTitle ? `<p class="mt-1 text-base font-light tracking-wider text-zinc-500 uppercase">${esc(pi.jobTitle)}</p>` : ''}
        </div>
      </div>
      ${contacts.length ? `<div class="mt-3 flex flex-wrap items-center justify-center gap-x-1.5 text-sm text-zinc-500">${contacts.map((c, i) => `<span class="flex items-center gap-1.5">${esc(c)}${i < contacts.length - 1 ? '<span class="text-zinc-300">|</span>' : ''}</span>`).join('')}</div>` : ''}
      <div class="mt-4 h-[2px] w-full" style="background:linear-gradient(90deg,transparent 0%,${BLUE} 20%,${BLUE} 80%,transparent 100%)"></div>
    </div>
    ${sections.map(s => `<div class="mb-5" data-section>
      <div class="mb-3 flex items-center gap-3"><h2 class="text-sm font-bold uppercase tracking-[0.2em]" style="color:${BLUE}">${esc(s.title)}</h2><div class="h-[1px] flex-1 bg-zinc-200"></div></div>
      ${buildProfessionalSectionContent(s)}
    </div>`).join('')}
  </div>`;
}

// ── Minimal Template ──

function buildMinimalSectionContent(section: Section): string {
  const c = section.content as any;
  if (section.type === 'summary') return `<p class="text-sm text-zinc-600 leading-relaxed">${esc((c as SummaryContent).text)}</p>`;
  if (section.type === 'work_experience') {
    return `<div class="space-y-4">${((c as WorkExperienceContent).items || []).map((it: any) => `<div>
      <p class="text-sm"><span class="font-medium text-zinc-800">${esc(it.position)}</span>${it.company ? ` <span class="text-zinc-500">/ ${esc(it.company)}</span>` : ''}</p>
      <p class="text-xs text-zinc-400">${esc(it.startDate)} - ${it.current ? 'Present' : esc(it.endDate)}</p>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div>
      <p class="text-sm"><span class="font-medium text-zinc-800">${esc(it.institution)}</span></p>
      <p class="text-sm text-zinc-600">${esc(it.degree)} ${it.field ? `- ${esc(it.field)}` : ''}</p>
      <p class="text-xs text-zinc-400">${esc(it.startDate)} - ${esc(it.endDate)}</p>
    </div>`).join('')}</div>`;
  }
  if (section.type === 'skills') {
    return `<div class="space-y-1">${((c as SkillsContent).categories || []).map((cat: any) =>
      `<p class="text-sm text-zinc-600">${esc((cat.skills || []).join(' / '))}</p>`
    ).join('')}</div>`;
  }
  return buildClassicSectionContent(section);
}

function buildMinimalHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);

  return `<div class="mx-auto max-w-[210mm] bg-white p-10 shadow-lg" style="font-family:Inter,sans-serif">
    <div class="mb-8">
      <div class="flex items-center gap-3">
        ${pi.avatar ? `<img src="${esc(pi.avatar)}" alt="" class="h-12 w-12 shrink-0 rounded-full object-cover"/>` : ''}
        <div>
          <h1 class="text-xl font-medium text-zinc-900">${esc(pi.fullName || 'Your Name')}</h1>
          <div class="mt-1 flex flex-wrap gap-3 text-sm text-zinc-500">
            ${pi.jobTitle ? `<span>${esc(pi.jobTitle)}</span>` : ''}
            ${pi.email ? `<span>${esc(pi.email)}</span>` : ''}
            ${pi.phone ? `<span>${esc(pi.phone)}</span>` : ''}
            ${pi.location ? `<span>${esc(pi.location)}</span>` : ''}
          </div>
        </div>
      </div>
    </div>
    ${sections.map(s => `<div class="mb-6" data-section>
      <h2 class="mb-2 text-xs font-medium uppercase tracking-widest text-zinc-400">${esc(s.title)}</h2>
      ${buildMinimalSectionContent(s)}
    </div>`).join('')}
  </div>`;
}

// ── Two-Column Template ──

function buildTwoColumnLeftContent(section: Section): string {
  const c = section.content as any;
  if (section.type === 'skills') {
    return `<div class="space-y-2">${((c as SkillsContent).categories || []).map((cat: any) => `<div>
      <p class="text-xs font-semibold text-zinc-200">${esc(cat.name)}</p>
      <div class="mt-1 flex flex-wrap gap-1">${(cat.skills || []).map((s: string) => `<span class="rounded-sm bg-white/10 px-1.5 py-0.5 text-[10px] text-zinc-300">${esc(s)}</span>`).join('')}</div>
    </div>`).join('')}</div>`;
  }
  if (section.type === 'languages') {
    return `<div class="space-y-1.5">${((c as LanguagesContent).items || []).map((it: any) =>
      `<div class="flex items-center justify-between text-xs"><span class="text-zinc-200">${esc(it.language)}</span><span class="text-zinc-400">${esc(it.proficiency)}</span></div>`
    ).join('')}</div>`;
  }
  if (section.type === 'certifications') {
    return `<div class="space-y-1.5">${((c as CertificationsContent).items || []).map((it: any) =>
      `<div><p class="text-xs font-semibold text-zinc-200">${esc(it.name)}</p><p class="text-[10px] text-zinc-400">${esc(it.issuer)}${it.date ? ` (${esc(it.date)})` : ''}</p></div>`
    ).join('')}</div>`;
  }
  if (section.type === 'custom') {
    return `<div class="space-y-1.5">${((c as CustomContent).items || []).map((it: any) =>
      `<div><p class="text-xs font-semibold text-zinc-200">${esc(it.title)}</p>${it.subtitle ? `<p class="text-[10px] text-zinc-400">${esc(it.subtitle)}</p>` : ''}${it.description ? `<p class="text-[10px] text-zinc-400">${esc(it.description)}</p>` : ''}</div>`
    ).join('')}</div>`;
  }
  if (c.items) {
    return `<div class="space-y-1.5">${c.items.map((it: any) => `<div><span class="text-xs font-medium text-zinc-200">${esc(it.name || it.title || it.language)}</span>${it.description ? `<p class="text-[10px] text-zinc-400">${esc(it.description)}</p>` : ''}</div>`).join('')}</div>`;
  }
  return '';
}

function buildTwoColumnRightContent(section: Section): string {
  const c = section.content as any;
  if (section.type === 'summary') return `<p class="text-sm leading-relaxed text-zinc-600">${esc((c as SummaryContent).text)}</p>`;
  if (section.type === 'work_experience') {
    return `<div class="space-y-3">${((c as WorkExperienceContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-semibold text-zinc-800">${esc(it.position)}</span>${it.company ? `<span class="text-sm text-zinc-500"> | ${esc(it.company)}</span>` : ''}</div><span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)} – ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'education') {
    return `<div class="space-y-3">${((c as EducationContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><span class="text-sm font-semibold text-zinc-800">${esc(it.institution)}</span><span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)} – ${esc(it.endDate)}</span></div>
      <p class="text-sm text-zinc-600">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</p>
      ${it.gpa ? `<p class="text-xs text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'projects') {
    return `<div class="space-y-3">${((c as ProjectsContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><span class="text-sm font-semibold text-zinc-800">${esc(it.name)}</span>${it.startDate ? `<span class="shrink-0 text-xs text-zinc-400">${esc(it.startDate)}${it.endDate ? ` – ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-1 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<div class="mt-1 flex flex-wrap gap-1">${it.technologies.map((t: string) => `<span class="rounded-sm bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500">${esc(t)}</span>`).join('')}</div>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-4">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  return buildClassicSectionContent(section);
}

function buildTwoColumnHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const LEFT_TYPES = new Set(['skills', 'languages', 'certifications', 'custom']);
  const sections = visibleSections(resume);
  const leftSections = sections.filter(s => LEFT_TYPES.has(s.type));
  const rightSections = sections.filter(s => !LEFT_TYPES.has(s.type));

  return `<div class="mx-auto flex max-w-[210mm] overflow-hidden bg-white shadow-lg" style="font-family:Inter,sans-serif;min-height:297mm">
    <div class="w-[35%] shrink-0 p-6 text-white" style="background:linear-gradient(180deg,#1a1a2e 0%,#16213e 100%)">
      <div class="mb-6 text-center">
        ${pi.avatar ? `<div class="mx-auto mb-3 h-24 w-24 overflow-hidden rounded-full border-[3px] border-white/20"><img src="${esc(pi.avatar)}" alt="" class="h-full w-full object-cover"/></div>` : ''}
        <h1 class="text-xl font-bold tracking-tight text-white">${esc(pi.fullName || 'Your Name')}</h1>
        ${pi.jobTitle ? `<p class="mt-1 text-sm font-light text-zinc-300">${esc(pi.jobTitle)}</p>` : ''}
      </div>
      <div class="mb-6 space-y-1.5 text-xs">
        ${pi.email ? `<div class="flex items-start gap-2 text-zinc-300"><span class="shrink-0 text-zinc-400">Email:</span><span class="break-all">${esc(pi.email)}</span></div>` : ''}
        ${pi.phone ? `<div class="flex items-start gap-2 text-zinc-300"><span class="shrink-0 text-zinc-400">Phone:</span><span>${esc(pi.phone)}</span></div>` : ''}
        ${pi.location ? `<div class="flex items-start gap-2 text-zinc-300"><span class="shrink-0 text-zinc-400">Location:</span><span>${esc(pi.location)}</span></div>` : ''}
        ${pi.website ? `<div class="flex items-start gap-2 text-zinc-300"><span class="shrink-0 text-zinc-400">Web:</span><span class="break-all">${esc(pi.website)}</span></div>` : ''}
        ${pi.linkedin ? `<div class="flex items-start gap-2 text-zinc-300"><span class="shrink-0 text-zinc-400">LinkedIn:</span><span class="break-all">${esc(pi.linkedin)}</span></div>` : ''}
        ${pi.github ? `<div class="flex items-start gap-2 text-zinc-300"><span class="shrink-0 text-zinc-400">GitHub:</span><span class="break-all">${esc(pi.github)}</span></div>` : ''}
      </div>
      ${leftSections.map(s => `<div class="mb-5" data-section>
        <h2 class="mb-2 border-b border-white/20 pb-1 text-xs font-bold uppercase tracking-wider text-white">${esc(s.title)}</h2>
        ${buildTwoColumnLeftContent(s)}
      </div>`).join('')}
    </div>
    <div class="flex-1 p-6">
      ${rightSections.map(s => `<div class="mb-5" data-section>
        <h2 class="mb-2 border-b-2 pb-1 text-sm font-bold uppercase tracking-wider" style="color:#1a1a2e;border-color:#1a1a2e">${esc(s.title)}</h2>
        ${buildTwoColumnRightContent(s)}
      </div>`).join('')}
    </div>
  </div>`;
}

// ── ATS Template ──

function buildAtsSectionContent(section: Section): string {
  const c = section.content as any;
  if (section.type === 'summary') return `<p class="text-sm leading-relaxed text-zinc-700">${esc((c as SummaryContent).text)}</p>`;
  if (section.type === 'work_experience') {
    return `<div class="space-y-3">${((c as WorkExperienceContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold text-black">${esc(it.position)}</span>${it.company ? `<span class="text-sm text-zinc-700">, ${esc(it.company)}</span>` : ''}${it.location ? `<span class="text-sm text-zinc-500">, ${esc(it.location)}</span>` : ''}</div><span class="shrink-0 text-sm text-zinc-600">${esc(it.startDate)} - ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.description ? `<p class="mt-0.5 text-sm text-zinc-700">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-5">${buildHighlights(it.highlights, 'text-sm text-zinc-700')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'education') {
    return `<div class="space-y-2">${((c as EducationContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold text-black">${esc(it.degree)}${it.field ? ` in ${esc(it.field)}` : ''}</span>${it.institution ? `<span class="text-sm text-zinc-700">, ${esc(it.institution)}</span>` : ''}${it.location ? `<span class="text-sm text-zinc-500">, ${esc(it.location)}</span>` : ''}</div><span class="shrink-0 text-sm text-zinc-600">${esc(it.startDate)} - ${esc(it.endDate)}</span></div>
      ${it.gpa ? `<p class="text-sm text-zinc-600">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-5">${buildHighlights(it.highlights, 'text-sm text-zinc-700')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'skills') {
    return `<div class="space-y-1">${((c as SkillsContent).categories || []).map((cat: any) =>
      `<p class="text-sm text-zinc-700"><span class="font-bold text-black">${esc(cat.name)}: </span>${esc((cat.skills || []).join(', '))}</p>`
    ).join('')}</div>`;
  }
  if (section.type === 'projects') {
    return `<div class="space-y-3">${((c as ProjectsContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><span class="text-sm font-bold text-black">${esc(it.name)}</span>${it.startDate ? `<span class="shrink-0 text-sm text-zinc-600">${esc(it.startDate)}${it.endDate ? ` - ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-0.5 text-sm text-zinc-700">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<p class="text-sm text-zinc-600">Technologies: ${esc(it.technologies.join(', '))}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-1 list-disc pl-5">${buildHighlights(it.highlights, 'text-sm text-zinc-700')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'certifications') {
    return `<div class="space-y-1">${((c as CertificationsContent).items || []).map((it: any) =>
      `<p class="text-sm text-zinc-700"><span class="font-bold text-black">${esc(it.name)}</span>${it.issuer ? `<span> - ${esc(it.issuer)}</span>` : ''}${it.date ? `<span> (${esc(it.date)})</span>` : ''}</p>`
    ).join('')}</div>`;
  }
  if (section.type === 'languages') {
    return `<p class="text-sm text-zinc-700">${((c as LanguagesContent).items || []).map((it: any, i: number, arr: any[]) =>
      `${esc(it.language)} (${esc(it.proficiency)})${i < arr.length - 1 ? ', ' : ''}`
    ).join('')}</p>`;
  }
  return buildClassicSectionContent(section);
}

function buildAtsHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);

  return `<div class="mx-auto max-w-[210mm] bg-white p-8 shadow-lg" style="font-family:Arial,Helvetica,sans-serif">
    <div class="mb-4 text-center">
      <h1 class="text-2xl font-bold text-black">${esc(pi.fullName || 'Your Name')}</h1>
      ${pi.jobTitle ? `<p class="mt-0.5 text-base text-zinc-700">${esc(pi.jobTitle)}</p>` : ''}
      ${contacts.length ? `<p class="mt-1 text-sm text-zinc-600">${contacts.map(c => esc(c)).join(' | ')}</p>` : ''}
    </div>
    <hr class="mb-4 border-black"/>
    ${sections.map(s => `<div class="mb-4" data-section>
      <h2 class="mb-1.5 border-b border-black pb-0.5 text-base font-bold uppercase text-black">${esc(s.title)}</h2>
      ${buildAtsSectionContent(s)}
    </div>`).join('')}
  </div>`;
}

// ── Academic Template ──

function buildAcademicSectionContent(section: Section): string {
  const c = section.content as any;
  if (section.type === 'summary') return `<p class="text-sm leading-relaxed text-zinc-600 indent-8">${esc((c as SummaryContent).text)}</p>`;
  if (section.type === 'work_experience') {
    return `<div class="space-y-2.5">${((c as WorkExperienceContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold text-zinc-800">${esc(it.position)}</span>${it.company ? `<span class="text-sm text-zinc-600">, ${esc(it.company)}</span>` : ''}${it.location ? `<span class="text-sm text-zinc-400">, ${esc(it.location)}</span>` : ''}</div><span class="shrink-0 text-xs text-zinc-500">${esc(it.startDate)} – ${it.current ? 'Present' : esc(it.endDate)}</span></div>
      ${it.description ? `<p class="mt-0.5 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-0.5 list-disc pl-5">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'education') {
    return `<div class="space-y-2.5">${((c as EducationContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold text-zinc-800">${esc(it.degree)}</span>${it.field ? `<span class="text-sm text-zinc-600"> in ${esc(it.field)}</span>` : ''}</div><span class="shrink-0 text-xs text-zinc-500">${esc(it.startDate)} – ${esc(it.endDate)}</span></div>
      <p class="text-sm text-zinc-600">${esc(it.institution)}${it.location ? `, ${esc(it.location)}` : ''}</p>
      ${it.gpa ? `<p class="text-xs text-zinc-500">GPA: ${esc(it.gpa)}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-0.5 list-disc pl-5">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'skills') {
    return `<div class="space-y-0.5">${((c as SkillsContent).categories || []).map((cat: any) =>
      `<p class="text-sm text-zinc-600"><span class="font-bold text-zinc-700">${esc(cat.name)}: </span>${esc((cat.skills || []).join(', '))}</p>`
    ).join('')}</div>`;
  }
  if (section.type === 'projects') {
    return `<div class="space-y-2.5">${((c as ProjectsContent).items || []).map((it: any) => `<div>
      <div class="flex items-baseline justify-between"><div><span class="text-sm font-bold text-zinc-800">${esc(it.name)}</span>${it.url ? `<span class="text-xs text-zinc-400 ml-1">[${esc(it.url)}]</span>` : ''}</div>${it.startDate ? `<span class="shrink-0 text-xs text-zinc-500">${esc(it.startDate)}${it.endDate ? ` – ${esc(it.endDate)}` : ''}</span>` : ''}</div>
      ${it.description ? `<p class="mt-0.5 text-sm text-zinc-600">${esc(it.description)}</p>` : ''}
      ${it.technologies?.length ? `<p class="text-xs text-zinc-500 italic">Technologies: ${esc(it.technologies.join(', '))}</p>` : ''}
      ${it.highlights?.length ? `<ul class="mt-0.5 list-disc pl-5">${buildHighlights(it.highlights, 'text-sm text-zinc-600')}</ul>` : ''}
    </div>`).join('')}</div>`;
  }
  if (section.type === 'certifications') {
    return `<div class="space-y-1">${((c as CertificationsContent).items || []).map((it: any) =>
      `<p class="text-sm text-zinc-600"><span class="font-bold text-zinc-700">${esc(it.name)}</span>${it.issuer ? `<span>, ${esc(it.issuer)}</span>` : ''}${it.date ? `<span class="text-zinc-500"> (${esc(it.date)})</span>` : ''}</p>`
    ).join('')}</div>`;
  }
  if (section.type === 'languages') {
    return `<p class="text-sm text-zinc-600">${((c as LanguagesContent).items || []).map((it: any, i: number, arr: any[]) =>
      `<span class="font-bold text-zinc-700">${esc(it.language)}</span> (${esc(it.proficiency)})${i < arr.length - 1 ? '; ' : ''}`
    ).join('')}</p>`;
  }
  return buildClassicSectionContent(section);
}

function buildAcademicHtml(resume: ResumeWithSections): string {
  const pi = getPersonalInfo(resume);
  const sections = visibleSections(resume);
  const contacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);

  return `<div class="mx-auto max-w-[210mm] bg-white px-10 py-8 shadow-lg" style="font-family:'Computer Modern','CMU Serif',Georgia,'Times New Roman',serif">
    <div class="mb-6 text-center">
      <h1 class="text-2xl font-bold text-zinc-900" style="letter-spacing:0.02em">${esc(pi.fullName || 'Your Name')}</h1>
      ${pi.jobTitle ? `<p class="mt-0.5 text-base text-zinc-500 italic">${esc(pi.jobTitle)}</p>` : ''}
      ${contacts.length ? `<p class="mt-1.5 text-xs text-zinc-500">${contacts.map((c, i) => `${esc(c)}${i < contacts.length - 1 ? ' \u00B7 ' : ''}`).join('')}</p>` : ''}
      <div class="mt-3 border-b-2 border-zinc-800"></div>
    </div>
    ${sections.map(s => `<div class="mb-4" data-section>
      <h2 class="mb-1.5 text-xs font-bold uppercase tracking-[0.25em] text-zinc-800" style="border-bottom:1px solid #d4d4d8;padding-bottom:2px">${esc(s.title)}</h2>
      ${buildAcademicSectionContent(s)}
    </div>`).join('')}
  </div>`;
}

// ── Main HTML generator ──

const TEMPLATE_BUILDERS: Record<string, (r: ResumeWithSections) => string> = {
  classic: buildClassicHtml,
  modern: buildModernHtml,
  minimal: buildMinimalHtml,
  professional: buildProfessionalHtml,
  'two-column': buildTwoColumnHtml,
  creative: buildCreativeHtml,
  ats: buildAtsHtml,
  academic: buildAcademicHtml,
};

function generateHtml(resume: ResumeWithSections): string {
  const builder = TEMPLATE_BUILDERS[resume.template] || buildClassicHtml;
  const bodyHtml = builder(resume);
  const theme = { ...DEFAULT_THEME, ...((resume as any).themeConfig || {}) };
  const themeCSS = buildExportThemeCSS(theme);

  return `<!DOCTYPE html>
<html lang="${esc(resume.language || 'en')}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(resume.title)}</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; display: flex; justify-content: center; padding: 40px 20px; background: #f4f4f5; min-height: 100vh; }
    @media print { body { padding: 0; background: white; } .resume-export > div { box-shadow: none !important; max-width: none !important; } }
    ${themeCSS}
  </style>
</head>
<body>
  <div class="resume-export">
    ${bodyHtml}
  </div>
</body>
</html>`;
}

// ─── DOCX (Word-compatible HTML) ──────────────────────────────

function renderSectionHtml(section: Section): string {
  if (!section.visible) return '';

  switch (section.type) {
    case 'personal_info': {
      const info = section.content as PersonalInfoContent;
      let html = '<div class="personal-info">';
      if (info.fullName) html += `<h1>${esc(info.fullName)}</h1>`;
      if (info.jobTitle) html += `<p class="job-title">${esc(info.jobTitle)}</p>`;
      const contactParts: string[] = [];
      if (info.email) contactParts.push(esc(info.email));
      if (info.phone) contactParts.push(esc(info.phone));
      if (info.location) contactParts.push(esc(info.location));
      if (contactParts.length) html += `<p class="contact">${contactParts.join(' &bull; ')}</p>`;
      if (info.website) html += `<p class="links"><a href="${esc(info.website)}">${esc(info.website)}</a></p>`;
      html += '</div>';
      return html;
    }
    case 'summary': {
      const summary = section.content as SummaryContent;
      let html = `<div class="section"><h2>${esc(section.title)}</h2>`;
      if (summary.text) html += `<p>${esc(summary.text)}</p>`;
      html += '</div>';
      return html;
    }
    case 'work_experience': {
      const work = section.content as WorkExperienceContent;
      let html = `<div class="section"><h2>${esc(section.title)}</h2>`;
      for (const item of work.items || []) {
        html += '<div class="item">';
        html += `<div class="item-header"><strong>${esc(item.position)}</strong> at ${esc(item.company)}`;
        const dateRange = item.current ? `${safe(item.startDate)} - Present` : `${safe(item.startDate)} - ${safe(item.endDate)}`;
        html += `<span class="date">${esc(dateRange)}</span></div>`;
        if (item.location) html += `<div class="location">${esc(item.location)}</div>`;
        if (item.description) html += `<p>${esc(item.description)}</p>`;
        if (item.highlights?.length) {
          html += '<ul>';
          for (const h of item.highlights) if (h) html += `<li>${esc(h)}</li>`;
          html += '</ul>';
        }
        html += '</div>';
      }
      html += '</div>';
      return html;
    }
    case 'education': {
      const edu = section.content as EducationContent;
      let html = `<div class="section"><h2>${esc(section.title)}</h2>`;
      for (const item of edu.items || []) {
        html += '<div class="item">';
        html += `<div class="item-header"><strong>${esc(item.degree)}</strong> in ${esc(item.field)}, ${esc(item.institution)}`;
        html += `<span class="date">${esc(item.startDate)} - ${esc(item.endDate)}</span></div>`;
        if (item.location) html += `<div class="location">${esc(item.location)}</div>`;
        if (item.gpa) html += `<p>GPA: ${esc(item.gpa)}</p>`;
        if (item.highlights?.length) {
          html += '<ul>';
          for (const h of item.highlights) if (h) html += `<li>${esc(h)}</li>`;
          html += '</ul>';
        }
        html += '</div>';
      }
      html += '</div>';
      return html;
    }
    case 'skills': {
      const skills = section.content as SkillsContent;
      let html = `<div class="section"><h2>${esc(section.title)}</h2>`;
      for (const cat of skills.categories || []) {
        html += `<p><strong>${esc(cat.name)}:</strong> ${esc((cat.skills || []).join(', '))}</p>`;
      }
      html += '</div>';
      return html;
    }
    case 'projects': {
      const projects = section.content as ProjectsContent;
      let html = `<div class="section"><h2>${esc(section.title)}</h2>`;
      for (const item of projects.items || []) {
        html += '<div class="item">';
        html += `<div class="item-header"><strong>${esc(item.name)}</strong>`;
        if (item.url) html += ` <a href="${esc(item.url)}">${esc(item.url)}</a>`;
        if (item.startDate) {
          html += `<span class="date">${esc(item.startDate)}${item.endDate ? ` - ${esc(item.endDate)}` : ''}</span>`;
        }
        html += '</div>';
        if (item.description) html += `<p>${esc(item.description)}</p>`;
        if (item.technologies?.length) html += `<p class="tech">Technologies: ${esc(item.technologies.join(', '))}</p>`;
        if (item.highlights?.length) {
          html += '<ul>';
          for (const h of item.highlights) if (h) html += `<li>${esc(h)}</li>`;
          html += '</ul>';
        }
        html += '</div>';
      }
      html += '</div>';
      return html;
    }
    case 'certifications': {
      const certs = section.content as CertificationsContent;
      let html = `<div class="section"><h2>${esc(section.title)}</h2>`;
      for (const item of certs.items || []) {
        html += `<p><strong>${esc(item.name)}</strong> - ${esc(item.issuer)} (${esc(item.date)})</p>`;
      }
      html += '</div>';
      return html;
    }
    case 'languages': {
      const langs = section.content as LanguagesContent;
      let html = `<div class="section"><h2>${esc(section.title)}</h2>`;
      for (const item of langs.items || []) {
        html += `<p>${esc(item.language)}: ${esc(item.proficiency)}</p>`;
      }
      html += '</div>';
      return html;
    }
    default: {
      const custom = section.content as CustomContent;
      let html = `<div class="section"><h2>${esc(section.title)}</h2>`;
      for (const item of (custom as any).items || []) {
        html += '<div class="item">';
        html += `<div class="item-header"><strong>${esc(item.title)}</strong>`;
        if (item.subtitle) html += ` - ${esc(item.subtitle)}`;
        if (item.date) html += `<span class="date">${esc(item.date)}</span>`;
        html += '</div>';
        if (item.description) html += `<p>${esc(item.description)}</p>`;
        html += '</div>';
      }
      html += '</div>';
      return html;
    }
  }
}

function generateDocx(resume: ResumeWithSections): string {
  const sectionsHtml = resume.sections.map(renderSectionHtml).join('\n');

  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="UTF-8">
  <meta name="ProgId" content="Word.Document">
  <meta name="Generator" content="JadeAI">
  <!--[if gte mso 9]>
  <xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml>
  <![endif]-->
  <style>
    body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; color: #333; line-height: 1.6; }
    .personal-info { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #2563eb; padding-bottom: 12px; }
    .personal-info h1 { font-size: 24pt; color: #1a1a1a; margin-bottom: 2px; }
    .job-title { font-size: 12pt; color: #555; margin-bottom: 6px; }
    .contact { font-size: 10pt; color: #666; }
    .links { font-size: 10pt; margin-top: 4px; }
    .links a { color: #2563eb; }
    .section { margin-bottom: 16px; }
    .section h2 { font-size: 14pt; color: #1a1a1a; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-bottom: 10px; }
    .item { margin-bottom: 10px; }
    .item-header { margin-bottom: 2px; }
    .date { color: #666; font-size: 10pt; }
    .location { color: #888; font-size: 10pt; }
    ul { margin-left: 18px; margin-top: 4px; }
    li { margin-bottom: 2px; font-size: 10pt; }
    p { font-size: 10pt; margin-top: 4px; }
  </style>
</head>
<body>
${sectionsHtml}
</body>
</html>`;
}

// ─── Route Handler ───────────────────────────────────────────

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const fingerprint = getUserIdFromRequest(request);
    const user = await resolveUser(fingerprint);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resume = await resumeRepository.findById(id);
    if (!resume) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (resume.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const format = request.nextUrl.searchParams.get('format') || 'json';
    const title = resume.title || 'resume';

    switch (format) {
      case 'json': {
        return NextResponse.json(resume);
      }
      case 'html': {
        const html = generateHtml(resume);
        return new NextResponse(html, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Disposition': `attachment; filename="${encodeURIComponent(title)}.html"`,
          },
        });
      }
      case 'txt': {
        const text = generatePlainText(resume);
        return new NextResponse(text, {
          status: 200,
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Content-Disposition': `attachment; filename="${encodeURIComponent(title)}.txt"`,
          },
        });
      }
      case 'docx': {
        const doc = generateDocx(resume);
        return new NextResponse(doc, {
          status: 200,
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': `attachment; filename="${encodeURIComponent(title)}.doc"`,
          },
        });
      }
      default: {
        return NextResponse.json(
          { error: `Unsupported format: ${format}. Supported: json, html, txt, docx` },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error('GET /api/resume/[id]/export error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
