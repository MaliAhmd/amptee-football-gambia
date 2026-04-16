import { NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export async function middleware(request) {
  const token = request.cookies.get('firebaseToken')?.value;
  const role = request.cookies.get('userRole')?.value;
  const firstLogin = request.cookies.get('userFirstLogin')?.value === 'true';
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/admin/login' || pathname === '/login';
  
  if (!token || !role) {
    if (pathname.startsWith('/admin') && !isAuthPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    if (pathname.startsWith('/editor') || pathname.startsWith('/coach') || pathname.startsWith('/change-password')) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  try {
    const decoded = jwtDecode(token);
    
    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('firebaseToken');
      response.cookies.delete('userRole');
      response.cookies.delete('userFirstLogin');
      return response;
    }

    if (firstLogin && pathname !== '/change-password') {
      return NextResponse.redirect(new URL('/change-password', request.url));
    }

    if (!firstLogin && pathname === '/change-password') {
      // Redirect to dashboard based on role
      return redirectToDashboard(role, request.url);
    }

    if (isAuthPage) {
      return redirectToDashboard(role, request.url);
    }

    // Role-based route protection
    if (pathname.startsWith('/admin') && role !== 'Admin') {
      return redirectToDashboard(role, request.url);
    }
    
    if (pathname.startsWith('/editor') && role !== 'Editor' && role !== 'Admin') {
      return redirectToDashboard(role, request.url);
    }
    
    if (pathname.startsWith('/coach') && role !== 'Team Coach' && role !== 'Admin') {
      return redirectToDashboard(role, request.url);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Auth Error:", error);
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete('firebaseToken');
    response.cookies.delete('userRole');
    response.cookies.delete('userFirstLogin');
    return response;
  }
}

function redirectToDashboard(role, url) {
  if (role === 'Admin') return NextResponse.redirect(new URL('/admin/dashboard', url));
  if (role === 'Editor') return NextResponse.redirect(new URL('/editor/dashboard', url));
  if (role === 'Team Coach') return NextResponse.redirect(new URL('/coach/dashboard', url));
  return NextResponse.redirect(new URL('/', url));
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/editor/:path*',
    '/coach/:path*',
    '/change-password',
    '/login'
  ]
};
