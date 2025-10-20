import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStripePlans,
  fetchActivePlan,
  changeSubscriptionPlan,
  createStripeSubscription,
  cancelSubscription,
  resumeSubscription,
} from "../redux/feature/stripe/stripeThunk";
import { fetchUserData } from "../redux/feature/auth/authThunk";
import { showToast, TOAST_MESSAGES } from "../Utils/toastConfig.js";
import Loader from "../Utils/Loader.jsx";
import {
  FaCheck,
  FaCrown,
  FaUsers,
  FaStar,
  FaTimes,
  FaRedo,
  FaExclamationTriangle,
} from "react-icons/fa";

const PaymentPlans = () => {
  const dispatch = useDispatch();
  const {
    plans = [],
    loading,
    error,
    activePlan,
    subscriptionId,
    changingPlan,
  } = useSelector((state) => state.stripe);

  const userId = useSelector((state) => state.auth?.userInfo?.id);
  const customerId = useSelector(
    (state) => state.auth?.userInfo?.stripeCustomerId
  );
  const paymentMethodId = useSelector(
    (state) => state.auth?.userInfo?.stripeDefaultPaymentMethodId
  );
  const isUserLoading = useSelector((state) => state.auth.loading);
  const [localLoading, setLocalLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false); // New state for popup
  const [selectedPlanValue, setSelectedPlanValue] = useState(null); // New state for selected plan

  useEffect(() => {
    let isMounted = true;

    if (isUserLoading || hasInitialized) {
      return;
    }

    const initialize = async () => {
      try {
        setLocalLoading(true);
        const toastId = showToast.loading(TOAST_MESSAGES.FETCHING_PLANS);

        if (userId) {
          await Promise.all([
            dispatch(fetchStripePlans()),
            dispatch(fetchActivePlan(userId)),
          ]);
        } else {
          await dispatch(fetchStripePlans());
        }

        if (isMounted) {
          showToast.dismiss(toastId);
          showToast.success(TOAST_MESSAGES.PLANS_FETCHED);
          setHasInitialized(true);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Initialization error:", error);
          showToast.error("Failed to load plan data");
        }
      } finally {
        if (isMounted) {
          setLocalLoading(false);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, [dispatch, userId, hasInitialized, isUserLoading]);

  const handleChangePlan = async (planValue) => {
    if (!userId) {
      showToast.warning("Please log in to change or create a plan");
      return;
    }

    if (localLoading || changingPlan) {
      return;
    }

    try {
      setLocalLoading(true);
      const toastId = showToast.loading(TOAST_MESSAGES.PAYMENT_LOADING);

      if (!subscriptionId) {
        if (!customerId || !paymentMethodId) {
          showToast.error("Please set up your payment method first");
          setLocalLoading(false);
          return;
        }

        await dispatch(
          createStripeSubscription({
            customerId,
            priceId: planValue,
            paymentMethodId,
            userId,
            isFamilyPlan: planValue.includes("family") ? true : false,
          })
        ).unwrap();

        showToast.success(TOAST_MESSAGES.SUBSCRIPTION_CREATED);
      } else {
        await dispatch(
          changeSubscriptionPlan({
            subscriptionId,
            newPriceId: planValue,
            userId,
          })
        ).unwrap();

        showToast.success(TOAST_MESSAGES.PLAN_CHANGE_SUCCESS);
      }

      await Promise.all([
        dispatch(fetchActivePlan(userId)),
        dispatch(fetchUserData()),
      ]);

      showToast.dismiss(toastId);
    } catch (error) {
      console.error("Plan change or creation error:", error);
      const errMsg =
        typeof error === "string"
          ? error
          : error?.message || TOAST_MESSAGES.PLAN_CHANGE_FAILED;
      showToast.error(errMsg);
    } finally {
      setLocalLoading(false);
      setShowConfirmPopup(false); // Close popup after action
    }
  };

  const getPlanIcon = (planLabel) => {
    const label = planLabel?.toLowerCase() || "";
    if (label.includes("family")) return <FaUsers className="text-xl" />;
    if (label.includes("premium")) return <FaCrown className="text-xl" />;
    return <FaStar className="text-xl" />;
  };

  if (localLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader />
      </div>
    );
  }

  if (error) {
    const errorMessage =
      typeof error === "string"
        ? error
        : error?.message || "An unexpected error occurred.";

    return (
      <div className="text-center py-6 px-4 text-red-500">
        Error: {errorMessage}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 bg-gradient-to-r from-[#2241CF] to-[#3A5BEF] text-white px-4 py-2 rounded-lg hover:opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  const isActivePlan = (planValue) => {
    return activePlan?.planMeta?.id === planValue;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Plans</h1>
        <p className="text-gray-600">Choose the perfect plan for your needs</p>
      </div>

      {/* Active Plan Section */}
      {activePlan ? (
        <div className="mb-6 bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaCrown className="mr-2 text-blue-500" /> Current Active Plan
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="text-gray-700">
              <strong>Plan Name:</strong> {activePlan.planName}
            </p>
            <p className="text-gray-700">
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  activePlan.planStatus === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {activePlan.planStatus}
              </span>
            </p>
            <p className="text-gray-700">
              <strong>Start Date:</strong> {new Date(activePlan.planStart).toLocaleDateString()}
            </p>
            {activePlan.planInterval && (
              <p className="text-gray-700">
                <strong>Interval:</strong> {activePlan.planInterval}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-6 bg-white p-6 rounded-2xl shadow-md border border-gray-200 text-center">
          <p className="text-gray-500 font-medium">
            No active plan found. Choose a plan to get started!
          </p>
        </div>
      )}

      {/* Available Plans Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Available Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isActive = isActivePlan(plan.value);

            return (
              <div
                key={plan.value}
                className={`bg-white rounded-2xl border-2 p-6 shadow-md hover:shadow-xl transition-all ${
                  isActive
                    ? "border-blue-600 ring-4 ring-blue-100"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                {/* Plan Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-3">
                    {getPlanIcon(plan.label)}
                  </div>
                  {isActive && (
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </div>

                {/* Plan Name */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {plan.label}
                </h3>

                {/* Plan Price */}
                <div className="mb-4">
                  <span className="text-4xl font-bold text-blue-700">
                    ${Number(plan.price).toFixed(2)}
                  </span>
                  <span className="text-gray-600 text-sm ml-2">
                    /{plan.interval || "period"}
                  </span>
                </div>

                {/* Plan Description */}
                <p className="text-gray-600 text-sm mb-6 min-h-[60px]">
                  {plan.description}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-700 text-sm">
                      <div className="bg-blue-100 rounded-full p-1 mr-3">
                        <FaCheck className="text-blue-600 text-xs" />
                      </div>
                      Full platform access
                    </li>
                    <li className="flex items-center text-gray-700 text-sm">
                      <div className="bg-blue-100 rounded-full p-1 mr-3">
                        <FaCheck className="text-blue-600 text-xs" />
                      </div>
                      Unlimited storage
                    </li>
                    <li className="flex items-center text-gray-700 text-sm">
                      <div className="bg-blue-100 rounded-full p-1 mr-3">
                        <FaCheck className="text-blue-600 text-xs" />
                      </div>
                      Priority support
                    </li>
                  </ul>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => {
                    setSelectedPlanValue(plan.value);
                    setShowConfirmPopup(true);
                  }}
                  disabled={isActive || changingPlan || localLoading}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                    isActive
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#2241CF] to-[#3A5BEF] text-white hover:opacity-90 hover:shadow-lg"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isActive
                    ? "Current Plan"
                    : changingPlan || localLoading
                    ? "Processing..."
                    : "Choose Plan"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Popup */}
       {showConfirmPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full border border-gray-200 transition-transform duration-300 ease-in-out transform scale-100 hover:scale-105">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center text-gray-800">
                <FaExclamationTriangle className="mr-2 text-yellow-500" /> Confirm Plan Change
              </h2>
              <button onClick={() => setShowConfirmPopup(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <p className="mb-4 text-gray-700">Are you sure you want to switch to this plan? This may affect your subscription.</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleChangePlan(selectedPlanValue);
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#2241CF] to-[#3A5BEF] text-white rounded-lg hover:opacity-90 transition shadow-md hover:shadow-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPlans;
