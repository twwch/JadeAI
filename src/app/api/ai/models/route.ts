import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key') || '';
  const baseURL = request.headers.get('x-base-url') || 'https://api.openai.com/v1';

  if (!apiKey) {
    return Response.json({ models: [] });
  }

  try {
    const res = await fetch(`${baseURL}/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      return Response.json({ models: [] });
    }

    const data = await res.json();
    const models = (data.data ?? data).map((m: { id: string }) => ({ id: m.id }));

    return Response.json({ models });
  } catch {
    return Response.json({ models: [] });
  }
}
