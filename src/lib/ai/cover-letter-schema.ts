import { z } from 'zod/v4';

// Input schema for cover-letter API
export const coverLetterInputSchema = z.object({
  resumeId: z.string().min(1).describe('The ID of the resume to base the cover letter on'),
  jobDescription: z.string().min(1).describe('The target job description'),
  tone: z.enum(['formal', 'friendly', 'confident']).describe('The tone of the cover letter'),
  language: z.enum(['zh', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'pt', 'ru', 'ar']).optional().default('zh').describe('Language for the cover letter'),
});

export type CoverLetterInput = z.infer<typeof coverLetterInputSchema>;

// Output schema for the AI cover letter response
export const coverLetterOutputSchema = z.object({
  title: z.string().describe('Cover letter title, e.g. "Cover Letter for Frontend Engineer at Google"'),
  content: z.string().describe('Full cover letter text in markdown format'),
});

export type CoverLetterOutput = z.infer<typeof coverLetterOutputSchema>;
