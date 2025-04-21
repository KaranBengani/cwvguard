// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function createMiddleware(blockedRoutes: string[]) {
 return function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;
  const userAgent = req.headers.get('user-agent')?.toLowerCase() || '';

  const isBot = /bot|crawler|spider|crawl|slurp|google|bing|duckduckgo|baidu|yandex/i.test(userAgent);
  console.info(`[blocked-routes] ${blockedRoutes}`)
  const isBlocked = blockedRoutes.includes(pathname) || blockedRoutes.includes(pathname.replace(/\/$/, ''));

  if (isBlocked) {
    console.info(`[RouteBlocker] Blocking access to ${pathname} (${isBot ? 'Bot' : 'User'})`);
    return new NextResponse('Blocked due to poor performance.', {
      status: 410, // Gone
      headers: {
        'X-Robots-Tag': 'noindex, nofollow',
        'Content-Type': 'text/plain',
      },
    });
  }

  return NextResponse.next();
}
}
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  };