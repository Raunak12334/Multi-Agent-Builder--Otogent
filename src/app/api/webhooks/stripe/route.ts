import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sendWorkflowExecution } from "@/inngest/utils";

let stripeClient: Stripe | null = null;

const getStripeConfig = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    return null;
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }

  return {
    stripe: stripeClient,
    endpointSecret: webhookSecret,
  };
};

export async function POST(request: NextRequest) {
  try {
    const stripeConfig = getStripeConfig();

    if (!stripeConfig) {
      return NextResponse.json(
        { success: false, error: "Stripe webhook is not configured" },
        { status: 503 },
      );
    }

    const body = await request.text();
    const signature = request.headers.get("stripe-signature");
    const { stripe, endpointSecret } = stripeConfig;

    if (!signature) {
      return NextResponse.json(
        { success: false, error: "Missing Stripe signature" },
        { status: 400 },
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { success: false, error: "Webhook signature verification failed" },
        { status: 400 },
      );
    }

    const url = new URL(request.url);
    const workflowId = url.searchParams.get("workflowId");

    if (!workflowId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required query parameter: workflowId",
        },
        { status: 400 },
      );
    }

    const stripeData = {
      // Event metadata
      eventId: event.id,
      eventType: event.type,
      timestamp: event.created,
      livemode: event.livemode,
      raw: event.data.object,
    };

    // Trigger an Inngest job
    await sendWorkflowExecution({
      workflowId,
      initialData: {
        stripe: stripeData,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process Stripe event" },
      { status: 500 },
    );
  }
}
