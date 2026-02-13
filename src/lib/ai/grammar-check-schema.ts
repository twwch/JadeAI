import { z } from 'zod/v4';

// Input schema for grammar-check API
export const grammarCheckInputSchema = z.object({
  resumeId: z.string().min(1).describe('The ID of the resume to check'),
  sectionIds: z.array(z.string()).optional().describe('Optional list of specific section IDs to check. If omitted, all sections are checked.'),
});

export type GrammarCheckInput = z.infer<typeof grammarCheckInputSchema>;

// Single issue schema
const grammarIssueSchema = z.object({
  sectionId: z.string().describe('The section ID where the issue was found'),
  sectionTitle: z.string().describe('Human-readable title of the section'),
  type: z.enum(['grammar', 'weak_verb', 'vague', 'quantify', 'spelling']).describe('Type of issue'),
  original: z.string().describe('The original text with the issue'),
  suggestion: z.string().describe('Suggested replacement or improvement'),
  severity: z.enum(['high', 'medium', 'low']).describe('Severity level of the issue'),
});

// Output schema for the AI grammar check response
export const grammarCheckOutputSchema = z.object({
  issues: z.array(grammarIssueSchema).describe('Array of detected issues with suggestions'),
  summary: z.string().describe('Brief overall summary of the writing quality'),
  score: z.number().min(0).max(100).describe('Overall writing quality score from 0 to 100'),
});

export type GrammarCheckOutput = z.infer<typeof grammarCheckOutputSchema>;
