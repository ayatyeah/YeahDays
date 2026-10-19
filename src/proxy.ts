import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { needsLogin } from '@/lib/publicPaths';
import { studyApiAllowed, studyPageAllowed } from '@/lib/studyAccess';

export default auth(req => {
  const path = req.nextUrl.pathname;
  if (path.startsWith('/api/')) {
    if (!studyApiAllowed(path)) return NextResponse.json({ error: 'В этой версии приложения доступны задания и обратная связь на главной.', code: 'STUDY_SURFACE_ONLY' }, { status: 403, headers: { 'Cache-Control': 'private, no-store' } });
    return;
  }
  if (req.auth && path === '/') return NextResponse.redirect(new URL('/app', req.nextUrl.origin));
  if (!studyPageAllowed(path)) return NextResponse.redirect(new URL('/app', req.nextUrl.origin));
  if (req.auth || !needsLogin(path)) return;
  const url = new URL('/login', req.nextUrl.origin);
  url.searchParams.set('callbackUrl', path + req.nextUrl.search);
  return NextResponse.redirect(url);
});
export const config = {
  matcher: ['/api/:path*', '/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
