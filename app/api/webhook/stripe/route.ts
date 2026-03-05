import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as { subscription?: string; metadata?: { userId?: string } };
        if (session.subscription && session.metadata?.userId) {
          const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription as string);
          await prisma.subscription.update({
            where: { userId: session.metadata.userId },
            data: {
              tier: "PREMIUM",
              aiMessagesLimit: 50,
              stripeSubscriptionId: stripeSubscription.id,
              stripePriceId: (stripeSubscription as unknown as { items: { data: Array<{ price: { id: string } }> } }).items.data[0]?.price.id,
              stripeCurrentPeriodEnd: new Date((stripeSubscription as unknown as { current_period_end: number }).current_period_end * 1000),
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as unknown as {
          id: string;
          status: string;
          current_period_end: number;
          items: { data: Array<{ price: { id: string } }> };
        };
        const sub = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });
        if (sub) {
          const isActive = ["active", "trialing"].includes(subscription.status);
          await prisma.subscription.update({
            where: { id: sub.id },
            data: {
              tier: isActive ? "PREMIUM" : "FREE",
              aiMessagesLimit: isActive ? 50 : 3,
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
              stripePriceId: subscription.items.data[0]?.price.id,
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as { id: string };
        const sub = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });
        if (sub) {
          await prisma.subscription.update({
            where: { id: sub.id },
            data: {
              tier: "FREE",
              aiMessagesLimit: 3,
              stripeSubscriptionId: null,
              stripePriceId: null,
              stripeCurrentPeriodEnd: null,
            },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
