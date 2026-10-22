import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { needsLogin } from '@/lib/publicPaths';
export default auth(req=>{
  const path=req.nextUrl.pathname;
  // API routes keep their own authentication and authorization checks.
  if(path.startsWith('/api/'))return;
  // The RMT version picker was removed: old links open the main page.
  if(path==='/versions'||path==='/research')return NextResponse.redirect(new URL('/',req.nextUrl.origin));
  if(path.startsWith('/admin'))return;
  if(req.auth||!needsLogin(path))return;
  const login=new URL('/login',req.nextUrl.origin);login.searchParams.set('callbackUrl',path+req.nextUrl.search);return NextResponse.redirect(login);
});
export const config={matcher:['/api/:path*','/((?!api|_next/static|_next/image|.*\\..*).*)']};
