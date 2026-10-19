import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { needsLogin } from '@/lib/publicPaths';
import { studyApiAllowed } from '@/lib/studyAccess';
import { APP_MODE_COOKIE, isRmtPath, isVersionPicker, parseAppMode, RMT_PATHS } from '@/lib/appMode';
export default auth(req=>{
  const path=req.nextUrl.pathname;
  const mode=parseAppMode(req.cookies.get(APP_MODE_COOKIE)?.value);
  if(path.startsWith('/api/')){
    // Server integrations without browser cookies retain their own auth checks.
    if(mode==='rmt' && !studyApiAllowed(path))return NextResponse.json({error:'Эта функция доступна в обычной версии. Сначала смените версию.',code:'STUDY_SURFACE_ONLY'},{status:403,headers:{'Cache-Control':'private, no-store'}});
    return;
  }
  if(isVersionPicker(path)||path.startsWith('/admin'))return;
  if(path==='/research')return NextResponse.redirect(new URL(mode==='rmt'?'/rmt':'/',req.nextUrl.origin));
  const rmt=isRmtPath(path);
  const legal=path==='/privacy'||path==='/terms'||path==='/rmt-privacy'||path==='/rmt-terms';
  const authPage=['/login','/login/lms','/register','/forgot-password'].includes(path);
  if(!legal&&!authPage&&!path.startsWith('/invite/')&&!path.startsWith('/events-data/')&&path!=='/offline'){
    if(!mode)return NextResponse.redirect(new URL('/',req.nextUrl.origin));
    if(rmt&&mode!=='rmt')return NextResponse.redirect(new URL('/',req.nextUrl.origin));
    if(!rmt&&mode==='rmt')return NextResponse.redirect(new URL(RMT_PATHS[path]??'/rmt',req.nextUrl.origin));
  }
  if(req.auth||!needsLogin(path))return;
  const login=new URL('/login',req.nextUrl.origin);login.searchParams.set('callbackUrl',path+req.nextUrl.search);return NextResponse.redirect(login);
});
export const config={matcher:['/api/:path*','/((?!api|_next/static|_next/image|.*\\..*).*)']};
