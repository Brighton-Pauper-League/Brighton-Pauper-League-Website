import { revalidatePath } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import { NextResponse, type NextRequest } from "next/server";

// On-demand revalidation endpoint for Sanity webhooks.
//
// Configure a webhook in Sanity (sanity.io/manage → API → Webhooks) pointing at
// `<site>/api/revalidate`, with the same secret as SANITY_REVALIDATE_SECRET.
// Any document change refreshes the whole route tree — appropriate for a small
// site, and avoids per-type tag bookkeeping. (Live preview/editing already uses
// the Sanity Live Content API via `SanityLive`; this covers cached production
// pages built with the plain client.)
type WebhookPayload = { _type?: string };

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    );

    if (!isValidSignature) {
      return new NextResponse("Invalid signature", { status: 401 });
    }

    // Revalidate everything under the root layout.
    revalidatePath("/", "layout");

    return NextResponse.json({ revalidated: true, type: body?._type ?? null });
  } catch (err) {
    console.error("Revalidate webhook error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new NextResponse(message, { status: 500 });
  }
}
