import { NextRequest, NextResponse } from "next/server";
import { SIGN_PROFILES } from "@/lib/content";
import { getSignData } from "@/lib/zodiac-data";
import { isValidSign } from "@/lib/zodiac";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sign = searchParams.get("sign");

  if (!sign || !isValidSign(sign)) {
    return NextResponse.json({ error: "Invalid sign" }, { status: 400 });
  }

  // Return rich zodiac data if available, with basic profile as fallback
  const richData = getSignData(sign);
  if (richData) {
    return NextResponse.json({ ...richData, _source: "rich" });
  }

  return NextResponse.json({ ...SIGN_PROFILES[sign], _source: "basic" });
}
