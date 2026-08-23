import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge middleware auth guard.
 *
 * Reads the explicit "bhumap-session" cookie that the login page writes on
 * successful authentication via POST /api/auth/session (server-side, so the
 * cookie is present on the very next navigation request).
 *
 * We use a dedicated server-set cookie (not Zustand localStorage) because:
 *   - localStorage is browser-side only — middleware runs on the Edge
 *   - Zustand persist uses localStorage by default, not cookies
 *   - document.cookie writes are not available to Edge middleware
 */
export function middleware(request: NextRequest) {
  const session = request.cookies.get("bhumap-session")?.value;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Apply guard to all routes under /(main)
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/map/:path*",
    "/parcels/:path*",
    "/buildings/:path*",
    "/properties/:path*",
    "/surveys/:path*",
    "/datasets/:path*",
    "/processing/:path*",
    "/validation/:path*",
    "/conflicts/:path*",
    "/approvals/:path*",
    "/reports/:path*",
    "/audit/:path*",
    "/settings/:path*",
  ],
};
