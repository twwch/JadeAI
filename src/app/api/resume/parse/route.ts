import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getModel } from '@/lib/ai/provider';
import { resolveUser, getUserIdFromRequest } from '@/lib/auth/helpers';
import { resumeRepository } from '@/lib/db/repositories/resume.repository';
import { parsedResumeSchema, type ParsedResume } from '@/lib/ai/parse-schema';

const ACCEPTED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const EXTRACT_PROMPT = `Extract resume info from this image. Return ONLY a JSON object, no markdown, no explanation.

JSON structure:
{"personalInfo":{"fullName":"","jobTitle":"","email":"","phone":"","location":""},"summary":"","workExperience":[{"company":"","position":"","startDate":"YYYY-MM","endDate":"YYYY-MM or null","current":false,"description":"","highlights":[]}],"education":[{"institution":"","degree":"","field":"","startDate":"YYYY-MM","endDate":"YYYY-MM","highlights":[]}],"skills":[{"name":"category","skills":[]}],"projects":[{"name":"","description":"","technologies":[],"highlights":[]}],"certifications":[{"name":"","issuer":"","date":""}],"languages":[{"language":"","proficiency":""}]}

Rules:
- Omit empty sections entirely
- Keep descriptions concise
- Dates in YYYY-MM format
- Return raw JSON only, no wrapping`;

export async function POST(request: NextRequest) {
  try {
    const fingerprint = getUserIdFromRequest(request);
    const user = await resolveUser(fingerprint);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const template = (formData.get('template') as string) || 'classic';
    const language = (formData.get('language') as string) || 'zh';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Accepted: PDF, PNG, JPG, WebP' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 10MB' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    const model = getModel();

    const { text } = await generateText({
      model,
      maxOutputTokens: 16384,
      providerOptions: {
        openai: {
          maxCompletionTokens: 16384,
          truncation: 'disabled',
        },
      },
      system: 'You are a resume parser. You MUST respond with a valid JSON object only. No markdown, no code blocks, no explanation — just raw JSON.',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', image: dataUrl },
            { type: 'text', text: EXTRACT_PROMPT },
          ],
        },
      ],
    });

    // Extract JSON from response — handle markdown code blocks or raw JSON
    const parsed = parseJsonFromText(text);
    if (!parsed) {
      console.error('Failed to parse JSON from model response:', text.slice(0, 500));
      return NextResponse.json({ error: 'Failed to extract resume data' }, { status: 500 });
    }

    // Validate with Zod (lenient — use partial data on failure)
    const validated = parsedResumeSchema.safeParse(parsed);
    const resumeData: ParsedResume = validated.success
      ? validated.data
      : (parsed as ParsedResume);

    // Create resume with parsed data
    const resume = await resumeRepository.create({
      userId: user.id,
      title: resumeData.personalInfo?.fullName || '未命名简历',
      template,
      language,
    });

    if (!resume) {
      return NextResponse.json({ error: 'Failed to create resume' }, { status: 500 });
    }

    // Create sections from parsed data
    const sections = buildSections(resumeData, language);
    for (let i = 0; i < sections.length; i++) {
      await resumeRepository.createSection({
        resumeId: resume.id,
        type: sections[i].type,
        title: sections[i].title,
        sortOrder: i,
        content: sections[i].content,
      });
    }

    const fullResume = await resumeRepository.findById(resume.id);
    return NextResponse.json(fullResume, { status: 201 });
  } catch (error) {
    console.error('POST /api/resume/parse error:', error);
    return NextResponse.json({ error: 'Failed to parse resume' }, { status: 500 });
  }
}

/**
 * Extract JSON from model text response.
 * Handles: raw JSON, ```json code blocks, JSON embedded in text, and truncated JSON.
 */
function parseJsonFromText(text: string): unknown | null {
  const candidates: string[] = [];

  // 1. Raw text
  candidates.push(text.trim());

  // 2. Code block content (complete or truncated)
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]+?)(?:\n?\s*```|$)/);
  if (codeBlockMatch) {
    candidates.push(codeBlockMatch[1].trim());
  }

  // 3. First { to last }
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd > jsonStart) {
    candidates.push(text.slice(jsonStart, jsonEnd + 1));
  }

  // 4. First { to end (for truncated responses)
  if (jsonStart !== -1) {
    candidates.push(text.slice(jsonStart));
  }

  // Try each candidate: first as-is, then with truncation repair
  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch {
      // Try repairing truncated JSON
      const repaired = repairTruncatedJson(candidate);
      if (repaired) {
        try {
          return JSON.parse(repaired);
        } catch {
          // Still invalid
        }
      }
    }
  }

  return null;
}

/**
 * Attempt to repair truncated JSON by closing open brackets/braces/strings.
 */
function repairTruncatedJson(text: string): string | null {
  let s = text.trim();
  if (!s.startsWith('{') && !s.startsWith('[')) return null;

  // Remove trailing comma
  s = s.replace(/,\s*$/, '');

  // Remove incomplete key-value pair at the end (e.g., `"key": "incom`)
  // Truncated string value: close it
  const trailingUnclosedString = s.match(/:\s*"[^"]*$/);
  if (trailingUnclosedString) {
    s += '"';
  }

  // Truncated key without value
  const trailingKey = s.match(/,\s*"[^"]*"?\s*$/);
  if (trailingKey) {
    s = s.slice(0, s.length - trailingKey[0].length);
  }

  // Remove trailing comma again after fixes
  s = s.replace(/,\s*$/, '');

  // Count open/close brackets and braces, close them
  const stack: string[] = [];
  let inString = false;
  let escaped = false;

  for (const ch of s) {
    if (escaped) { escaped = false; continue; }
    if (ch === '\\' && inString) { escaped = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{') stack.push('}');
    else if (ch === '[') stack.push(']');
    else if (ch === '}' || ch === ']') stack.pop();
  }

  // Close unclosed string
  if (inString) s += '"';

  // Close all open brackets/braces
  while (stack.length > 0) {
    s += stack.pop();
  }

  return s;
}

function buildSections(parsed: ParsedResume, language: string) {
  const isEn = language === 'en';
  const sections: { type: string; title: string; content: unknown }[] = [];

  // Personal Info
  sections.push({
    type: 'personal_info',
    title: isEn ? 'Personal Info' : '个人信息',
    content: {
      fullName: parsed.personalInfo?.fullName || '',
      jobTitle: parsed.personalInfo?.jobTitle || '',
      email: parsed.personalInfo?.email || '',
      phone: parsed.personalInfo?.phone || '',
      location: parsed.personalInfo?.location || '',
      website: parsed.personalInfo?.website || '',
      linkedin: parsed.personalInfo?.linkedin || '',
      github: parsed.personalInfo?.github || '',
    },
  });

  // Summary
  if (parsed.summary) {
    sections.push({
      type: 'summary',
      title: isEn ? 'Summary' : '个人简介',
      content: { text: parsed.summary },
    });
  }

  // Work Experience
  if (parsed.workExperience?.length) {
    sections.push({
      type: 'work_experience',
      title: isEn ? 'Work Experience' : '工作经历',
      content: {
        items: parsed.workExperience.map((w) => ({
          id: crypto.randomUUID(),
          company: w.company,
          position: w.position,
          location: w.location || '',
          startDate: w.startDate,
          endDate: w.endDate,
          current: w.current,
          description: w.description,
          highlights: w.highlights,
        })),
      },
    });
  }

  // Education
  if (parsed.education?.length) {
    sections.push({
      type: 'education',
      title: isEn ? 'Education' : '教育背景',
      content: {
        items: parsed.education.map((e) => ({
          id: crypto.randomUUID(),
          institution: e.institution,
          degree: e.degree,
          field: e.field,
          location: e.location || '',
          startDate: e.startDate,
          endDate: e.endDate,
          gpa: e.gpa || '',
          highlights: e.highlights,
        })),
      },
    });
  }

  // Skills
  if (parsed.skills?.length) {
    sections.push({
      type: 'skills',
      title: isEn ? 'Skills' : '技能特长',
      content: {
        categories: parsed.skills.map((s) => ({
          id: crypto.randomUUID(),
          name: s.name,
          skills: s.skills,
        })),
      },
    });
  }

  // Projects
  if (parsed.projects?.length) {
    sections.push({
      type: 'projects',
      title: isEn ? 'Projects' : '项目经历',
      content: {
        items: parsed.projects.map((p) => ({
          id: crypto.randomUUID(),
          name: p.name,
          url: p.url || '',
          startDate: p.startDate || '',
          endDate: p.endDate || '',
          description: p.description,
          technologies: p.technologies,
          highlights: p.highlights,
        })),
      },
    });
  }

  // Certifications
  if (parsed.certifications?.length) {
    sections.push({
      type: 'certifications',
      title: isEn ? 'Certifications' : '资格证书',
      content: {
        items: parsed.certifications.map((c) => ({
          id: crypto.randomUUID(),
          name: c.name,
          issuer: c.issuer,
          date: c.date,
          url: c.url || '',
        })),
      },
    });
  }

  // Languages
  if (parsed.languages?.length) {
    sections.push({
      type: 'languages',
      title: isEn ? 'Languages' : '语言能力',
      content: {
        items: parsed.languages.map((l) => ({
          id: crypto.randomUUID(),
          language: l.language,
          proficiency: l.proficiency,
        })),
      },
    });
  }

  return sections;
}
