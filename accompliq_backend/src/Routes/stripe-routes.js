import express from "express";
import {
  attachPaymentMethod,
  cancelSubscription,
  changeSubscriptionPlan,
  createCustomer,
  createSetupIntent,
  createSubscription,
  getSubscription,
  listInvoices,
  listPlans,
  resumeSubscription,
  getActivePlan,
  inviteFamilyMembers,
  getFamilyMembers,
  resendInvite,
  removeMember,
  getActivePlans,
} from "../Controllers/stripeController.js";

const stripeRouter = express.Router();

stripeRouter.post("/create-customer", createCustomer);
stripeRouter.post("/create-setup-intent", createSetupIntent);
stripeRouter.post("/attach-payment-method", attachPaymentMethod);
stripeRouter.post("/create-subscription", createSubscription);
stripeRouter.get("/subscription/:id", getSubscription);
stripeRouter.get("/invoices/:customerId", listInvoices);
stripeRouter.post("/cancel-subscription", cancelSubscription);
stripeRouter.post("/resume-subscription", resumeSubscription);
stripeRouter.post("/change-subscription-plan", changeSubscriptionPlan);
stripeRouter.get("/get-plans", listPlans);
stripeRouter.get("/active-plan/:userId", getActivePlan);
stripeRouter.get("/active-plans/:userId", getActivePlans);
stripeRouter.post("/invite-family-members", inviteFamilyMembers);
stripeRouter.get("/get-members/:inviterId", getFamilyMembers);
stripeRouter.post("/resend-invite", resendInvite);
stripeRouter.post("/remove-member", removeMember);

export default stripeRouter;
