import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getWeeklyReading } from "@/lib/readings";
import { ZodiacSign } from "@/lib/zodiac";

// GET weekly reading
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile?.sign) {
      return NextResponse.json({ error: "Profile sign required" }, { status: 400 });
    }

    const { getWeekNumber } = await import("@/lib/readings");
    const week = getWeekNumber(new Date());
    const reading = getWeeklyReading(profile.sign as ZodiacSign, week);

    return NextResponse.json({ reading, sign: profile.sign });
  } catch (error) {
    console.error("Weekly GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
