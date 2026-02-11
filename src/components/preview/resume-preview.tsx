'use client';

import type { Resume } from '@/types/resume';
import { ClassicTemplate } from './templates/classic';
import { ModernTemplate } from './templates/modern';
import { MinimalTemplate } from './templates/minimal';

interface ResumePreviewProps {
  resume: Resume;
}

const templates: Record<string, React.ComponentType<{ resume: Resume }>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
};

export function ResumePreview({ resume }: ResumePreviewProps) {
  const Template = templates[resume.template] || ClassicTemplate;
  return <Template resume={resume} />;
}
