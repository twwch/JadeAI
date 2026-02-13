import { tool, generateText, Output } from 'ai';
import { z } from 'zod/v4';
import { resumeRepository } from '@/lib/db/repositories/resume.repository';
import { getModel } from '@/lib/ai/provider';
import { jdAnalysisOutputSchema } from '@/lib/ai/jd-analysis-schema';
import { translateOutputSchema } from '@/lib/ai/translate-schema';

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

    analyzeJdMatch: tool({
      description: 'Analyze how well the current resume matches a job description. Use this when the user pastes a JD or asks about job fit.',
      inputSchema: z.object({
        jobDescription: z.string().describe('The job description text to analyze against the resume'),
      }),
      execute: async ({ jobDescription }) => {
        const resume = await resumeRepository.findById(resumeId);
        if (!resume) return { success: false, error: 'Resume not found' };

        const model = getModel();
        const resumeContext = JSON.stringify(resume.sections);

        const result = await generateText({
          model,
          maxOutputTokens: 8192,
          output: Output.object({ schema: jdAnalysisOutputSchema }),
          system: `You are an expert resume analyst. Analyze the match between the resume and job description. Be specific and actionable.`,
          prompt: `## Resume Data\n${resumeContext}\n\n## Job Description\n${jobDescription}\n\nAnalyze the match and provide a comprehensive analysis.`,
        });

        return { success: true, analysis: result.output };
      },
    }),

    translateResume: tool({
      description: 'Translate the resume to a different language. Use this when the user asks to translate their resume to Chinese or English.',
      inputSchema: z.object({
        targetLanguage: z.enum(['zh', 'en']).describe('Target language: "zh" for Chinese, "en" for English'),
      }),
      execute: async ({ targetLanguage }) => {
        const resume = await resumeRepository.findById(resumeId);
        if (!resume) return { success: false, error: 'Resume not found' };

        const sectionsData = resume.sections.map((s: any) => ({
          sectionId: s.id,
          type: s.type,
          title: s.title,
          content: s.content,
        }));

        const model = getModel();

        const translatePrompt = targetLanguage === 'zh'
          ? `You are a professional resume translator. Translate from English to Simplified Chinese. Keep technical terms in English. Preserve JSON structure and field names. Only translate values. Keep IDs, URLs, emails, phone numbers unchanged.`
          : `You are a professional resume translator. Translate from Chinese to English. Use strong action verbs. Preserve JSON structure and field names. Only translate values. Keep IDs, URLs, emails, phone numbers unchanged.`;

        const result = await generateText({
          model,
          maxOutputTokens: 16384,
          output: Output.object({ schema: translateOutputSchema }),
          system: translatePrompt,
          prompt: `Translate the following resume sections:\n${JSON.stringify(sectionsData, null, 2)}`,
        });

        const translatedOutput = result.output!;

        // Update each section in the database
        for (const translatedSection of translatedOutput.sections) {
          const originalSection = resume.sections.find((s: any) => s.id === translatedSection.sectionId);
          if (!originalSection) continue;

          await resumeRepository.updateSection(translatedSection.sectionId, {
            title: translatedSection.title,
            content: translatedSection.content,
          });
        }

        // Update resume language
        await resumeRepository.update(resumeId, { language: targetLanguage });

        return {
          success: true,
          language: targetLanguage,
          translatedSections: translatedOutput.sections.length,
        };
      },
    }),
  };
}
