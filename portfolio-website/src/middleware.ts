import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Centralized block for admin panel and admin APIs in production
  if (process.env.NODE_ENV === "production") {
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      // Return 404 response to make the path look completely non-existent
      return new NextResponse(null, { status: 404 });
    }
  }

  return NextResponse.next();
}

// Ensure middleware only triggers on the admin pages and API endpoints
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
