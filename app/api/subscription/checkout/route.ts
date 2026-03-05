import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getStripe, STRIPE_PRICES } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// Create a Stripe checkout session
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stripe = getStripe();
    if (!stripe) {
      // Fallback: demo mode — just toggle the tier
      return handleDemoUpgrade(session.user.id);
    }

    const body = await req.json();
    const billingCycle = body.billingCycle === "annual" ? "annual" : "monthly";
    const priceId = billingCycle === "annual" ? STRIPE_PRICES.annual : STRIPE_PRICES.monthly;

    if (!priceId) {
      return handleDemoUpgrade(session.user.id);
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    // Create or reuse Stripe customer
    let customerId = subscription?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name || undefined,
        metadata: { userId: session.user.id },
      });
      customerId = customer.id;

      await prisma.subscription.update({
        where: { userId: session.user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXTAUTH_URL}/settings?upgraded=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/settings?cancelled=true`,
      subscription_data: {
        trial_period_days: 7,
        metadata: { userId: session.user.id },
      },
      metadata: { userId: session.user.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Demo upgrade when Stripe is not configured
async function handleDemoUpgrade(userId: string) {
  const current = await prisma.subscription.findUnique({ where: { userId } });
  if (!current) {
    return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
  }

  const newTier = current.tier === "FREE" ? "PREMIUM" : "FREE";
  const newLimit = newTier === "PREMIUM" ? 50 : 3;

  const subscription = await prisma.subscription.update({
    where: { userId },
    data: {
      tier: newTier,
      aiMessagesLimit: newLimit,
      trialEndsAt: newTier === "PREMIUM" ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null,
    },
  });

  return NextResponse.json({
    tier: subscription.tier,
    aiMessagesLimit: subscription.aiMessagesLimit,
    message: `Subscription ${newTier === "PREMIUM" ? "upgraded" : "downgraded"} to ${newTier}`,
    demo: true,
  });
}
