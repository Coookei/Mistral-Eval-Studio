import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isServerAction = (request: NextRequest) =>
  // server actions are POST requests that include the Next-Action header
  request.method === 'POST' && request.headers.has('next-action');

export default function proxy(request: NextRequest) {
  if (isServerAction(request)) {
    // dont mutate headers for server actions, to avoid nextjs errors
    return NextResponse.next();
  }

  // clone the headers and set a new current path header, to allow redirecting for sign-in convenience
  const headers = new Headers(request.headers);
  headers.set('x-pathname', request.nextUrl.pathname);
  return NextResponse.next({ headers });
}

export const config = {
  matcher: [
    // exclude API routes, static files, image optimizations, and .png files
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
};
