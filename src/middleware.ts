import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge middleware auth guard.
 *
 * Reads the explicit "bhumap-session" cookie that the login page writes on
 * successful authentication. We use a dedicated cookie (not Zustand's
 * localStorage persist) because:
 *   - localStorage is browser-side only — middleware runs on the Edge
 *   - Zustand persist uses localStorage by default, not cookies
 *
 * The login page must call:
 *   document.cookie = "bhumap-session=1; path=/; max-age=86400; SameSite=Lax";
 * on success, and clear it on logout.
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
