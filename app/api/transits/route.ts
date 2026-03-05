import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getCurrentTransits, getRetrogrades } from "@/lib/birth-chart";

// GET current transits + retrogrades
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transits = getCurrentTransits();
    const retrogrades = getRetrogrades();

    return NextResponse.json({ transits, retrogrades });
  } catch (error) {
    console.error("Transits GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
