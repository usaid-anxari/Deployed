import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../Services/Api.js";

const handleApiError = (error, rejectWithValue) => {
  if (!error.response) {
    return rejectWithValue({
      status: "network-error",
      message: "Network connection error",
      originalError: error.message,
    });
  }

  const { status, data } = error.response;
  return rejectWithValue({
    status,
    message: data?.error || data?.message || "An error occurred",
    nextStep: data?.nextStep || null,
    errors: data?.errors || null,
    timeStamp: new Date().toISOString,
  });
};

// Create Stripe Customer
export const createStripeCustomer = createAsyncThunk(
  "stripe/createCustomer",
  async ({ email, name }, { rejectWithValue }) => {
    try {
      const response = await API.post("/stripe/create-customer", {
        email,
        name,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// create setup intent
export const createSetupIntent = createAsyncThunk(
  "stripe/createSetupIntent",
  async ({ customerId }, { rejectWithValue }) => {
    try {
      const response = await API.post("/stripe/create-setup-intent", {
        customerId,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Attach payment method
export const attachPaymentMethod = createAsyncThunk(
  "stripe/attachPaymentMethod",
  async ({ customerId, paymentMethodId }, { rejectWithValue }) => {
    try {
      const response = await API.post("/stripe/attach-payment-method", {
        customerId,
        paymentMethodId,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Create subscription
export const createStripeSubscription = createAsyncThunk(
  "stripe/createSubscription",
  async (
    { customerId, priceId, paymentMethodId, userId, isFamilyPlan },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.post("/stripe/create-subscription", {
        customerId,
        priceId,
        paymentMethodId,
        userId,
        isFamilyPlan,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

//Get Subscription Details
export const getSubscription = createAsyncThunk(
  "stripe/getSubscription",
  async (subscriptionId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/stripe/subscription/${subscriptionId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// list invoices
export const listInvoices = createAsyncThunk(
  "stripe/listInvoices",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/stripe/invoices/${customerId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

//Cancel Subscription
export const cancelSubscription = createAsyncThunk(
  "stripe/cancelSubscriptions",
  async ({ subscriptionId }, { rejectWithValue }) => {
    try {
      const response = await API.post("/stripe/cancel-subscription", {
        subscriptionId,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Resume subscription
export const resumeSubscription = createAsyncThunk(
  "stripe/resumeSubscription",
  async ({ subscriptionId }, { rejectWithValue }) => {
    try {
      const response = await API.post("/stripe/resume-subscription", {
        subscriptionId,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Change Subscription Plan
export const changeSubscriptionPlan = createAsyncThunk(
  "stripe/changeSubscriptionPlan",
  async ({ subscriptionId, newPriceId, userId }, { rejectWithValue }) => {
    try {
      const response = await API.post("/stripe/change-subscription-plan", {
        subscriptionId,
        newPriceId,
        userId,
      });

      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// fetch strip plan
export const fetchStripePlans = createAsyncThunk(
  "stripe/fetchPlans",
  async (__, { rejectWithValue }) => {
    try {
      const response = await API.get("/stripe/get-plans");
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// fetch active plan

export const fetchActivePlan = createAsyncThunk(
  "stripe/fetchActivePlan",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/stripe/active-plan/${userId}`);
      return response.data;
    } catch (error) {
      console.error("[fetchActivePlan] Error fetching active plan:", error);
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Fetch multiple active plans
export const fetchActivePlans = createAsyncThunk(
  "stripe/fetchActivePlans",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/stripe/active-plans/${userId}`);
      return response.data;  // Assuming this returns { activePlans: [..] }
    } catch (error) {
      console.error("[fetchActivePlans] Error fetching active plans:", error);
      return handleApiError(error, rejectWithValue);
    }
  }
);


//invite member
export const inviteFamilyMembers = createAsyncThunk(
  "stripe/inviteFamilyMembers",
  async ({ inviterId, inviteeEmails }, { rejectWithValue }) => {
    try {
      const response = await API.post("/stripe/invite-family-members", {
        inviterId,
        inviteeEmails,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Fetch family members
export const fetchFamilyMembers = createAsyncThunk(
  "stripe/fetchFamilyMembers",
  async (inviterId, { rejectWithValue }) => {
    try {
      if (!inviterId) {
        throw new Error("No inviter ID provided");
      }
      const response = await API.get(`/stripe/get-members/${inviterId}`);

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to fetch members");
      }

      return response.data.members; // Now directly returning the array
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Resend invite link
export const resendInviteLink = createAsyncThunk(
  "stripe/resendInviteLink",
  async ({ inviteId, inviterId }, { rejectWithValue }) => {
    try {
      const response = await API.post("/stripe/resend-invite", {
        inviteId,
        inviterId,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Remove family member
export const removeFamilyMember = createAsyncThunk(
  "stripe/removeFamilyMember",
  async ({ memberId, inviterId }, { rejectWithValue }) => {
    // Include dispatch here
    try {
      const response = await API.post("/stripe/remove-member", {
        memberId,
        inviterId,
      });

      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);
