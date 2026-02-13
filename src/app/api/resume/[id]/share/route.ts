import { NextRequest, NextResponse } from 'next/server';
import { resumeRepository } from '@/lib/db/repositories/resume.repository';
import { resolveUser, getUserIdFromRequest } from '@/lib/auth/helpers';

function generateShareToken(): string {
  // Generate a URL-safe token (shorter than UUID for sharing)
  return crypto.randomUUID().replace(/-/g, '').slice(0, 16);
}

function getShareUrl(token: string, request: NextRequest): string {
  const origin = request.headers.get('origin') || request.nextUrl.origin;
  return `${origin}/share/${token}`;
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const fingerprint = getUserIdFromRequest(request);
    const user = await resolveUser(fingerprint);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resume = await resumeRepository.findById(id);
    if (!resume) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (resume.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { password } = body as { password?: string };

    // Reuse existing token or generate a new one
    const shareToken = resume.shareToken || generateShareToken();
    const hashedPassword = password ? await hashPassword(password) : resume.sharePassword;

    await resumeRepository.updateShareSettings(id, {
      isPublic: true,
      shareToken,
      sharePassword: hashedPassword,
    });

    return NextResponse.json({
      shareToken,
      shareUrl: getShareUrl(shareToken, request),
      isPublic: true,
    });
  } catch (error) {
    console.error('POST /api/resume/[id]/share error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const fingerprint = getUserIdFromRequest(request);
    const user = await resolveUser(fingerprint);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resume = await resumeRepository.findById(id);
    if (!resume) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (resume.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      isPublic: resume.isPublic,
      shareToken: resume.shareToken,
      shareUrl: resume.shareToken ? getShareUrl(resume.shareToken, request) : null,
      viewCount: resume.viewCount,
      hasPassword: !!resume.sharePassword,
    });
  } catch (error) {
    console.error('GET /api/resume/[id]/share error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const fingerprint = getUserIdFromRequest(request);
    const user = await resolveUser(fingerprint);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resume = await resumeRepository.findById(id);
    if (!resume) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (resume.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await resumeRepository.updateShareSettings(id, {
      isPublic: false,
      shareToken: null,
      sharePassword: null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/resume/[id]/share error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
