import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Toggle tier for demo
    const current = await prisma.subscription.findUnique({ where: { userId } });

    if (!current) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    const newTier = current.tier === "FREE" ? "PREMIUM" : "FREE";
    const newLimit = newTier === "PREMIUM" ? 50 : 3;

    const subscription = await prisma.subscription.update({
      where: { userId },
      data: {
        tier: newTier,
        aiMessagesLimit: newLimit,
      },
    });

    return NextResponse.json({
      tier: subscription.tier,
      aiMessagesLimit: subscription.aiMessagesLimit,
      message: `Subscription ${newTier === "PREMIUM" ? "upgraded" : "downgraded"} to ${newTier}`,
    });
  } catch (error) {
    console.error("Subscription upgrade error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
