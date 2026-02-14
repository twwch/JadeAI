import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Public paths that don't require authentication (relative to locale prefix)
const PUBLIC_PATHS = [
  '/',        // Landing page
  '/login',   // Login page
  '/share',   // Public share links
];

function isPublicPath(pathname: string): boolean {
  // Strip locale prefix: /zh/dashboard -> /dashboard, /en/ -> /
  const withoutLocale = pathname.replace(/^\/(zh|en)/, '') || '/';
  return PUBLIC_PATHS.some((p) =>
    p === '/' ? withoutLocale === '/' : withoutLocale.startsWith(p)
  );
}

export default async function middleware(request: NextRequest) {
  // Always run i18n middleware first
  const response = intlMiddleware(request);

  // Only check auth when OAuth is enabled
  const authEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true';
  if (!authEnabled) return response;

  // Skip auth check for public paths and API routes
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/api/')) return response;
  if (isPublicPath(pathname)) return response;

  // Check for NextAuth session token
  const token =
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('__Secure-authjs.session-token')?.value;

  if (!token) {
    // Determine locale from the path or default
    const localeMatch = pathname.match(/^\/(zh|en)/);
    const locale = localeMatch ? localeMatch[1] : 'zh';
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ['/', '/(zh|en)/:path*', '/share/:path*'],
};
