import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge middleware auth guard.
 * Reads the persisted Zustand auth cookie ("bhumap-auth") set by zustand/middleware persist.
 * If the cookie is absent or the parsed user is null, redirect to /login.
 * This prevents the flash-of-null that the client-only useEffect guard caused.
 */
export function middleware(request: NextRequest) {
  const raw = request.cookies.get("bhumap-auth")?.value;
  let authenticated = false;

  if (raw) {
    try {
      const parsed = JSON.parse(decodeURIComponent(raw));
      authenticated = Boolean(parsed?.state?.user);
    } catch {
      authenticated = false;
    }
  }

  if (!authenticated) {
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
