import { NextRequest, NextResponse } from 'next/server';
import { resolveUser, getUserIdFromRequest } from '@/lib/auth/helpers';
import { userRepository } from '@/lib/db/repositories/user.repository';

export async function GET(request: NextRequest) {
  try {
    const fingerprint = getUserIdFromRequest(request);
    const user = await resolveUser(fingerprint);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error('GET /api/user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const fingerprint = getUserIdFromRequest(request);
    const user = await resolveUser(fingerprint);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, avatarUrl } = body;

    const updated = await userRepository.update(user.id, {
      ...(name && { name }),
      ...(avatarUrl && { avatarUrl }),
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
