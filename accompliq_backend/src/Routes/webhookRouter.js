import express from "express";
import Stripe from "stripe";
import Subscription from "../Modals/subscription-model.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const webhookRouter = express.Router();

webhookRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {}

    // Handle the payment succeeded event
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;
      const userId = invoice.customer;

      // Update subscription in the DB
      const subscription = await Subscription.findOne({
        where: { stripe_subscription_id: subscriptionId },
      });

      if (subscription) {
        await subscription.update({
          status: "active",
          current_period_start: new Date(invoice.current_period_start * 1000),
          current_period_end: invoice.current_period_end
            ? new Date(invoice.current_period_end * 1000)
            : null,
        });
      }
    }

    // Handle the payment failed event
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;
      const userId = invoice.customer;
      const failureMessage = invoice.failure_message;
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  }
);

export default webhookRouter;
