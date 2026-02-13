import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getModel } from '@/lib/ai/provider';
import { resolveUser, getUserIdFromRequest } from '@/lib/auth/helpers';
import { resumeRepository } from '@/lib/db/repositories/resume.repository';
import { translateInputSchema, type TranslateOutput } from '@/lib/ai/translate-schema';

const LANGUAGE_NAMES: Record<string, string> = {
  zh: 'Simplified Chinese',
  en: 'English',
  ja: 'Japanese',
  ko: 'Korean',
  fr: 'French',
  de: 'German',
  es: 'Spanish',
  pt: 'Portuguese',
  ru: 'Russian',
  ar: 'Arabic',
};

function getTranslatePrompt(targetLanguage: string): string {
  const langName = LANGUAGE_NAMES[targetLanguage] || targetLanguage;

  return `You are a professional resume translator. Translate the following resume sections into ${langName}.

Translation guidelines:
- Use professional and formal ${langName} appropriate for resumes in the target locale
- Translate job titles, company descriptions, and achievements naturally — do not transliterate
- Keep proper nouns (company names, university names) in their commonly recognized form in the target language. If no standard translation exists, keep the original name
- Dates should remain in the same format (YYYY-MM)
- Technical terms and programming languages should stay in English (e.g., JavaScript, React, AWS)
- Adapt phrasing to the target language's resume conventions
- Section titles should use standard resume headings in the target language
- Preserve the exact JSON structure and all field names — only translate the string values
- Keep all IDs, URLs, emails, phone numbers unchanged
- CRITICAL: You are a JSON API. Your entire response must be a single valid JSON object starting with { and ending with }. Do NOT use markdown syntax. Do NOT wrap in code fences. Do NOT add any text before or after the JSON.`;
}

import { extractJson } from '@/lib/ai/extract-json';
import { z } from 'zod/v4';

const translateOutputSchema = z.object({
  sections: z.array(z.any()),
});

export async function POST(request: NextRequest) {
  try {
    const fingerprint = getUserIdFromRequest(request);
    const user = await resolveUser(fingerprint);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = translateInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { resumeId, targetLanguage, sectionIds } = parsed.data;

    // Fetch the resume and verify ownership
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }
    if (resume.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Filter sections if specific IDs are provided
    const sectionsToTranslate = sectionIds
      ? resume.sections.filter((s: any) => sectionIds.includes(s.id))
      : resume.sections;

    if (sectionsToTranslate.length === 0) {
      return NextResponse.json({ error: 'No sections found to translate' }, { status: 400 });
    }

    // Prepare sections data for AI translation
    const sectionsData = sectionsToTranslate.map((s: any) => ({
      sectionId: s.id,
      type: s.type,
      title: s.title,
      content: s.content,
    }));

    const model = getModel();

    const result = await generateText({
      model,
      maxOutputTokens: 16384,
      system: getTranslatePrompt(targetLanguage),
      prompt: `Translate the following resume sections. Return a JSON object with a "sections" array containing every section with its translated title and content. Respond with JSON only.\n\n${JSON.stringify(sectionsData, null, 2)}`,
      providerOptions: {
        openai: {
          response_format: { type: 'json_object' },
        },
      },
    });

    let translatedData: TranslateOutput = extractJson(result.text, translateOutputSchema) as TranslateOutput;
    // Handle case where model returns the array directly instead of { sections: [...] }
    if (Array.isArray(translatedData)) {
      translatedData = { sections: translatedData as any };
    }

    // Update each section in the database
    for (const translatedSection of translatedData.sections) {
      const originalSection = sectionsToTranslate.find(
        (s: any) => s.id === translatedSection.sectionId
      );
      if (!originalSection) continue;

      await resumeRepository.updateSection(translatedSection.sectionId, {
        title: translatedSection.title,
        content: translatedSection.content,
      });
    }

    // Update resume language field
    await resumeRepository.update(resumeId, { language: targetLanguage });

    // Fetch the updated resume to return fresh data
    const updatedResume = await resumeRepository.findById(resumeId);
    if (!updatedResume) {
      return NextResponse.json({ error: 'Failed to fetch updated resume' }, { status: 500 });
    }

    // Return only the translated sections
    const updatedSections = sectionIds
      ? updatedResume.sections.filter((s: any) => sectionIds.includes(s.id))
      : updatedResume.sections;

    return NextResponse.json({
      resumeId,
      language: targetLanguage,
      sections: updatedSections,
    });
  } catch (error) {
    console.error('POST /api/ai/translate error:', error);
    return NextResponse.json({ error: 'Failed to translate resume' }, { status: 500 });
  }
}
