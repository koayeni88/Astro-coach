import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST — like/unlike a chat message
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messageId } = await req.json();

    if (!messageId) {
      return NextResponse.json({ error: "Message ID required" }, { status: 400 });
    }

    const msg = await prisma.chatMessage.findFirst({
      where: { id: messageId, userId: session.user.id },
    });

    if (!msg) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    const updated = await prisma.chatMessage.update({
      where: { id: messageId },
      data: { liked: !msg.liked },
    });

    return NextResponse.json({ liked: updated.liked });
  } catch (error) {
    console.error("Chat like error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
