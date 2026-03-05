import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET journal entries
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "30");

    const entries = await prisma.journalEntry.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
      take: limit,
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Journal GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — create/update journal entry
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, prompt, mood, date } = await req.json();
    
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const entryDate = date || new Date().toISOString().split("T")[0];
    
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    const entry = await prisma.journalEntry.upsert({
      where: { userId_date: { userId: session.user.id, date: entryDate } },
      update: {
        content: content.trim(),
        prompt,
        mood,
      },
      create: {
        userId: session.user.id,
        date: entryDate,
        content: content.trim(),
        prompt,
        mood,
        sign: profile?.sign,
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Journal POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
