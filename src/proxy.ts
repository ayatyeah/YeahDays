import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { needsLogin } from '@/lib/publicPaths';
import { APP_MODE_COOKIE } from '@/lib/appMode';
/**
 * Куда вести гостя с закрытой страницы. Кука yg-version (её ставит
 * /api/app-mode каждому вошедшему при каждом открытии приложения, живёт
 * год) значит «с этого браузера уже входили» — тогда на вход. Без неё —
 * на регистрацию: так приходят новички с кнопки «Начать» на витрине, и
 * раньше их встречало «С возвращением. Рады видеть снова».
 */
const door=(req:{cookies:{has:(name:string)=>boolean}})=>req.cookies.has(APP_MODE_COOKIE)?'/login':'/register';
export default auth(req=>{
  const path=req.nextUrl.pathname;
  // API routes keep their own authentication and authorization checks.
  if(path.startsWith('/api/'))return;
  // The RMT version picker was removed: old links open the main page.
  if(path==='/versions'||path==='/research')return NextResponse.redirect(new URL('/',req.nextUrl.origin));
  if(path.startsWith('/admin'))return;
  if(req.auth||!needsLogin(path))return;
  const to=new URL(door(req),req.nextUrl.origin);to.searchParams.set('callbackUrl',path+req.nextUrl.search);return NextResponse.redirect(to);
});
export const config={matcher:['/api/:path*','/((?!api|_next/static|_next/image|.*\\..*).*)']};
