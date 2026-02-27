import { NextResponse, type NextRequest } from "next/server";
import { cronService } from "@/server/services/cron.service";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("authorization");

  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await cronService.cleanupSoftDeletes();

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Cron] Cleanup failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
