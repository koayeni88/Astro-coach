import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET streaks
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date().toISOString().split("T")[0];
    
    let streak = await prisma.streak.findUnique({
      where: { userId: session.user.id },
    });

    if (!streak) {
      streak = await prisma.streak.create({
        data: {
          userId: session.user.id,
          currentStreak: 1,
          longestStreak: 1,
          lastVisitDate: today,
          totalVisits: 1,
        },
      });
      return NextResponse.json(streak);
    }

    // Update streak based on visit
    const lastVisit = streak.lastVisitDate;
    if (lastVisit === today) {
      // Already visited today
      return NextResponse.json(streak);
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let newStreak = streak.currentStreak;
    if (lastVisit === yesterdayStr) {
      newStreak += 1; // Continue streak
    } else {
      newStreak = 1; // Reset streak
    }

    const longestStreak = Math.max(streak.longestStreak, newStreak);

    streak = await prisma.streak.update({
      where: { userId: session.user.id },
      data: {
        currentStreak: newStreak,
        longestStreak,
        lastVisitDate: today,
        totalVisits: streak.totalVisits + 1,
      },
    });

    return NextResponse.json(streak);
  } catch (error) {
    console.error("Streak error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
