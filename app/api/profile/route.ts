import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validators";
import { getZodiacSign } from "@/lib/zodiac";
import { calculateBirthChart } from "@/lib/birth-chart";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { birthDate, focusArea, mood, struggle } = parsed.data;
    const birthTime = body.birthTime || null;
    const birthPlace = body.birthPlace || null;
    const sign = getZodiacSign(birthDate);

    // Calculate moon/rising signs if birth time provided
    let moonSign: string | null = null;
    let risingSign: string | null = null;

    if (birthTime) {
      const chart = calculateBirthChart(birthDate, birthTime, birthPlace || undefined);
      moonSign = chart.moonSign || null;
      risingSign = chart.risingSign || null;
    }

    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: { 
        birthDate, sign, focusArea, mood, struggle,
        birthTime, birthPlace, moonSign, risingSign,
      },
      create: {
        userId: session.user.id,
        birthDate, sign, focusArea, mood, struggle,
        birthTime, birthPlace, moonSign, risingSign,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
