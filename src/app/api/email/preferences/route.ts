import { NextRequest, NextResponse } from "next/server";
import {
  ALL_CATEGORIES,
  EmailCategory,
  getOrCreatePrefs,
  readToken,
  setPref,
} from "../_store";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const payload = readToken(token);
  if (!payload) {
    return NextResponse.json(
      { error: "invalid_or_expired_token" },
      { status: 400 },
    );
  }
  const prefs = getOrCreatePrefs(payload.email);
  return NextResponse.json({
    email: payload.email,
    preferences: prefs,
    categories: ALL_CATEGORIES,
  });
}

export async function PATCH(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const payload = readToken(token);
  if (!payload) {
    return NextResponse.json(
      { error: "invalid_or_expired_token" },
      { status: 400 },
    );
  }
  let body: { category?: EmailCategory; enabled?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  if (
    !body.category ||
    !ALL_CATEGORIES.includes(body.category) ||
    typeof body.enabled !== "boolean"
  ) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const prefs = setPref(payload.email, body.category, body.enabled);
  return NextResponse.json({ email: payload.email, preferences: prefs });
}
