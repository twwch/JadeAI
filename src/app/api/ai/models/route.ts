import { config } from '@/lib/config';

interface ModelEntry {
  id: string;
}

let cachedModels: ModelEntry[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60_000;

export async function GET() {
  const now = Date.now();
  if (cachedModels && now - cacheTimestamp < CACHE_TTL) {
    return Response.json({ models: cachedModels, fallbackModel: config.ai.model });
  }

  try {
    const res = await fetch(`${config.ai.baseURL}/models`, {
      headers: { Authorization: `Bearer ${config.ai.apiKey}` },
    });

    if (!res.ok) throw new Error(`${res.status}`);

    const data = await res.json();
    const models: ModelEntry[] = (data.data ?? data).map((m: { id: string }) => ({ id: m.id }));

    cachedModels = models;
    cacheTimestamp = now;

    return Response.json({ models, fallbackModel: config.ai.model });
  } catch {
    return Response.json({ models: [{ id: config.ai.model }], fallbackModel: config.ai.model });
  }
}
