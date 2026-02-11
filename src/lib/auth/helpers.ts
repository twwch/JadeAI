import { auth } from './config';
import { config } from '@/lib/config';
import { userRepository } from '@/lib/db/repositories/user.repository';

export async function getCurrentUserId(): Promise<string | null> {
  if (config.auth.enabled) {
    const session = await auth();
    return session?.user?.id || null;
  }
  // In fingerprint mode, userId is resolved from the request header
  return null;
}

export async function resolveUser(fingerprint?: string | null) {
  if (config.auth.enabled) {
    const session = await auth();
    if (!session?.user?.id) return null;

    let user = await userRepository.findById(session.user.id);
    if (!user) {
      user = await userRepository.create({
        id: session.user.id,
        email: session.user.email || undefined,
        name: session.user.name || undefined,
        avatarUrl: session.user.image || undefined,
        authType: 'oauth',
      });
    }
    return user;
  }

  if (!fingerprint) return null;
  return userRepository.upsertByFingerprint(fingerprint);
}

export function getUserIdFromRequest(request: Request): string | null {
  return request.headers.get('x-fingerprint') || null;
}
