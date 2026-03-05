import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET notification preferences
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let prefs = await prisma.notificationPreference.findUnique({
      where: { userId: session.user.id },
    });

    if (!prefs) {
      prefs = await prisma.notificationPreference.create({
        data: { userId: session.user.id },
      });
    }

    return NextResponse.json(prefs);
  } catch (error) {
    console.error("Notifications GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT — update notification preferences
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { emailDailyReading, emailWeeklyDigest, pushEnabled, pushSubscription } = await req.json();

    const prefs = await prisma.notificationPreference.upsert({
      where: { userId: session.user.id },
      update: {
        ...(typeof emailDailyReading === "boolean" && { emailDailyReading }),
        ...(typeof emailWeeklyDigest === "boolean" && { emailWeeklyDigest }),
        ...(typeof pushEnabled === "boolean" && { pushEnabled }),
        ...(typeof pushSubscription === "string" && { pushSubscription }),
      },
      create: {
        userId: session.user.id,
        emailDailyReading: emailDailyReading ?? true,
        emailWeeklyDigest: emailWeeklyDigest ?? true,
        pushEnabled: pushEnabled ?? false,
        pushSubscription: pushSubscription ?? null,
      },
    });

    return NextResponse.json(prefs);
  } catch (error) {
    console.error("Notifications PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
