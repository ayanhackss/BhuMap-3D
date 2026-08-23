import { NextResponse } from "next/server";

/**
 * POST /api/auth/session
 * Called by login page after successful demo/Supabase auth.
 * Sets an HttpOnly-safe session cookie that the Edge middleware can read.
 *
 * Body: { action: "set" | "clear" }
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({ action: "set" }));
  const res = NextResponse.json({ ok: true });

  if (body.action === "clear") {
    res.cookies.set("bhumap-session", "", {
      path: "/",
      maxAge: 0,
      sameSite: "lax",
    });
  } else {
    res.cookies.set("bhumap-session", "1", {
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: "lax",
      // httpOnly: false — must be readable by JS for logout too
    });
  }

  return res;
}
