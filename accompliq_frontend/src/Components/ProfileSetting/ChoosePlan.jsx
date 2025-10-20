/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStripePlans,
  changeSubscriptionPlan,
  fetchActivePlan,
} from "../../redux/feature/stripe/stripeThunk";
import { fetchUserData } from "../../redux/feature/auth/authThunk";
import { showToast, TOAST_MESSAGES } from "../../Utils/toastConfig.js";
import Loader from "../../Utils/Loader.jsx";

const ChoosePlan = () => {
  const dispatch = useDispatch();
  const {
    plans = [],
    loading,
    error,
    currentPlanId,
    changingPlan,
    subscriptionId,
    activePlan,
    activePlanLoading,
    activePlanError,
  } = useSelector((state) => state.stripe);

  const userId = useSelector((state) => state.auth?.userInfo?.id);
  const isUserLoading = useSelector((state) => state.auth.loading);
  const [localLoading, setLocalLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (isUserLoading || !userId || hasInitialized) {
      return;
    }

    const initialize = async () => {
      try {
        setLocalLoading(true);
        showToast.loading(TOAST_MESSAGES.FETCHING_PLANS);
        await Promise.all([
          dispatch(fetchStripePlans()),
          dispatch(fetchActivePlan(userId)),
        ]);
        showToast.success(TOAST_MESSAGES.PLANS_FETCHED);
        setHasInitialized(true);
      } catch (error) {
        console.error("Initialization error:", error);
        showToast.error("Failed to load plan data");
      } finally {
        setLocalLoading(false);
      }
    };

    initialize();
  }, [dispatch, userId, hasInitialized, isUserLoading]);

  const handleChangePlan = async (planValue) => {
    if (!subscriptionId || !userId) {
      showToast.error(
        "Please ensure you're logged in and have an active subscription"
      );
      return;
    }

    try {
      setLocalLoading(true);
      showToast.loading(TOAST_MESSAGES.PAYMENT_LOADING);

      const response = await dispatch(
        changeSubscriptionPlan({
          subscriptionId,
          newPriceId: planValue,
          userId,
        })
      ).unwrap();

      await Promise.all([
        dispatch(fetchActivePlan(userId)),
        dispatch(fetchUserData()),
      ]);

      showToast.success(TOAST_MESSAGES.PLAN_CHANGE_SUCCESS);
    } catch (error) {
      console.error("Plan change error:", error);
      const errMsg =
        typeof error === "string"
          ? error
          : error?.message || TOAST_MESSAGES.PLAN_CHANGE_FAILED;
      showToast.error(errMsg);
    } finally {
      setLocalLoading(false);
    }
  };

  if (localLoading || loading || activePlanLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader />
      </div>
    );
  }

  if (error || activePlanError) {
    const errorMessage =
      typeof error === "string"
        ? error
        : error?.message || "An unexpected error occurred.";

    const activePlanErrorMessage =
      typeof activePlanError === "string"
        ? activePlanError
        : activePlanError?.message || "An unexpected error occurred.";

    return (
      <div className="text-center py-6 px-4 text-red-500">
        Error: {errorMessage || activePlanErrorMessage}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center md:text-left">
        Choose Your Plan
      </h2>

      {activePlan && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-medium text-blue-800 mb-2">
            Your Current Plan - {activePlan.planName}
          </h3>
          <p className="text-blue-700">
            ${Number(activePlan.planMeta?.unit_amount / 100).toFixed(2)}/
            {activePlan.planInterval}
          </p>
          {activePlan.planStart && (
            <p className="text-xs text-gray-500">
              Active from: {new Date(activePlan.planStart).toLocaleDateString()}
              {activePlan.planEnd && (
                <>
                  <br />
                  Until: {new Date(activePlan.planEnd).toLocaleDateString()}
                </>
              )}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {plans.map((plan) => {
          const isActive = currentPlanId === plan.value;

          return (
            <div
              key={plan.value}
              className={`bg-white rounded-lg md:rounded-xl border border-gray-200 shadow-sm hover:shadow-md p-4 md:p-6 flex flex-col justify-between transition-all ${
                isActive
                  ? "border-blue-600 ring-2 ring-blue-100 transform scale-[1.02]"
                  : "hover:shadow-md"
              }`}
            >
              {/* Plan Details - Full height section */}
              <div className="flex flex-col flex-1 justify-start">
                <div className="flex justify-between items-start">
                  <span className="text-sm md:text-base font-medium text-gray-500">
                    {plan.label || "Plan"}
                  </span>
                  {isActive && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <span className="text-xl md:text-2xl font-bold text-blue-700">
                    ${Number(plan.price).toFixed(2)}
                    <span className="text-xs md:text-sm font-normal text-gray-600 ml-1">
                      /{plan.interval || "period"}
                    </span>
                  </span>
                </div>
                {/* Description */}
                <p className="text-xs md:text-sm text-gray-700 mt-2 md:mt-3 flex-1">
                  {plan.description}
                </p>
              </div>

              {/* Button */}
              <button
                className={`mt-3 md:mt-4 w-full py-2 px-3 md:px-4 rounded-md text-sm md:text-base font-medium transition-colors ${
                  isActive
                    ? "bg-gray-200 text-gray-700 cursor-not-allowed"
                    : changingPlan || localLoading
                    ? "bg-blue-400 text-white cursor-wait"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={isActive || changingPlan || localLoading}
                onClick={() => handleChangePlan(plan.value)}
              >
                {isActive
                  ? "Active"
                  : changingPlan || localLoading
                  ? "Processing..."
                  : "Choose Plan"}
              </button>

              {/* Features */}
              <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t">
                <div className="font-medium mb-2 md:mb-3 text-gray-800">
                  Plan Features
                </div>
                <ul className="space-y-1 md:space-y-2">
                  <li className="flex items-start text-gray-700">
                    <svg
                      className="h-3 w-3 md:h-4 md:w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xs md:text-sm">
                      Full platform access
                    </span>
                  </li>
                  <li className="flex items-start text-gray-700">
                    <svg
                      className="h-3 w-3 md:h-4 md:w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xs md:text-sm">
                      {plan.features?.storage || "Unlimited storage"}
                    </span>
                  </li>
                  <li className="flex items-start text-gray-700">
                    <svg
                      className="h-3 w-3 md:h-4 md:w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xs md:text-sm">Priority support</span>
                  </li>
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChoosePlan;
