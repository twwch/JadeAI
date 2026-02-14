import { NextRequest } from 'next/server';
import { generateText, type LanguageModel } from 'ai';
import { getModel, extractAIConfig, AIConfigError } from '@/lib/ai/provider';
import { resolveUser, getUserIdFromRequest } from '@/lib/auth/helpers';
import { resumeRepository } from '@/lib/db/repositories/resume.repository';
import { translateInputSchema } from '@/lib/ai/translate-schema';
import { extractJson } from '@/lib/ai/extract-json';
import { z } from 'zod/v4';

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

/** Fields to strip before sending to AI (e.g. base64 avatar), keyed by section type */
const STRIP_FIELDS: Record<string, string[]> = {
  personal_info: ['avatar'],
};

const MAX_CONCURRENCY = 4;

const singleSectionSchema = z.object({
  sectionId: z.string(),
  title: z.string(),
  content: z.any(),
});

function getSectionTranslatePrompt(targetLanguage: string): string {
  const langName = LANGUAGE_NAMES[targetLanguage] || targetLanguage;

  return `You are a professional resume translator. Translate the given resume section into ${langName}.

Rules:
- Use professional, formal ${langName} appropriate for resumes
- Translate job titles, descriptions, and achievements naturally
- Keep proper nouns in their commonly recognized form. If no standard translation exists, keep original
- Dates remain in the same format (YYYY-MM)
- Technical terms and programming languages stay in English (e.g., JavaScript, React, AWS)
- Section titles should use standard resume headings in the target language
- Preserve the exact JSON structure and all field names — only translate string values
- Keep all IDs, URLs, emails, phone numbers unchanged
- CRITICAL: Return a single valid JSON object. No markdown, no code fences, no extra text.`;
}

async function translateSection(
  section: { sectionId: string; type: string; title: string; content: unknown },
  targetLanguage: string,
  model: LanguageModel
) {
  const result = await generateText({
    model,
    maxOutputTokens: 4096,
    system: getSectionTranslatePrompt(targetLanguage),
    prompt: `Translate this resume section. Return JSON with keys: sectionId, title, content.\n\n${JSON.stringify(section)}`,
    providerOptions: {
      openai: { response_format: { type: 'json_object' } },
    },
  });

  return extractJson(result.text, singleSectionSchema);
}

/** Run async tasks with a concurrency limit */
async function runWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
  onSettled?: (index: number, result: PromiseSettledResult<R>) => void
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const i = nextIndex++;
      try {
        const r = await fn(items[i]);
        results[i] = { status: 'fulfilled', value: r };
      } catch (e) {
        results[i] = { status: 'rejected', reason: e };
      }
      onSettled?.(i, results[i]);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

export async function POST(request: NextRequest) {
  try {
    const fingerprint = getUserIdFromRequest(request);
    const user = await resolveUser(fingerprint);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const body = await request.json();
    const parsed = translateInputSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: parsed.error.issues }),
        { status: 400 }
      );
    }

    const { resumeId, targetLanguage, sectionIds } = parsed.data;

    const resume = await resumeRepository.findById(resumeId);
    if (!resume) {
      return new Response(JSON.stringify({ error: 'Resume not found' }), { status: 404 });
    }
    if (resume.userId !== user.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const allSections = sectionIds
      ? resume.sections.filter((s: any) => sectionIds.includes(s.id))
      : resume.sections;

    if (allSections.length === 0) {
      return new Response(JSON.stringify({ error: 'No sections found to translate' }), { status: 400 });
    }

    // Build section data for AI, stripping heavy non-translatable fields (e.g. base64 avatar)
    // Save stripped fields so we can merge them back after translation
    const strippedFields = new Map<string, Record<string, unknown>>();

    const sectionsData = allSections.map((s: any) => {
      const fieldsToStrip = STRIP_FIELDS[s.type];
      let content = s.content;

      if (fieldsToStrip && content && typeof content === 'object') {
        const saved: Record<string, unknown> = {};
        content = { ...content };
        for (const field of fieldsToStrip) {
          if (field in content) {
            saved[field] = content[field];
            delete content[field];
          }
        }
        if (Object.keys(saved).length > 0) {
          strippedFields.set(s.id, saved);
        }
      }

      return {
        sectionId: s.id,
        type: s.type,
        title: s.title,
        content,
      };
    });

    const aiConfig = extractAIConfig(request);
    const model = getModel(aiConfig);
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const send = (data: Record<string, unknown>) => {
          try {
            controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'));
          } catch {
            // Stream may have been cancelled by client
          }
        };

        let completed = 0;
        const total = sectionsData.length;
        let failedCount = 0;

        try {
          const results = await runWithConcurrency<typeof sectionsData[number], z.infer<typeof singleSectionSchema>>(
            sectionsData,
            MAX_CONCURRENCY,
            async (section) => {
              const translated = await translateSection(section, targetLanguage, model);

              // Merge back stripped fields (e.g. avatar)
              const saved = strippedFields.get(translated.sectionId);
              const content = saved
                ? { ...translated.content, ...saved }
                : translated.content;

              await resumeRepository.updateSection(translated.sectionId, {
                title: translated.title,
                content,
              });

              return { ...translated, content };
            },
            (_index, result) => {
              completed++;
              if (result.status === 'rejected') {
                failedCount++;
                send({ type: 'progress', completed, total });
              } else {
                const section = (result as PromiseFulfilledResult<z.infer<typeof singleSectionSchema>>).value;
                send({ type: 'progress', completed, total, section });
              }
            }
          );

          if (failedCount > 0) {
            console.error(
              'Some sections failed to translate:',
              results
                .filter((r) => r.status === 'rejected')
                .map((f) => (f as PromiseRejectedResult).reason)
            );
          }

          // Update resume language
          await resumeRepository.update(resumeId, { language: targetLanguage });
        } catch (err) {
          console.error('Unexpected error during translation:', err);
        }

        // Always send done and close — even if something above threw
        try {
          const updatedResume = await resumeRepository.findById(resumeId);
          const updatedSections = sectionIds
            ? updatedResume?.sections.filter((s: any) => sectionIds.includes(s.id))
            : updatedResume?.sections;

          send({
            type: 'done',
            resumeId,
            language: targetLanguage,
            sections: updatedSections || [],
            failedCount,
          });
        } catch (err) {
          console.error('Error fetching final data:', err);
          send({ type: 'done', resumeId, language: targetLanguage, sections: [], failedCount });
        }

        try {
          controller.close();
        } catch {
          // Already closed
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/x-ndjson',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    if (error instanceof AIConfigError) {
      return new Response(JSON.stringify({ error: error.message }), { status: 401 });
    }
    console.error('POST /api/ai/translate error:', error);
    return new Response(JSON.stringify({ error: 'Failed to translate resume' }), { status: 500 });
  }
}
