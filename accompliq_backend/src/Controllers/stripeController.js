import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import { v4 as uuidv4 } from "uuid";
import User from "../Modals/user-model.js";
import jwt from "jsonwebtoken";
import FamilyInvite from "../Modals/family-invite-model.js";
import sendEmail from "../utils/emailSender.js";
import Subscription from "../Modals/subscription-model.js";

// Create Customer
export const createCustomer = async (req, res) => {
  try {
    const { email, name } = req.body;
    const customer = await stripe.customers.create({ email, name });
    res.json({ customerId: customer.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Create Setup Intent (for saving a card)
export const createSetupIntent = async (req, res) => {
  try {
    const { customerId } = req.body;
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
    });
    res.json({ clientSecret: setupIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Attach Payment Method to Customer & Set as Default
export const attachPaymentMethod = async (req, res) => {
  try {
    const { customerId, paymentMethodId } = req.body;
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Create Subscription
export const createSubscription = async (req, res) => {
  try {
    const { customerId, priceId, paymentMethodId, userId, isFamilyPlan } =
      req.body;

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      cancel_at_period_end: false,
    });

    // Validate and fix the dates before saving
    const currentPeriodStart = subscription.current_period_start
      ? new Date(subscription.current_period_start * 1000)
      : new Date(); // default to current date if invalid

    const currentPeriodEnd = subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000)
      : null; // null if not available

    // Save the subscription details in the database
    if (userId) {
      const user = await User.findByPk(userId);
      if (user) {
        // Create subscription record in DB
        await Subscription.create({
          userId: user.id,
          stripe_subscription_id: subscription.id,
          priceId: priceId,
          status: subscription.status,
          current_period_start: currentPeriodStart,
          current_period_end: currentPeriodEnd,
          familyPlan: isFamilyPlan || false,
        });

        // Update user with subscription details
        await user.update({
          stripeCustomerId: customerId,
          stripeDefaultPaymentMethodId: paymentMethodId,
          stripeSubscriptionId: subscription.id,
          profileCompleted: "completed",
        });
      } else {
        console.warn("[STRIPE][Subscription] User not found for update", {
          userId,
        });
      }
    } else {
      console.warn("[STRIPE][Subscription] No userId in request");
    }

    res.json(subscription);
  } catch (error) {
    console.error("[STRIPE][Subscription][ERROR]", error);
    res.status(400).json({ error: error.message });
  }
};

// Get Subscription Details
export const getSubscription = async (req, res) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(req.params.id);
    res.json(subscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// List Invoices for a Customer
export const listInvoices = async (req, res) => {
  try {
    const invoices = await stripe.invoices.list({
      customer: req.params.customerId,
      limit: 10,
    });
    res.json(invoices);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cancel a Subscription
export const cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    const deleted = await stripe.subscriptions.cancel(subscriptionId);

    res.json(deleted);
  } catch (error) {
    console.error("Error in cancelSubscription:", error); // Add error log
    res.status(400).json({ error: error.message });
  }
};

// Resume a Subscription (if within the grace period)
export const resumeSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });
    res.json(subscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Upgrade or Downgrade Plan
export const changeSubscriptionPlan = async (req, res) => {
  try {
    const { subscriptionId, newPriceId, userId } = req.body;

    // 1. Retrieve Subscription from DB
    const dbSub = await Subscription.findOne({
      where: { stripe_subscription_id: subscriptionId, userId },
    });

    // If no subscription exists, create a new one
    if (!dbSub) {
      // Create a new subscription for the user if they don't have an active subscription
      const newSubscription = await stripe.subscriptions.create({
        customer: userId,  // Use user's stripe customer ID
        items: [{ price: newPriceId }],
        cancel_at_period_end: false,
      });

      // Create the subscription in the DB as well
      await Subscription.create({
        userId: userId,
        stripe_subscription_id: newSubscription.id,
        priceId: newPriceId,
        status: newSubscription.status,
        current_period_start: new Date(newSubscription.current_period_start * 1000),
        current_period_end: new Date(newSubscription.current_period_end * 1000),
        familyPlan: false, // Or true, based on your logic
      });

      return res.json(newSubscription);  // Return the new subscription
    }

    // If a subscription exists, check for recent plan change
    if (dbSub.last_plan_change_at) {
      const now = new Date();
      const lastChange = new Date(dbSub.last_plan_change_at);
      const diffHours = Math.abs(now - lastChange) / 36e5;

      if (diffHours < 24) {
        if (dbSub.last_plan_change_type === "upgrade") {
          return res
            .status(400)
            .json({ message: "Your upgrade request is already in process." });
        }
        if (dbSub.last_plan_change_type === "downgrade") {
          return res.status(400).json({
            message: "Your downgrade request is already in process.",
          });
        }
      }
    }

    // Get old & new plan price for type determination
    const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);
    const currentPriceId = stripeSub.items.data[0].price.id;
    const currentPriceObj = await stripe.prices.retrieve(currentPriceId);
    const newPriceObj = await stripe.prices.retrieve(newPriceId);

    let changeType = "upgrade";
    if (newPriceObj.unit_amount < currentPriceObj.unit_amount)
      changeType = "downgrade";

    // Update Stripe subscription with proration behavior
    const updatedSub = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
      items: [{ id: stripeSub.items.data[0].id, price: newPriceId }],
      proration_behavior: "create_prorations", // This ensures proration happens
    });

    // Update DB subscription
    await dbSub.update({
      price: newPriceId,
      last_plan_change_type: changeType,
      last_plan_change_at: new Date().toISOString(),
    });

    return res.json(updatedSub);
  } catch (error) {
    console.error("[Plan Change] Error:", error);
    return res.status(400).json({ error: error.message });
  }
};


export const listPlans = async (req, res) => {
  try {
    const prices = await stripe.prices.list({
      active: true,
      expand: ["data.product"],
    });
    const formatted = prices.data.map((price) => ({
      value: price.id,
      label: price.product.name,
      price: (price.unit_amount / 100).toFixed(2),
      description: price.product.description || "No description provided",
    }));
    res.json(formatted);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Active plan api

export const getActivePlan = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: "No userId provided" });
    }

    const user = await User.findByPk(userId);
    if (!user || !user.stripeSubscriptionId) {
      return res.status(404).json({ error: "No active subscription" });
    }

    const subscription = await stripe.subscriptions.retrieve(
      user.stripeSubscriptionId,
      { expand: ["items.data.price.product"] }
    );

    if (!subscription || subscription.status !== "active") {
      return res.status(404).json({ error: "No active subscription" });
    }

    const item = subscription.items.data[0];
    const planMeta = item.price;

    // Fallback for timestamps
    const planStartTimestamp =
      subscription.current_period_start || subscription.start_date || null;
    const planEndTimestamp = subscription.current_period_end || null;

    // Format timestamps
    const planStart = planStartTimestamp
      ? new Date(planStartTimestamp * 1000).toISOString()
      : null;
    const planEnd = planEndTimestamp
      ? new Date(planEndTimestamp * 1000).toISOString()
      : null;

    return res.json({
      subscriptionId: subscription.id,
      planId: planMeta.id,
      planStatus: subscription.status,
      planInterval: planMeta.recurring?.interval,
      planStart,
      planEnd,
      planMeta,
      planName: planMeta.product?.name || "Unnamed Plan",
    });
  } catch (error) {
    console.error("[ActivePlanAPI] Unexpected error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get Multiple Active Plans for a User
export const getActivePlans = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: "No userId provided" });
    }

    const user = await User.findByPk(userId);
    if (!user || !user.stripeCustomerId) {
      return res.status(404).json({ error: "No active subscriptions found" });
    }

    // Fetch all subscriptions for the user (active status)
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active',
      expand: ['data.items.data.price.product'],
    });

    if (!subscriptions || subscriptions.data.length === 0) {
      return res.status(404).json({ error: "No active subscriptions found" });
    }

    const activePlans = subscriptions.data.map((subscription) => {
      const item = subscription.items.data[0];
      const planMeta = item.price;

      // Format timestamps
      const planStartTimestamp = subscription.current_period_start || subscription.start_date || null;
      const planEndTimestamp = subscription.current_period_end || null;

      const planStart = planStartTimestamp ? new Date(planStartTimestamp * 1000).toISOString() : null;
      const planEnd = planEndTimestamp ? new Date(planEndTimestamp * 1000).toISOString() : null;

      return {
        subscriptionId: subscription.id,
        planId: planMeta.id,
        planStatus: subscription.status,
        planInterval: planMeta.recurring?.interval,
        planStart,
        planEnd,
        planMeta,
        planName: planMeta.product?.name || "Unnamed Plan",
      };
    });

    return res.json({ activePlans });
  } catch (error) {
    console.error("[ActivePlansAPI] Unexpected error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const inviteFamilyMembers = async (req, res) => {
  try {
    const { inviterId, inviteeEmails } = req.body;

    // 1. Check inviter existence and family plan status
    const inviter = await User.findByPk(inviterId);
    if (!inviter) {
      return res.status(404).json({ message: "User not found" });
    }

    const subscription = await Subscription.findOne({
      where: { userId: inviter.id, familyPlan: true },
    });

    if (!subscription) {
      return res.status(400).json({
        message: "You must be on a family plan to invite members.",
      });
    }

    // 2. Enforce 3-member limit (pending + accepted invites)
    const totalInvites = await FamilyInvite.count({
      where: {
        inviterId,
        subscriptionId: subscription.id,
        status: ["pending", "accepted"],
      },
    });
    if (totalInvites + inviteeEmails.length > 3) {
      return res.status(400).json({
        message: "You can only invite up to 3 members to the family plan.",
      });
    }

    // 3. Send invites and create invite records
    const invitesSent = [];
    const invitesSkipped = [];
    for (const email of inviteeEmails) {
      // Skip if email is already registered
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        invitesSkipped.push({ email, reason: "already_registered" });
        continue;
      }

      // Skip if invite for this email/subscription already exists (pending/accepted)
      const existingInvite = await FamilyInvite.findOne({
        where: {
          email,
          inviterId,
          subscriptionId: subscription.id,
          status: ["pending", "accepted"],
        },
      });
      if (existingInvite) {
        invitesSkipped.push({ email, reason: "already_invited" });
        continue;
      }

      // Generate a token
      const inviteToken = uuidv4();

      // Create invite record
      await FamilyInvite.create({
        inviterId: inviter.id,
        subscriptionId: subscription.id,
        email,
        token: inviteToken,
        status: "pending",
      });

      // Send invite email
      const inviteLink = `${process.env.CLIENT_URL}/signup?invite=${inviteToken}`;
      await sendEmail(
        email,
        "You're invited to join a family plan!",
        `You've been invited to join a family plan. Click here to join: ${inviteLink}`
      );

      invitesSent.push(email);
    }

    res.json({
      message: "Invitation process complete.",
      invitesSent,
      invitesSkipped,
    });
  } catch (error) {
    console.error("[Invite Members] Error:", error);
    res
      .status(500)
      .json({ message: "Error inviting members", error: error.message });
  }
};

//get members

export const getFamilyMembers = async (req, res) => {
  try {
    const { inviterId } = req.params;

    // Validate inviterId
    if (!inviterId || inviterId === "undefined") {
      console.error("[getFamilyMembers] Invalid inviter ID");
      return res.status(400).json({ error: "Invalid inviter ID" });
    }

    // Find the inviter (admin) with all needed attributes
    const inviter = await User.findByPk(inviterId, {
      attributes: [
        "id",
        "email",
        "fullName",
        "profilePicture",
        "status",
        "invitedBy",
      ],
    });

    if (!inviter) {
      console.error("[getFamilyMembers] Inviter not found");
      return res.status(404).json({ error: "Inviter not found" });
    }

    // Check if this user is actually the admin (not invited by someone else)
    if (inviter.invitedBy) {
      return res.status(403).json({
        success: false,
        error: "Only the family plan admin can view members",
      });
    }

    // Find users who were invited by this inviter (members)
    const invitedMembers = await User.findAll({
      where: { invitedBy: inviterId },
      attributes: ["id", "email", "fullName", "profilePicture", "status"],
    });

    // Find pending invites
    const pendingInvites = await FamilyInvite.findAll({
      where: {
        inviterId,
        status: "pending",
      },
      attributes: ["id", "email", "createdAt", "status"],
    });

    // Format the data with proper names
    const members = [
      // The inviter is always Admin
      {
        id: inviter.id,
        name: inviter.fullName || inviter.email.split("@")[0], // Fallback to email prefix if no name
        email: inviter.email,
        image: inviter.profilePicture,
        status: inviter.status,
        role: "Admin",
      },
      // Invited members with proper names
      ...invitedMembers.map((member) => ({
        id: member.id,
        name: member.fullName || member.email.split("@")[0], // Fallback to email prefix
        email: member.email,
        image: member.profilePicture,
        status: member.status,
        role: "Member",
      })),
    ];

    // Pending invites
    const pending = pendingInvites.map((invite) => ({
      id: invite.id,
      name: invite.email.split("@")[0], // Use email prefix for pending members
      email: invite.email,
      image: null,
      status: "pending",
      role: "Member",
    }));

    const finalMembers = [...members, ...pending];

    res.json({
      success: true,
      members: finalMembers,
    });
  } catch (error) {
    console.error("[Stripe][getFamilyMembers][ERROR]:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch invited members",
      message: error.message,
    });
  }
};

// Resend invite link
export const resendInvite = async (req, res) => {
  try {
    const { inviteId, inviterId } = req.body;

    // Find the invite
    const invite = await FamilyInvite.findOne({
      where: { id: inviteId, inviterId },
    });

    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    // Check if invite is still pending
    if (invite.status !== "pending") {
      return res.status(400).json({ message: "Invite is no longer pending" });
    }

    // Resend the email
    const inviteLink = `${process.env.CLIENT_URL}/signup?invite=${invite.token}`;
    await sendEmail(
      invite.email,
      "Reminder: You're invited to join a family plan!",
      `You've been invited to join a family plan. Click here to join: ${inviteLink}`
    );

    res.json({ success: true });
  } catch (error) {
    console.error("[Resend Invite] Error:", error);
    res
      .status(500)
      .json({ message: "Error resending invite", error: error.message });
  }
};

// Remove family member
export const removeMember = async (req, res) => {
  try {
    const { memberId, inviterId } = req.body;

    // Step 1: Find the user based on memberId and inviterId
    let member = await User.findOne({
      where: { id: memberId, invitedBy: inviterId },
    });

    if (!member) {
      // If no user found, look for a pending invite
      const invite = await FamilyInvite.findOne({
        where: { id: memberId, inviterId },
      });

      if (!invite) {
        return res.status(404).json({ message: "Member or invite not found" });
      }

      // Delete pending invite if user is not found
      await invite.destroy();
      return res.json({
        success: true,
        message: "Invite removed successfully",
      });
    }

    // Step 2: If member is found, remove associated data

    // Remove user's subscription if they have one (whether family plan or not)
    await Subscription.destroy({
      where: { userId: memberId },
    });

    // Remove the member's association (if they accepted the invite)
    await member.update({ invitedBy: null });

    // Step 3: Remove the accepted invite (if it exists)
    await FamilyInvite.destroy({
      where: {
        email: member.email,
        inviterId: inviterId,
        status: "accepted", // Remove the accepted invite
      },
    });

    // Step 4: Finally, remove the member completely from the User model
    await member.destroy(); // Delete the user completely

    // Response after successful removal
    return res.json({
      success: true,
      message: "Family member removed completely",
    });
  } catch (error) {
    console.error("[Remove Member] Error:", error);
    return res
      .status(500)
      .json({ message: "Error removing member", error: error.message });
  }
};
