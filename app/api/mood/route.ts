import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET mood entries
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "30");

    const entries = await prisma.moodEntry.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
      take: limit,
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Mood GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — log mood for today
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mood, energy, notes } = await req.json();

    if (!mood || typeof mood !== "string") {
      return NextResponse.json({ error: "Mood is required" }, { status: 400 });
    }

    const today = new Date().toISOString().split("T")[0];

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    const entry = await prisma.moodEntry.upsert({
      where: { userId_date: { userId: session.user.id, date: today } },
      update: { mood, energy: energy || 5, note: notes || null },
      create: {
        userId: session.user.id,
        date: today,
        mood,
        energy: energy || 5,
        note: notes || null,
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Mood POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
