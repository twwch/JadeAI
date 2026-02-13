import { z } from 'zod/v4';

// Input schema for translate API
export const translateInputSchema = z.object({
  resumeId: z.string().describe('The ID of the resume to translate'),
  targetLanguage: z.enum(['zh', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'pt', 'ru', 'ar']).describe('Target language for translation'),
  sectionIds: z.array(z.string()).optional().describe('Optional list of specific section IDs to translate. If omitted, all sections are translated.'),
});

export type TranslateInput = z.infer<typeof translateInputSchema>;

// Schema for a single translated section - used with generateObject
export const translatedSectionSchema = z.object({
  sectionId: z.string().describe('The original section ID'),
  title: z.string().describe('The translated section title'),
  content: z.record(z.string(), z.any()).describe('The translated section content, preserving the same structure as the original'),
});

// Output schema for the AI translation response
export const translateOutputSchema = z.object({
  sections: z.array(translatedSectionSchema).describe('Array of translated sections'),
});

export type TranslateOutput = z.infer<typeof translateOutputSchema>;
