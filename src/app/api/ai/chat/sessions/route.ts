import { NextRequest, NextResponse } from 'next/server';
import { resolveUser, getUserIdFromRequest } from '@/lib/auth/helpers';
import { chatRepository } from '@/lib/db/repositories/chat.repository';

export async function GET(request: NextRequest) {
  try {
    const fingerprint = getUserIdFromRequest(request);
    const user = await resolveUser(fingerprint);
    if (!user) return new Response('Unauthorized', { status: 401 });

    const resumeId = request.nextUrl.searchParams.get('resumeId');
    if (!resumeId) return new Response('Missing resumeId', { status: 400 });

    const sessions = await chatRepository.findSessionsByResumeId(resumeId);
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('GET /api/ai/chat/sessions error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const fingerprint = getUserIdFromRequest(request);
    const user = await resolveUser(fingerprint);
    if (!user) return new Response('Unauthorized', { status: 401 });

    const { resumeId } = await request.json();
    if (!resumeId) return new Response('Missing resumeId', { status: 400 });

    const session = await chatRepository.createSession({ resumeId });
    return NextResponse.json({ session });
  } catch (error) {
    console.error('POST /api/ai/chat/sessions error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
