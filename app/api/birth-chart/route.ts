import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateBirthChart } from "@/lib/birth-chart";
import { ZodiacSign, ZODIAC_SIGNS } from "@/lib/zodiac";

const SIGN_ELEMENTS: Record<ZodiacSign, string> = {
  Aries: "fire", Taurus: "earth", Gemini: "air", Cancer: "water",
  Leo: "fire", Virgo: "earth", Libra: "air", Scorpio: "water",
  Sagittarius: "fire", Capricorn: "earth", Aquarius: "air", Pisces: "water",
};

const SIGN_MODALITIES: Record<ZodiacSign, string> = {
  Aries: "cardinal", Taurus: "fixed", Gemini: "mutable", Cancer: "cardinal",
  Leo: "fixed", Virgo: "mutable", Libra: "cardinal", Scorpio: "fixed",
  Sagittarius: "mutable", Capricorn: "cardinal", Aquarius: "fixed", Pisces: "mutable",
};

// GET birth chart
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
      return NextResponse.json({ error: "Profile required" }, { status: 400 });
    }

    const chart = calculateBirthChart(
      profile.birthDate,
      profile.sign as ZodiacSign,
      profile.birthTime || undefined,
      profile.birthPlace || undefined
    );

    // Persist moon/rising if not set
    if (!profile.moonSign && chart.moonSign) {
      await prisma.profile.update({
        where: { userId: session.user.id },
        data: { moonSign: chart.moonSign, risingSign: chart.risingSign },
      });
    }

    // Build elemental balance & modality counts from the Big Three placements
    const placements: ZodiacSign[] = [chart.sunSign];
    if (chart.moonSign) placements.push(chart.moonSign);
    if (chart.risingSign) placements.push(chart.risingSign);

    const elements = { fire: 0, earth: 0, air: 0, water: 0 };
    const modality = { cardinal: 0, fixed: 0, mutable: 0 };

    for (const sign of placements) {
      const el = SIGN_ELEMENTS[sign] as keyof typeof elements;
      const mod = SIGN_MODALITIES[sign] as keyof typeof modality;
      elements[el]++;
      modality[mod]++;
    }

    // Build the response the page expects
    const responseChart = {
      sunSign: chart.sunSign,
      moonSign: chart.moonSign,
      risingSign: chart.risingSign,
      elements,
      modality,
    };

    return NextResponse.json({
      chart: responseChart,
      profile: {
        sign: profile.sign,
        birthDate: profile.birthDate,
        birthTime: profile.birthTime,
        birthPlace: profile.birthPlace,
      },
    });
  } catch (error) {
    console.error("Birth chart GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
