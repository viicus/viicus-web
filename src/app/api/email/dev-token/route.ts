import { NextRequest, NextResponse } from "next/server";
import { ALL_CATEGORIES, EmailCategory, createToken } from "../_store";

// Dev helper: generates a sample token so the unsubscribe / preferences pages
// can be opened without a real backend. Remove once the Go API is wired up.
export async function GET(req: NextRequest) {
  const email =
    req.nextUrl.searchParams.get("email") ?? "demo@viicus.com";
  const categoryParam = req.nextUrl.searchParams.get("category") ?? "moderation";
  const category: EmailCategory = ALL_CATEGORIES.includes(
    categoryParam as EmailCategory,
  )
    ? (categoryParam as EmailCategory)
    : "moderation";
  const token = createToken(email, category);
  return NextResponse.json({
    token,
    email,
    category,
    unsubscribeUrl: `/email/unsubscribe?token=${token}`,
    preferencesUrl: `/email/preferences?token=${token}`,
  });
}
