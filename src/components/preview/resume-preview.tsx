'use client';

import { useId } from 'react';
import type { Resume, ThemeConfig } from '@/types/resume';
import { ClassicTemplate } from './templates/classic';
import { ModernTemplate } from './templates/modern';
import { MinimalTemplate } from './templates/minimal';
import { ProfessionalTemplate } from './templates/professional';
import { TwoColumnTemplate } from './templates/two-column';
import { CreativeTemplate } from './templates/creative';
import { AtsTemplate } from './templates/ats';
import { AcademicTemplate } from './templates/academic';

interface ResumePreviewProps {
  resume: Resume;
}

const templateMap: Record<string, React.ComponentType<{ resume: Resume }>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  professional: ProfessionalTemplate,
  'two-column': TwoColumnTemplate,
  creative: CreativeTemplate,
  ats: AtsTemplate,
  academic: AcademicTemplate,
};

const FONT_SIZE_MAP: Record<string, string> = {
  small: '13px',
  medium: '14px',
  large: '15px',
};

const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#1a1a1a',
  accentColor: '#3b82f6',
  fontFamily: 'Inter',
  fontSize: 'medium',
  lineSpacing: 1.5,
  margin: { top: 20, right: 20, bottom: 20, left: 20 },
  sectionSpacing: 16,
};

function buildThemeCSS(scopeId: string, theme: ThemeConfig): string {
  const s = `[data-theme-scope="${scopeId}"]`;
  const fontSize = FONT_SIZE_MAP[theme.fontSize] || '14px';
  const m = theme.margin;

  return `
    ${s} > div {
      font-family: ${theme.fontFamily}, sans-serif !important;
      font-size: ${fontSize} !important;
      line-height: ${theme.lineSpacing} !important;
      padding: ${m.top}px ${m.right}px ${m.bottom}px ${m.left}px !important;
    }
    ${s} h1 { color: ${theme.primaryColor} !important; }
    ${s} h2 {
      color: ${theme.primaryColor} !important;
      border-color: ${theme.accentColor} !important;
    }
    ${s} h3 { color: ${theme.primaryColor} !important; }
    ${s} [class*="border-b-2"],
    ${s} [class*="border-b-"] {
      border-color: ${theme.accentColor} !important;
    }
    ${s} [class*="bg-blue-"], ${s} [class*="bg-indigo-"],
    ${s} [class*="bg-slate-800"], ${s} [class*="bg-zinc-800"],
    ${s} [class*="bg-teal-"], ${s} [class*="bg-emerald-"] {
      background-color: ${theme.accentColor} !important;
    }
    ${s} [data-section] {
      margin-bottom: ${theme.sectionSpacing}px !important;
    }
  `;
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  const Template = templateMap[resume.template] || ClassicTemplate;
  const scopeId = useId();
  const theme: ThemeConfig = { ...DEFAULT_THEME, ...(resume.themeConfig || {}) };

  return (
    <div data-theme-scope={scopeId}>
      <style dangerouslySetInnerHTML={{ __html: buildThemeCSS(scopeId, theme) }} />
      <Template resume={resume} />
    </div>
  );
}
