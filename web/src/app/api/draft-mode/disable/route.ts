import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

// Disables Draft Mode and returns the visitor to the homepage (or a `?redirect=`
// target). Linked from the draft-mode banner so editors can exit preview.
export async function GET(request: Request) {
  (await draftMode()).disable();

  const redirectTo = new URL(request.url).searchParams.get("redirect") || "/";
  // Only allow same-origin relative redirects to avoid open-redirects.
  const safePath = redirectTo.startsWith("/") ? redirectTo : "/";

  return NextResponse.redirect(new URL(safePath, request.url));
}
