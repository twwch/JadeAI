import { tool } from 'ai';
import { z } from 'zod/v4';
import { resumeRepository } from '@/lib/db/repositories/resume.repository';

export function createExecutableTools(resumeId: string) {
  return {
    updateSection: tool({
      description: 'Update the content of a specific resume section. Use this when the user wants to modify any part of their resume.',
      inputSchema: z.object({
        sectionId: z.string().describe('The ID of the section to update'),
        field: z.string().describe('The field within the section to update (e.g., "fullName", "text", "items")'),
        value: z.string().describe('The new value for the field. For complex values (arrays, objects), pass a JSON string.'),
      }),
      execute: async ({ sectionId, field, value }) => {
        const resume = await resumeRepository.findById(resumeId);
        if (!resume) return { success: false, error: 'Resume not found' };

        const section = resume.sections.find((s: any) => s.id === sectionId);
        if (!section) return { success: false, error: 'Section not found' };

        let parsedValue: unknown = value;
        try {
          parsedValue = JSON.parse(value);
        } catch {
          // Use as string if not valid JSON
        }

        const updatedContent = { ...(section.content as Record<string, unknown>), [field]: parsedValue };
        await resumeRepository.updateSection(sectionId, { content: updatedContent });

        return { success: true, sectionType: section.type, field, updatedContent };
      },
    }),

    addSection: tool({
      description: 'Add a new section to the resume. Use this when the user wants to add a new section type.',
      inputSchema: z.object({
        type: z.string().describe('The type of section to add (e.g., "work_experience", "education", "skills", "projects", "certifications", "languages", "custom")'),
        title: z.string().describe('The display title for the section'),
        content: z.string().optional().describe('Initial content as a JSON string. Defaults to empty structure.'),
      }),
      execute: async ({ type, title, content }) => {
        const resume = await resumeRepository.findById(resumeId);
        if (!resume) return { success: false, error: 'Resume not found' };

        const maxOrder = resume.sections.reduce((max: number, s: any) => Math.max(max, s.sortOrder), -1);

        let parsedContent: unknown = {};
        if (content) {
          try { parsedContent = JSON.parse(content); } catch { /* use default */ }
        } else {
          // Default content based on type
          if (type === 'skills') parsedContent = { categories: [] };
          else if (type === 'summary') parsedContent = { text: '' };
          else if (type === 'personal_info') parsedContent = { fullName: '', jobTitle: '', email: '', phone: '', location: '' };
          else parsedContent = { items: [] };
        }

        const section = await resumeRepository.createSection({
          resumeId,
          type,
          title,
          sortOrder: maxOrder + 1,
          content: parsedContent,
        });

        return { success: true, sectionType: type, sectionId: section?.id };
      },
    }),

    rewriteText: tool({
      description: 'Rewrite a text field to improve its impact, clarity, and professionalism. Use this when the user asks to improve or rewrite text.',
      inputSchema: z.object({
        sectionId: z.string().describe('The section containing the text'),
        field: z.string().describe('The field to rewrite (e.g., "text", "description")'),
        improvedText: z.string().describe('The improved text to replace the original'),
      }),
      execute: async ({ sectionId, field, improvedText }) => {
        const resume = await resumeRepository.findById(resumeId);
        if (!resume) return { success: false, error: 'Resume not found' };

        const section = resume.sections.find((s: any) => s.id === sectionId);
        if (!section) return { success: false, error: 'Section not found' };

        const updatedContent = { ...(section.content as Record<string, unknown>), [field]: improvedText };
        await resumeRepository.updateSection(sectionId, { content: updatedContent });

        return { success: true, sectionType: section.type, field, improvedText };
      },
    }),

    suggestSkills: tool({
      description: 'Suggest relevant skills based on work experience and add them to the skills section.',
      inputSchema: z.object({
        skills: z.array(z.string()).describe('List of suggested skills'),
        category: z.string().describe('The skill category name'),
      }),
      execute: async ({ skills, category }) => {
        const resume = await resumeRepository.findById(resumeId);
        if (!resume) return { success: false, error: 'Resume not found' };

        const skillsSection = resume.sections.find((s: any) => s.type === 'skills');
        if (!skillsSection) return { success: false, error: 'Skills section not found' };

        const content = skillsSection.content as { categories?: { id: string; name: string; skills: string[] }[] };
        const categories = content.categories || [];

        const existing = categories.find((c) => c.name === category);
        if (existing) {
          const merged = [...new Set([...existing.skills, ...skills])];
          existing.skills = merged;
        } else {
          categories.push({ id: crypto.randomUUID(), name: category, skills });
        }

        await resumeRepository.updateSection(skillsSection.id, { content: { categories } });

        return { success: true, category, skills, sectionId: skillsSection.id };
      },
    }),
  };
}
