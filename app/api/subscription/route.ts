import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getSubscriptionWithDailyReset } from "@/lib/subscription";

/** GET — return current subscription info */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sub = await getSubscriptionWithDailyReset(session.user.id);

    return NextResponse.json({
      tier: sub.tier,
      aiMessagesLimit: sub.aiMessagesLimit,
      aiMessagesUsedToday: sub.aiMessagesUsedToday,
    });
  } catch (error) {
    console.error("Subscription GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
