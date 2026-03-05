import { prisma } from "./prisma";

/**
 * Check and reset daily AI message count if the date has changed.
 * Returns the current subscription with updated counts.
 */
export async function getSubscriptionWithDailyReset(userId: string) {
  const today = new Date().toISOString().split("T")[0];

  let subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    subscription = await prisma.subscription.create({
      data: {
        userId,
        tier: "FREE",
        aiMessagesLimit: 3,
        aiMessagesUsedToday: 0,
        lastResetDate: today,
      },
    });
  }

  // Reset daily count if date changed
  if (subscription.lastResetDate !== today) {
    subscription = await prisma.subscription.update({
      where: { userId },
      data: {
        aiMessagesUsedToday: 0,
        lastResetDate: today,
      },
    });
  }

  return subscription;
}

export function canSendMessage(subscription: { aiMessagesUsedToday: number; aiMessagesLimit: number }) {
  return subscription.aiMessagesUsedToday < subscription.aiMessagesLimit;
}

export async function incrementMessageCount(userId: string) {
  return prisma.subscription.update({
    where: { userId },
    data: {
      aiMessagesUsedToday: { increment: 1 },
    },
  });
}
