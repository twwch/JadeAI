import { jsonrepair } from 'jsonrepair';
import type { ZodType } from 'zod/v4';

/**
 * Repair unescaped double quotes inside JSON string values.
 *
 * AI models often output JSON like:
 *   "suggestion": "如"some text"more"
 * where the inner " are content quotes that should be escaped as \".
 *
 * Algorithm: walk character by character, track whether we're inside a JSON
 * string. When we hit a " inside a string, look ahead — if the next
 * non-whitespace character is a JSON structural char (, } ] :) or EOF,
 * it's a real closing quote; otherwise escape it.
 */
function repairUnescapedQuotes(text: string): string {
  const len = text.length;
  const out: string[] = [];
  let inString = false;
  let i = 0;

  while (i < len) {
    const ch = text[i];

    // Handle escape sequences inside strings
    if (inString && ch === '\\') {
      out.push(ch);
      if (i + 1 < len) {
        out.push(text[i + 1]);
        i += 2;
      } else {
        i++;
      }
      continue;
    }

    if (ch === '"') {
      if (!inString) {
        inString = true;
        out.push(ch);
      } else {
        // Look ahead past whitespace for a JSON structural character
        let j = i + 1;
        while (j < len && (text[j] === ' ' || text[j] === '\t' || text[j] === '\n' || text[j] === '\r')) {
          j++;
        }
        const next = j < len ? text[j] : '';
        if (next === '' || next === ',' || next === '}' || next === ']' || next === ':') {
          // Structural closing quote
          inString = false;
          out.push(ch);
        } else {
          // Unescaped content quote — escape it
          out.push('\\', '"');
        }
      }
    } else {
      out.push(ch);
    }
    i++;
  }

  return out.join('');
}

/** Strip markdown code fences from text */
function stripFences(text: string): string {
  const m = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  return m ? m[1].trim() : text;
}

/** Try to parse text as JSON, return null on failure */
function tryParse<T>(text: string, schema: ZodType<T>): T | null {
  try {
    return schema.parse(JSON.parse(text));
  } catch {
    return null;
  }
}

/**
 * Robustly extract and validate a JSON object from AI text output.
 * Handles: code fences, unescaped quotes, truncated JSON, extra text.
 */
export function extractJson<T>(text: string, schema: ZodType<T>): T {
  const trimmed = text.trim();

  // Step 1: Strip code fences if present
  const cleaned = stripFences(trimmed);

  // Step 2: Try direct parse
  const direct = tryParse(cleaned, schema);
  if (direct !== null) return direct;

  // Step 3: Repair unescaped quotes then parse
  const repaired = repairUnescapedQuotes(cleaned);
  const afterRepair = tryParse(repaired, schema);
  if (afterRepair !== null) return afterRepair;

  // Step 4: jsonrepair on the quote-repaired text
  try {
    const jr = jsonrepair(repaired);
    const r = tryParse(jr, schema);
    if (r !== null) return r;
  } catch {}

  // Step 5: Brute-force first { to last } on original cleaned text
  const braceStart = cleaned.indexOf('{');
  const braceEnd = cleaned.lastIndexOf('}');
  if (braceStart !== -1 && braceEnd > braceStart) {
    const slice = cleaned.slice(braceStart, braceEnd + 1);
    const repairedSlice = repairUnescapedQuotes(slice);
    const r = tryParse(repairedSlice, schema);
    if (r !== null) return r;
    try {
      const jr = jsonrepair(repairedSlice);
      const r2 = tryParse(jr, schema);
      if (r2 !== null) return r2;
    } catch {}
  }

  throw new Error(`Failed to extract valid JSON from AI response (length=${text.length})`);
}
