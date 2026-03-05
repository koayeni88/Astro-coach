import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getReflectionPrompt } from "@/lib/readings";
import { ZodiacSign } from "@/lib/zodiac";

// GET daily reflection prompt for journaling
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

    const prompt = getReflectionPrompt(profile.sign as ZodiacSign);

    return NextResponse.json({ prompt, sign: profile.sign });
  } catch (error) {
    console.error("Journal prompt GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
