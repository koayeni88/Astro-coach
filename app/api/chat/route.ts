import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { chatMessageSchema } from "@/lib/validators";
import { chatCompletion } from "@/lib/openai";
import { buildChatPrompt } from "@/lib/prompts";
import { ZodiacSign } from "@/lib/zodiac";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  getSubscriptionWithDailyReset,
  canSendMessage,
  incrementMessageCount,
} from "@/lib/subscription";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Rate limit check
    const rateCheck = checkRateLimit(userId);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait.", retryAfter: rateCheck.retryAfter },
        { status: 429 }
      );
    }

    // Subscription / daily limit check
    const subscription = await getSubscriptionWithDailyReset(userId);
    if (!canSendMessage(subscription)) {
      return NextResponse.json(
        {
          error: "Daily message limit reached",
          requiresUpgrade: subscription.tier === "FREE",
          limit: subscription.aiMessagesLimit,
          used: subscription.aiMessagesUsedToday,
        },
        { status: 402 }
      );
    }

    // Validate input
    const body = await req.json();
    const parsed = chatMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { message } = parsed.data;

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found. Complete onboarding first." },
        { status: 404 }
      );
    }

    // Get or create conversation
    const conversationId = parsed.data.conversationId || null;
    if (conversationId) {
      const convo = await prisma.conversation.findFirst({
        where: { id: conversationId, userId },
      });
      if (!convo) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
      }
    }

    // Save user message
    await prisma.chatMessage.create({
      data: { userId, role: "user", content: message, conversationId },
    });

    // Get last 10 messages for context (within conversation or global)
    const recentMessages = await prisma.chatMessage.findMany({
      where: { userId, ...(conversationId ? { conversationId } : {}) },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const chatHistory = recentMessages.reverse().map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    // Build system prompt with user context
    const systemPrompt = buildChatPrompt(
      profile.sign as ZodiacSign,
      profile.focusArea,
      profile.mood,
      profile.struggle
    );

    // Try OpenAI
    let reply = await chatCompletion(systemPrompt, chatHistory);

    // Fallback if no API key or API fails
    if (!reply) {
      const sign = profile.sign;
      reply = `As a ${sign}, your ${profile.focusArea} focus resonates with your natural ${sign} energy. Given that you're feeling ${profile.mood} right now, I'd encourage you to lean into your sign's strengths. Remember, every ${sign} has the innate ability to navigate through ${profile.struggle !== "none" ? profile.struggle : "challenges"} with grace. Take a moment today to connect with what truly matters to you. The stars remind you that you're exactly where you need to be on your journey. 🌟`;
    }

    // Save assistant reply
    const assistantMessage = await prisma.chatMessage.create({
      data: { userId, role: "assistant", content: reply, conversationId },
    });

    // Update conversation timestamp if applicable
    if (conversationId) {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });
    }

    // Increment usage
    await incrementMessageCount(userId);
    const updatedSub = await getSubscriptionWithDailyReset(userId);

    return NextResponse.json({
      reply,
      messageId: assistantMessage.id,
      messagesUsed: updatedSub.aiMessagesUsedToday,
      messagesLimit: updatedSub.aiMessagesLimit,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    const messages = await prisma.chatMessage.findMany({
      where: { 
        userId: session.user.id,
        ...(conversationId ? { conversationId } : {}),
      },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Chat GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
