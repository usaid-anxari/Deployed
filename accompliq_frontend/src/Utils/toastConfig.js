// src/utils/toastConfig.js
import toast, { Toaster } from "react-hot-toast";

export const toastOptions = {
  position: "bottom-center",
  duration: 3000,
  style: {
    background: "#1F2937", // dark gray
    color: "#F9FAFB", // light text
    fontWeight: "500",
  },
  success: {
    duration: 3000,
    iconTheme: {
      primary: "#22C55E", // green
      secondary: "#fff",
    },
  },
  error: {
    duration: 4000,
    iconTheme: {
      primary: "#EF4444", // red
      secondary: "#fff",
    },
  },
  loading: {
    duration: Infinity,
  },
};

export const showToast = {
  success: (message) => toast.success(message, toastOptions),
  error: (message) => toast.error(message, toastOptions),
  loading: (message) => toast.loading(message, toastOptions),
  promise: (promise, messages) =>
    toast.promise(promise, messages, toastOptions),
  dismiss: (toastId) => toast.dismiss(toastId),
};

export const ToastContainer = () => <Toaster {...toastOptions} />;

// Toast messages
export const TOAST_MESSAGES = {
  CREATE_SUCCESS: "Bucket item created successfully!",
  UPDATE_SUCCESS: "Bucket item updated successfully!",
  DELETE_SUCCESS: "Bucket item deleted successfully!",
  COMPLETE_SUCCESS: "Bucket item marked as complete!",
  REFRESH_SUCCESS: "Bucket list refreshed successfully!",
  CREATE_ERROR: "Failed to create bucket item",
  UPDATE_ERROR: "Failed to update bucket item",
  DELETE_ERROR: "Failed to delete bucket item",
  COMPLETE_ERROR: "Failed to mark as complete",
  REFRESH_ERROR: "Failed to refresh bucket list",
  CREATING: "Creating bucket item...",
  UPDATING: "Updating bucket item...",

  // Newsletter/Subscription messages
  NEWSLETTER_SUBSCRIBE_LOADING: "Joining Accompliq community...",
  NEWSLETTER_SUBSCRIBE_SUCCESS: "Welcome to Accompliq! You've been successfully subscribed.",
  NEWSLETTER_ALREADY_SUBSCRIBED: "You're already part of the Accompliq community!",
  NEWSLETTER_SUBSCRIBE_ERROR: "Subscription failed. Please try again.",
  NEWSLETTER_NETWORK_ERROR: "Network error. Please check your connection and try again.",
  NEWSLETTER_VALIDATION_ERROR: "Please check your information and try again.",

  // strip
  PAYMENT_LOADING: "Processing your payment...",
  PAYMENT_SUCCESS: "Subscription successful!",
  PAYMENT_FAILED: "Payment failed. Please try again.",

  CUSTOMER_CREATED: "Customer created in Stripe.",
  SETUP_INTENT_CREATED: "Setup intent created.",
  PAYMENT_METHOD_ATTACHED: "Payment method attached.",
  SUBSCRIPTION_CREATED: "Subscription activated.",

  FETCHING_PLANS: "Fetching available plans...",
  PLANS_FETCHED: "Plans loaded.",
  PLAN_CHANGE_SUCCESS: "Subscription plan updated.",
  PLAN_CHANGE_FAILED: "Failed to update plan.",

  FAMILY_INVITE_RESENT: "Invite link resent successfully",
  FAMILY_MEMBER_REMOVED: "Family member removed successfully",
  FAMILY_INVITE_FAILED: "Failed to resend invitation",
  FAMILY_REMOVE_FAILED: "Failed to remove family member",
};
