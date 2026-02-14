import { tool, generateText } from 'ai';
import { z } from 'zod/v4';
import { resumeRepository } from '@/lib/db/repositories/resume.repository';
import { getModel, type AIConfig } from '@/lib/ai/provider';
import { jdAnalysisOutputSchema } from '@/lib/ai/jd-analysis-schema';
import { extractJson } from '@/lib/ai/extract-json';

export function createExecutableTools(resumeId: string, aiConfig: AIConfig) {
  return {
    updateSection: tool({
      description: `Update the content of a specific resume section. Section content structures:
- personal_info: { fullName, jobTitle, email, phone, location, website, linkedin, github }
- summary: { text: string }
- work_experience: { items: [{ id, company, position, location, startDate, endDate, current, description, highlights }] }
- education: { items: [{ id, institution, degree, field, location, startDate, endDate, gpa, highlights }] }
- skills: { categories: [{ id, name, skills: string[] }] }
- projects: { items: [{ id, name, url, description, technologies, highlights }] }
- certifications: { items: [{ id, name, issuer, date, url }] }
- languages: { items: [{ id, language, proficiency }] }
- custom: { items: [{ id, title, subtitle, date, description }] }
Use field="items" or field="categories" to update list sections. Each item MUST include a unique "id" (use a UUID).`,
      inputSchema: z.object({
        sectionId: z.string().describe('The ID of the section to update'),
        field: z.string().describe('The field within the section to update (e.g., "fullName", "text", "items", "categories")'),
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

        // Fix field name for item-based sections when AI uses wrong field
        const itemSections = ['work_experience', 'education', 'projects', 'certifications', 'languages', 'custom'];
        let actualField = field;
        if (itemSections.includes(section.type) && field !== 'items') {
          // AI sent wrong field (e.g. "text") for an items-based section — convert to items
          if (typeof parsedValue === 'string') {
            // Convert plain text to a single custom item
            parsedValue = [{ id: crypto.randomUUID(), title: '', description: parsedValue }];
          } else if (!Array.isArray(parsedValue)) {
            // If it's an object with items inside, extract them
            if (Array.isArray((parsedValue as any)?.items)) {
              parsedValue = (parsedValue as any).items;
            }
          }
          actualField = section.type === 'skills' ? 'categories' : 'items';
        }
        if (section.type === 'skills' && field !== 'categories') {
          actualField = 'categories';
        }

        // Ensure items/categories always have id fields
        if (Array.isArray(parsedValue)) {
          parsedValue = (parsedValue as any[]).map((item) =>
            typeof item === 'object' && item !== null && !item.id
              ? { ...item, id: crypto.randomUUID() }
              : item
          );
        }

        const updatedContent = { ...(section.content as Record<string, unknown>), [actualField]: parsedValue };
        await resumeRepository.updateSection(sectionId, { content: updatedContent });

        return { success: true, sectionType: section.type, field: actualField, updatedContent };
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

        const model = getModel(aiConfig);
        const resumeContext = JSON.stringify(resume.sections);

        const result = await generateText({
          model,
          maxOutputTokens: 8192,
          system: `You are an expert resume analyst. Analyze the match between the resume and job description. Be specific and actionable.
CRITICAL: You are a JSON API. Your entire response must be a single valid JSON object starting with { and ending with }. Do NOT use markdown syntax. Do NOT wrap in code fences.`,
          prompt: `## Resume Data\n${resumeContext}\n\n## Job Description\n${jobDescription}\n\nReturn a JSON object with: overallScore (0-100), keywordMatches (string[]), missingKeywords (string[]), suggestions ([{section, current, suggested}]), atsScore (0-100), summary (string).`,
          providerOptions: { openai: { response_format: { type: 'json_object' } } },
        });

        const analysis = extractJson(result.text, jdAnalysisOutputSchema);
        return { success: true, analysis };
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

        const model = getModel(aiConfig);
        const langName = targetLanguage === 'zh' ? 'Simplified Chinese' : 'English';

        const singleSectionSchema = z.object({
          sectionId: z.string(),
          title: z.string(),
          content: z.any(),
        });

        // Translate each section concurrently (max 4 at a time)
        const sections = resume.sections.map((s: any) => ({
          sectionId: s.id,
          type: s.type,
          title: s.title,
          content: s.content,
        }));

        const CONCURRENCY = 4;
        let succeeded = 0;
        let failed = 0;

        const translateOne = async (section: typeof sections[number]) => {
          const result = await generateText({
            model,
            maxOutputTokens: 4096,
            system: `You are a professional resume translator. Translate the given resume section into ${langName}.
Rules:
- Use professional, formal ${langName} appropriate for resumes
- Technical terms and programming languages stay in English
- Preserve the exact JSON structure and all field names — only translate string values
- Keep all IDs, URLs, emails, phone numbers unchanged
- CRITICAL: Return a single valid JSON object with keys: sectionId, title, content. No markdown, no code fences.`,
            prompt: `Translate this resume section. Return JSON with keys: sectionId, title, content.\n\n${JSON.stringify(section)}`,
            providerOptions: { openai: { response_format: { type: 'json_object' } } },
          });

          return extractJson(result.text, singleSectionSchema);
        };

        // Run with concurrency limit
        const results: ({ ok: true; data: z.infer<typeof singleSectionSchema> } | { ok: false; error: unknown })[] = new Array(sections.length);
        let nextIdx = 0;

        async function worker() {
          while (nextIdx < sections.length) {
            const i = nextIdx++;
            try {
              const data = await translateOne(sections[i]);
              results[i] = { ok: true, data };
            } catch (e) {
              results[i] = { ok: false, error: e };
            }
          }
        }

        await Promise.all(Array.from({ length: Math.min(CONCURRENCY, sections.length) }, () => worker()));

        // Apply results to DB
        for (const r of results) {
          if (!r.ok) { failed++; continue; }
          const translated = r.data;
          await resumeRepository.updateSection(translated.sectionId, {
            title: translated.title,
            content: translated.content,
          });
          succeeded++;
        }

        // Update resume language
        await resumeRepository.update(resumeId, { language: targetLanguage });

        return {
          success: true,
          language: targetLanguage,
          translatedSections: succeeded,
          failedSections: failed,
        };
      },
    }),
  };
}
