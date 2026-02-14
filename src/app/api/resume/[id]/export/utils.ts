import { resumeRepository } from '@/lib/db/repositories/resume.repository';
import { BACKGROUND_TEMPLATES } from '@/lib/constants';
import type {
  PersonalInfoContent,
  SkillsContent,
  SummaryContent,
} from '@/types/resume';

export type ResumeWithSections = NonNullable<Awaited<ReturnType<typeof resumeRepository.findById>>>;
export type Section = ResumeWithSections['sections'][number];

// ─── Helpers ──────────────────────────────────────────────────

export function esc(text: unknown): string {
  if (text == null) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function safe(val: unknown): string {
  return val != null ? String(val) : '';
}

// ─── Section empty check ──────────────────────────────────────

export function isSectionEmpty(section: Section): boolean {
  const content = section.content as any;
  if (section.type === 'summary') return !(content as SummaryContent).text;
  if (section.type === 'skills') {
    const categories = (content as SkillsContent).categories;
    return !categories?.length || categories.every((cat: any) => !cat.skills?.length);
  }
  if ('items' in content) return !content.items?.length;
  return false;
}

// ─── HTML helpers ─────────────────────────────────────────────

export function visibleSections(resume: ResumeWithSections): Section[] {
  return resume.sections.filter((s: Section) => s.visible && s.type !== 'personal_info' && !isSectionEmpty(s));
}

export function getPersonalInfo(resume: ResumeWithSections): PersonalInfoContent {
  const sec = resume.sections.find((s: Section) => s.type === 'personal_info');
  return (sec?.content || {}) as PersonalInfoContent;
}

export function buildHighlights(highlights: string[] | undefined, liClass: string, bulletStyle?: string): string {
  if (!highlights?.length) return '';
  if (bulletStyle === 'custom-dot') {
    return highlights.map(h =>
      `<li class="flex items-start gap-2 text-sm text-zinc-600"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style="background:linear-gradient(135deg,#7c3aed,#f97316)"></span>${esc(h)}</li>`
    ).join('');
  }
  return highlights.filter(Boolean).map(h => `<li class="${liClass}">${esc(h)}</li>`).join('');
}

// ─── Theme CSS for HTML export ────────────────────────────────

const FONT_SIZE_SCALE: Record<string, { body: string; h1: string; h2: string; h3: string }> = {
  small:  { body: '12px', h1: '22px', h2: '15px', h3: '13px' },
  medium: { body: '14px', h1: '26px', h2: '17px', h3: '15px' },
  large:  { body: '16px', h1: '30px', h2: '19px', h3: '17px' },
};

export const DEFAULT_THEME = {
  primaryColor: '#1a1a1a',
  accentColor: '#3b82f6',
  fontFamily: 'Inter',
  fontSize: 'medium',
  lineSpacing: 1.5,
  margin: { top: 20, right: 20, bottom: 20, left: 20 },
  sectionSpacing: 16,
};

function isDark(hex: string): boolean {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b < 0.4;
}

export function buildExportThemeCSS(theme: typeof DEFAULT_THEME, template: string): string {
  const fs = FONT_SIZE_SCALE[theme.fontSize] || FONT_SIZE_SCALE.medium;
  const m = theme.margin;
  const sel = '.resume-export';
  const needsPadding = !BACKGROUND_TEMPLATES.has(template);
  const primaryIsDark = isDark(theme.primaryColor);
  return `
    ${sel} > div {
      font-family: ${theme.fontFamily}, sans-serif !important;
      line-height: ${theme.lineSpacing} !important;
      ${needsPadding ? `padding: ${m.top}px ${m.right}px ${m.bottom}px ${m.left}px !important;` : ''}
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
    ${primaryIsDark ? `
    ${sel} [style*="background"][style*="#"] h1,
    ${sel} [style*="background"][style*="#"] h2,
    ${sel} [style*="background"][style*="#"] h3,
    ${sel} [style*="background"][style*="linear-gradient"] h1,
    ${sel} [style*="background"][style*="linear-gradient"] h2,
    ${sel} [style*="background"][style*="linear-gradient"] h3,
    ${sel} .bg-black h1, ${sel} .bg-black h2, ${sel} .bg-black h3 {
      color: #ffffff !important;
    }` : ''}
  `;
}
