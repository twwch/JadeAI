import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getModel } from '@/lib/ai/provider';
import { resolveUser, getUserIdFromRequest } from '@/lib/auth/helpers';
import { resumeRepository } from '@/lib/db/repositories/resume.repository';
import { grammarCheckInputSchema, type GrammarCheckOutput } from '@/lib/ai/grammar-check-schema';

const GRAMMAR_CHECK_PROMPT = `You are an expert resume reviewer and writing coach. Analyze the provided resume sections for writing quality issues.

You must detect and report these types of issues:
- **grammar**: Grammatical errors, incorrect tense, subject-verb disagreement, article misuse
- **spelling**: Misspelled words or typos
- **weak_verb**: Weak or passive verbs that should be replaced with strong action verbs (e.g., "was responsible for" → "Led", "helped with" → "Facilitated")
- **vague**: Vague or generic descriptions that lack specificity (e.g., "worked on various projects" → specify which projects and what was achieved)
- **quantify**: Descriptions that could be improved with quantifiable metrics (e.g., "improved performance" → "improved performance by 40%")

Analysis guidelines:
- Check every text field in every section: titles, descriptions, highlights, summary text
- For each issue, provide the exact original text and a concrete suggestion
- Set severity: "high" for grammar/spelling errors, "medium" for weak verbs and vague descriptions, "low" for quantify suggestions
- Be thorough but practical — only flag genuinely improvable items
- Provide a brief overall summary of the writing quality
- Assign a score from 0-100 (100 = perfect, no issues found)

You MUST return a JSON object with exactly these fields:
- issues: array of { sectionId, sectionTitle, type, original, suggestion, severity }
- summary: string with overall assessment
- score: number from 0 to 100

CRITICAL: Return raw JSON only. Do NOT wrap in markdown code fences, headers, or any other formatting.`;

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
    const parsed = grammarCheckInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { resumeId, sectionIds } = parsed.data;

    // Fetch the resume and verify ownership
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }
    if (resume.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Filter sections if specific IDs are provided
    const sectionsToCheck = sectionIds
      ? resume.sections.filter((s: any) => sectionIds.includes(s.id))
      : resume.sections;

    if (sectionsToCheck.length === 0) {
      return NextResponse.json({ error: 'No sections found to check' }, { status: 400 });
    }

    // Prepare sections data for AI analysis
    const sectionsData = sectionsToCheck.map((s: any) => ({
      sectionId: s.id,
      sectionTitle: s.title,
      type: s.type,
      content: s.content,
    }));

    const model = getModel();

    const result = await generateText({
      model,
      maxOutputTokens: 8192,
      system: GRAMMAR_CHECK_PROMPT,
      prompt: `Analyze the following resume sections for grammar, spelling, weak verbs, vague descriptions, and opportunities to add quantifiable metrics.

## Resume Sections
${JSON.stringify(sectionsData, null, 2)}

Return a JSON object with "issues" (array), "summary" (string), and "score" (number 0-100). For each issue, include sectionId, sectionTitle, type, original, suggestion, and severity. Return raw JSON only — no markdown fences.`,
    });

    const checkResult: GrammarCheckOutput = parseJsonSafe(result.text);

    return NextResponse.json(checkResult);
  } catch (error) {
    console.error('POST /api/ai/grammar-check error:', error);
    return NextResponse.json({ error: 'Failed to check grammar' }, { status: 500 });
  }
}
