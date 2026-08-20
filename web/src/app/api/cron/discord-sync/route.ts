import { NextResponse, type NextRequest } from "next/server";
import { syncEventsToDiscord } from "@/lib/discordSync";

// Triggered on a schedule by Vercel Cron (see vercel.json). Vercel signs cron
// requests with `Authorization: Bearer $CRON_SECRET` when CRON_SECRET is set
// on the project, so the same value is checked here to reject direct calls.
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const summary = await syncEventsToDiscord();
    return NextResponse.json(summary);
  } catch (err) {
    console.error("Discord sync error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new NextResponse(message, { status: 500 });
  }
}
