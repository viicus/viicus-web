import { NextRequest, NextResponse } from "next/server";
import { readToken, setPref } from "../_store";

async function handle(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const payload = readToken(token);
  if (!payload) {
    return NextResponse.json(
      { error: "invalid_or_expired_token" },
      { status: 400 },
    );
  }
  const prefs = setPref(payload.email, payload.category, false);
  return NextResponse.json({
    email: payload.email,
    category: payload.category,
    preferences: prefs,
  });
}

export async function POST(req: NextRequest) {
  return handle(req);
}

// RFC 8058 one-click unsubscribe is POST, but we also accept GET for safety.
export async function GET(req: NextRequest) {
  return handle(req);
}
