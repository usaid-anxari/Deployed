import { createSlice } from "@reduxjs/toolkit";
import {
  attachPaymentMethod,
  cancelSubscription,
  changeSubscriptionPlan,
  createSetupIntent,
  createStripeCustomer,
  createStripeSubscription,
  fetchStripePlans,
  getSubscription,
  listInvoices,
  resumeSubscription,
  fetchActivePlan,
  inviteFamilyMembers,
  fetchFamilyMembers,
  resendInviteLink,
  removeFamilyMember,
} from "./stripeThunk";

const initialState = {
  customer: null,
  setupIntent: null,
  paymentMethod: null,
  subscription: null,
  invoices: [],
  loading: false,
  error: null,
  success: false,
  currentPlanId: null,
  subscriptionId: null,
  changingPlan: false,
  activePlan: null,
  activePlanLoading: false,
  activePlanError: null,
};

const stripeSlice = createSlice({
  name: "stripe",
  initialState,
  reducers: {
    resetStripeState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.customer = null;
      state.setupIntent = null;
      state.paymentMethod = null;
      state.subscription = null;
      state.invoice = [];
    },

    removeUserFromState: (state, action) => {
      // Assuming you store the users in an array, you can remove the user by id
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
  },

  extraReducers: (builder) => {
    // Create Customer
    builder.addCase(createStripeCustomer.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(createStripeCustomer.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.customer = action.payload;
    });
    builder.addCase(createStripeCustomer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Setup Interaction
    builder.addCase(createSetupIntent.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(createSetupIntent.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.setupIntent = action.payload;
    });
    builder.addCase(createSetupIntent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Attach Payment Method
    builder.addCase(attachPaymentMethod.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(attachPaymentMethod.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.paymentMethod = action.payload;
    });
    builder.addCase(attachPaymentMethod.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Create Subscription
    builder.addCase(createStripeSubscription.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(createStripeSubscription.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.subscription = action.payload;
    });
    builder.addCase(createStripeSubscription.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    //Get Subscription
    builder.addCase(getSubscription.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getSubscription.fulfilled, (state, action) => {
      state.subscription = action.payload;
      state.currentPlanId = action.payload.items?.data?.[0]?.price?.id;
      state.subscriptionId = action.payload.id;
    });
    builder.addCase(getSubscription.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    //List Invoices
    builder.addCase(listInvoices.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(listInvoices.fulfilled, (state, action) => {
      state.loading = false;
      state.invoices = action.payload?.data || [];
    });
    builder.addCase(listInvoices.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    //Cancel Subscription
    builder.addCase(cancelSubscription.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(cancelSubscription.fulfilled, (state, action) => {
      state.loading = false;
      state.subscription = action.payload;
      state.success = true;
    });
    builder.addCase(cancelSubscription.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    //Resume Subscription
    builder.addCase(resumeSubscription.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(resumeSubscription.fulfilled, (state, action) => {
      state.loading = false;
      state.subscription = action.payload;
      state.success = true;
    });
    builder.addCase(resumeSubscription.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    //Change subscription plan
    builder.addCase(changeSubscriptionPlan.pending, (state) => {
      state.changingPlan = true;
      state.error = null;
    });
    builder.addCase(changeSubscriptionPlan.fulfilled, (state, action) => {
      state.changingPlan = false;
      state.subscription = action.payload;
      state.success = true;
      // set plan and subscriptionId here if the API response returns them!
      // If not, you must refetch the subscription to update
    });
    builder.addCase(changeSubscriptionPlan.rejected, (state, action) => {
      state.changingPlan = false;
      state.error = action.payload;
    });

    //Fetch plans from stripe
    builder.addCase(fetchStripePlans.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchStripePlans.fulfilled, (state, action) => {
      state.loading = false;
      state.plans = action.payload;
    });
    builder.addCase(fetchStripePlans.rejected, (state, action) => {
      state.error = action.payload?.message;
    });

    // Fetch active plan
    builder
      .addCase(fetchActivePlan.pending, (state) => {
        state.activePlanLoading = true;
        state.activePlanError = null;
      })
      .addCase(fetchActivePlan.fulfilled, (state, action) => {
        state.activePlan = action.payload;
        if (action.payload?.planId) {
          state.currentPlanId = action.payload.planId;
        }
        if (action.payload?.subscriptionId) {
          state.subscriptionId = action.payload.subscriptionId; // 🟩 Fix: Set the subscriptionId
        }
        state.activePlanLoading = false;
        state.activePlanError = null;
      })
      .addCase(fetchActivePlan.rejected, (state, action) => {
        state.activePlanLoading = false;
        state.activePlanError =
          action.payload?.message || "Failed to fetch active plan";
      });
    //invite members
    builder
      // Invite Family Members
      .addCase(inviteFamilyMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(inviteFamilyMembers.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(inviteFamilyMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to invite members";
      });
    builder
      // Fetch Family Members
      .addCase(fetchFamilyMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFamilyMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.invitedMembers = action.payload;
      })
      .addCase(fetchFamilyMembers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch family members";
      });
    // Resend Invite Link
    builder
      .addCase(resendInviteLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendInviteLink.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendInviteLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to resend invite";
      });

    // Remove Family Member
    builder
      .addCase(removeFamilyMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFamilyMember.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeFamilyMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to remove member";
      });
  },
});

export const { resetStripeState, removeUserFromState } = stripeSlice.actions;
export default stripeSlice.reducer;
