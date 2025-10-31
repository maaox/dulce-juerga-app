import { auth } from './auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Public routes
  const isPublicRoute =
    pathname === '/' ||
    pathname === '/login' ||
    pathname.startsWith('/carta') ||
    pathname.startsWith('/dj-requests') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/menu') ||
    pathname.startsWith('/api/songs/publico') ||
    pathname === '/api/songs/prioritaria' ||
    pathname === '/api/songs/vip' ||
    pathname.startsWith('/api/config/descuento-actual') ||
    pathname.startsWith('/api/config/precios-canciones') ||
    pathname.startsWith('/api/config/cuentas-pago') ||
    pathname.startsWith('/api/public/');

  // API auth route
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access for dashboard routes
  if (pathname.startsWith('/dashboard')) {
    // Only allow admin, bartender, and cajero
    if (userRole !== 'ADMIN' && userRole !== 'BARTENDER' && userRole !== 'CAJERO') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
