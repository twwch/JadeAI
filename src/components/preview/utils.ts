import type { ResumeSection, SummaryContent, SkillsContent } from '@/types/resume';

export function isSectionEmpty(section: ResumeSection): boolean {
  const content = section.content as any;

  if (section.type === 'summary') {
    return !(content as SummaryContent).text;
  }

  if (section.type === 'skills') {
    const categories = (content as SkillsContent).categories;
    return !categories?.length || categories.every((cat) => !cat.skills?.length);
  }

  // work_experience, education, projects, certifications, languages, custom
  if ('items' in content) {
    return !content.items?.length;
  }

  return false;
}
