import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getZodiacSign, ZodiacSign, isValidSign } from "@/lib/zodiac";
import { COMPATIBILITY, SIGN_PROFILES } from "@/lib/content";
import { chatCompletion } from "@/lib/openai";
import { buildCompatibilityPrompt, SYSTEM_PROMPT } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const body = await req.json();
    let otherSign: ZodiacSign;

    if (body.otherSign && isValidSign(body.otherSign)) {
      otherSign = body.otherSign;
    } else if (body.otherBirthDate) {
      otherSign = getZodiacSign(body.otherBirthDate);
    } else {
      return NextResponse.json(
        { error: "Provide otherSign or otherBirthDate" },
        { status: 400 }
      );
    }

    const userSign = profile.sign as ZodiacSign;
    const compatibility = COMPATIBILITY[userSign];
    const otherProfile = SIGN_PROFILES[otherSign];

    // Check static compatibility data
    const friendMatch = compatibility.bestFriends.find((f) => f.sign === otherSign);
    const romanceMatch = compatibility.bestRomance.find((r) => r.sign === otherSign);

    // Try AI compatibility reading
    let aiReading: string | null = null;
    if (process.env.OPENAI_API_KEY) {
      aiReading = await chatCompletion(SYSTEM_PROMPT, [
        { role: "user", content: buildCompatibilityPrompt(userSign, otherSign) },
      ]);
    }

    // Fallback compatibility text
    const fallbackReading = `${userSign} and ${otherSign} bring together ${SIGN_PROFILES[userSign].strengths[0].toLowerCase()} and ${otherProfile.strengths[0].toLowerCase()} energies. This pairing can create a ${friendMatch ? "naturally harmonious" : "growth-oriented"} dynamic. ${userSign}'s ${SIGN_PROFILES[userSign].strengths[1].toLowerCase()} nature pairs ${romanceMatch ? "beautifully" : "interestingly"} with ${otherSign}'s ${otherProfile.strengths[1].toLowerCase()} approach. The key to this connection is respecting each other's differences and finding common ground.`;

    const readingText = aiReading || fallbackReading;

    // Persist compatibility check to history
    await prisma.compatibilityCheck.create({
      data: {
        userId: session.user.id,
        userSign,
        otherSign,
        reading: readingText,
        isBestFriend: !!friendMatch,
        isBestRomance: !!romanceMatch,
      },
    });

    return NextResponse.json({
      userSign,
      otherSign,
      otherProfile: {
        overview: otherProfile.overview,
        strengths: otherProfile.strengths,
      },
      isBestFriend: !!friendMatch,
      friendReason: friendMatch?.reason || null,
      isBestRomance: !!romanceMatch,
      romanceReason: romanceMatch?.reason || null,
      reading: readingText,
      bestFriends: compatibility.bestFriends,
      bestRomance: compatibility.bestRomance,
    });
  } catch (error) {
    console.error("Compatibility error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET compatibility history
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const checks = await prisma.compatibilityCheck.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ checks });
  } catch (error) {
    console.error("Compatibility history error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
