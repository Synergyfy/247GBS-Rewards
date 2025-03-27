import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
// import { getCookieValue } from './services/getCookieValue';

export default function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/loyalty', req.url));
  }
  const excludedPaths = [
    '/landing',
    '/campaign/signup',
    '/campaign/login',
    '/staff/login',
  ];

  if (excludedPaths.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const isStaffCodeRoute = req.nextUrl.pathname.match(/^\/staff\/[^\/]+$/);
  if (isStaffCodeRoute) {
    return NextResponse.next();
  }

  const isCampaignCodeRoute =
    req.nextUrl.pathname.match(/^\/campaign\/[^\/]+$/);
  if (isCampaignCodeRoute) {
    return NextResponse.next();
  }

  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/landing', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard', '/staff/:path*', '/campaign/:path*'],
};
