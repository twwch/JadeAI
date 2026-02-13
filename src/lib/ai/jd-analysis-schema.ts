import { z } from 'zod/v4';

// Input schema for JD analysis API
export const jdAnalysisInputSchema = z.object({
  resumeId: z.string().describe('The ID of the resume to analyze'),
  jobDescription: z.string().min(1).describe('The job description text to match against'),
});

export type JdAnalysisInput = z.infer<typeof jdAnalysisInputSchema>;

// Suggestion item schema
const suggestionSchema = z.object({
  section: z.string().describe('The resume section this suggestion applies to (e.g., "work_experience", "skills", "summary")'),
  current: z.string().describe('The current content or issue being addressed'),
  suggested: z.string().describe('The suggested improvement or addition'),
});

// Output schema for JD analysis - used with generateObject
export const jdAnalysisOutputSchema = z.object({
  overallScore: z.number().min(0).max(100).describe('Overall match score from 0 to 100'),
  keywordMatches: z.array(z.string()).describe('Keywords from the JD that are found in the resume'),
  missingKeywords: z.array(z.string()).describe('Important keywords from the JD that are missing from the resume'),
  suggestions: z.array(suggestionSchema).describe('Specific optimization suggestions for each section'),
  atsScore: z.number().min(0).max(100).describe('ATS (Applicant Tracking System) compatibility score from 0 to 100'),
  summary: z.string().describe('Overall analysis summary with key findings and recommendations'),
});

export type JdAnalysisOutput = z.infer<typeof jdAnalysisOutputSchema>;
