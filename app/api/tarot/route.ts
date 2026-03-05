import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getDailyTarotCard, getTarotCards } from "@/lib/birth-chart";

// GET tarot card(s) — pass ?count=N for a multi-card spread (1-10)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const countParam = req.nextUrl.searchParams.get("count");
    const count = countParam ? Math.max(1, Math.min(Number(countParam) || 1, 10)) : 1;

    if (count === 1) {
      const card = getDailyTarotCard();
      return NextResponse.json({ card, cards: [card] });
    }

    const cards = getTarotCards(count);
    return NextResponse.json({ card: cards[0], cards });
  } catch (error) {
    console.error("Tarot GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
