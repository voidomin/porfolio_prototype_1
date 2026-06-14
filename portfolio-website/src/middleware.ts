import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block admin routes unless ENABLE_ADMIN=true is explicitly set in the environment
  if (!process.env.ENABLE_ADMIN) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      return new NextResponse(null, { status: 404 });
    }
  }

  return NextResponse.next();
}

// Ensure middleware only triggers on the admin pages and API endpoints
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
