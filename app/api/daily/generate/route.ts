import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ZodiacSign } from "@/lib/zodiac";
import { getFallbackDailyReading } from "@/lib/content";
import { generateStructuredJSON } from "@/lib/openai";
import { SYSTEM_PROMPT, buildDailyReadingPrompt } from "@/lib/prompts";
import { getSubscriptionWithDailyReset } from "@/lib/subscription";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Server-side tier check — only PREMIUM users can regenerate
    const subscription = await getSubscriptionWithDailyReset(session.user.id);
    if (subscription.tier !== "PREMIUM") {
      return NextResponse.json(
        { error: "Regenerate is a Pro feature. Upgrade to access." },
        { status: 403 }
      );
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found. Complete onboarding first." },
        { status: 404 }
      );
    }

    const today = new Date().toISOString().split("T")[0];
    const sign = profile.sign as ZodiacSign;

    // Try OpenAI first, fall back to static content
    let readingData: Record<string, string> | null = null;

    if (process.env.OPENAI_API_KEY) {
      const prompt = buildDailyReadingPrompt(
        sign,
        profile.focusArea,
        profile.mood,
        profile.struggle,
        today
      );
      readingData = await generateStructuredJSON(SYSTEM_PROMPT, prompt);
    }

    // Fallback to deterministic template
    if (!readingData) {
      readingData = getFallbackDailyReading(sign, today);
    }

    // Upsert the reading
    const reading = await prisma.dailyReading.upsert({
      where: { userId_date: { userId: session.user.id, date: today } },
      update: {
        quote: readingData.quote || "",
        theme: readingData.theme || "",
        readingText: readingData.readingText || "",
        action: readingData.action || "",
        avoid: readingData.avoid || "",
      },
      create: {
        userId: session.user.id,
        date: today,
        sign: profile.sign,
        quote: readingData.quote || "",
        theme: readingData.theme || "",
        readingText: readingData.readingText || "",
        action: readingData.action || "",
        avoid: readingData.avoid || "",
      },
    });

    return NextResponse.json(reading);
  } catch (error) {
    console.error("Generate daily error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
