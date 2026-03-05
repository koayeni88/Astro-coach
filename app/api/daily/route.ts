import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSubscriptionWithDailyReset } from "@/lib/subscription";
import { ZodiacSign } from "@/lib/zodiac";
import { getFallbackDailyReading } from "@/lib/content";
import { getDailyAffirmation } from "@/lib/readings";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found. Complete onboarding first." },
        { status: 404 }
      );
    }

    // Check for existing reading
    let reading = await prisma.dailyReading.findUnique({
      where: { userId_date: { userId: session.user.id, date } },
    });

    // If no reading exists, generate a fallback one
    if (!reading) {
      const fallback = getFallbackDailyReading(profile.sign as ZodiacSign, date);
      reading = await prisma.dailyReading.create({
        data: {
          userId: session.user.id,
          date,
          sign: profile.sign,
          ...fallback,
        },
      });
    }

    // Gating: free users get limited reading
    const subscription = await getSubscriptionWithDailyReset(session.user.id);
    const isFree = subscription.tier === "FREE";

    // Add affirmation
    const affirmation = reading.affirmation || getDailyAffirmation(profile.sign as ZodiacSign);

    if (isFree) {
      return NextResponse.json({
        ...reading,
        readingText: reading.readingText.split(".").slice(0, 2).join(".") + ".",
        action: "Upgrade to Premium for your full daily action step ✨",
        avoid: "Upgrade to Premium for your full daily guidance ✨",
        affirmation,
        isGated: true,
      });
    }

    return NextResponse.json({ ...reading, affirmation, isGated: false });
  } catch (error) {
    console.error("Daily reading error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
