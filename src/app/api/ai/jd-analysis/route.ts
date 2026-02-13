import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getModel } from '@/lib/ai/provider';
import { resolveUser, getUserIdFromRequest } from '@/lib/auth/helpers';
import { resumeRepository } from '@/lib/db/repositories/resume.repository';
import { jdAnalysisInputSchema, type JdAnalysisOutput } from '@/lib/ai/jd-analysis-schema';

const JD_ANALYSIS_PROMPT = `You are an expert resume analyst and career coach. Analyze the match between the provided resume and job description.

Your analysis should be thorough and actionable. You MUST return a JSON object with these exact fields:
- overallScore (number 0-100): Overall match rating
- keywordMatches (string[]): Keywords from the JD that ARE present in the resume
- missingKeywords (string[]): Important keywords from the JD that are NOT in the resume
- suggestions (array of {section, current, suggested}): Actionable improvement suggestions
- atsScore (number 0-100): ATS compatibility rating
- summary (string): Concise overall assessment

CRITICAL: Return raw JSON only. Do NOT wrap in markdown code fences, headers, or any other formatting. Do NOT use markdown in your response. Only output a single valid JSON object.`;

/** Strip markdown code fences and parse JSON */
function parseJsonSafe(text: string): any {
  let cleaned = text.trim();
  // Remove ```json ... ``` or ``` ... ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }
  // If it starts with markdown (e.g. "# ..."), try to extract the first JSON object
  if (cleaned.startsWith('#') || cleaned.startsWith('*')) {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }
  }
  return JSON.parse(cleaned);
}

export async function POST(request: NextRequest) {
  try {
    const fingerprint = getUserIdFromRequest(request);
    const user = await resolveUser(fingerprint);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = jdAnalysisInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { resumeId, jobDescription } = parsed.data;

    // Fetch the resume and verify ownership
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }
    if (resume.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resumeContext = JSON.stringify(resume.sections);
    const model = getModel();

    const result = await generateText({
      model,
      maxOutputTokens: 8192,
      system: JD_ANALYSIS_PROMPT,
      prompt: `## Resume Data
${resumeContext}

## Job Description
${jobDescription}

Analyze the match between this resume and the job description. Return a single JSON object with fields: overallScore, keywordMatches, missingKeywords, suggestions, atsScore, summary. No markdown, no code fences — raw JSON only.`,
    });

    const analysisData: JdAnalysisOutput = parseJsonSafe(result.text);

    return NextResponse.json(analysisData);
  } catch (error) {
    console.error('POST /api/ai/jd-analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze job description match' }, { status: 500 });
  }
}
