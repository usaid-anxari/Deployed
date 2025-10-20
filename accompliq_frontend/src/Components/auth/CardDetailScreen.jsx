import React, { useState } from "react";
import accompliq from "../../Assets/accompliq_new_logo.png";
import planImage from "../../Assets/authImage1.png";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import { getCodeList } from "country-list";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  createStripeCustomer,
  createSetupIntent,
  attachPaymentMethod,
  createStripeSubscription,
} from "../../redux/feature/stripe/stripeThunk";
import { fetchUserData } from "../../redux/feature/auth/authThunk";
import { useDispatch } from "react-redux";
import { showToast } from "../../Utils/toastConfig";
import Loader from "../../Utils/Loader";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const countryList = getCodeList();
const countryOptions = Object.entries(countryList).map(([code, name]) => ({
  value: code,
  label: name, // keep as string for search
  customLabel: (
    <div className="flex items-center gap-2">
      <img
        src={`https://hatscripts.github.io/circle-flags/flags/${code.toLowerCase()}.svg`}
        alt={name}
        className="w-5 h-5"
      />
      <span>{name}</span>
    </div>
  ),
}));

const CardDetailScreen = () => {
  const location = useLocation();
  const selectedPlan = location.state?.selectedPlan;
  const [country, setCountry] = useState("US");
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const isFamilyPlan = selectedPlan.label.toLowerCase().includes("family");
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      // 1. Create Stripe customer
      const customerResponse = await dispatch(
        createStripeCustomer({
          email: userInfo?.email,
          name: userInfo?.fullName || userInfo?.email,
        })
      ).unwrap();
      const customerId = customerResponse.customerId;

      // 2. Create setup intent (if needed)
      await dispatch(createSetupIntent({ customerId })).unwrap();

      // 3. Create payment method from card
      const cardElement = elements.getElement(CardElement);
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) throw error;

      // 4. Attach payment method
      await dispatch(
        attachPaymentMethod({
          customerId,
          paymentMethodId: paymentMethod.id,
        })
      ).unwrap();

      // 5. Create subscription
      await dispatch(
        createStripeSubscription({
          customerId,
          priceId: selectedPlan.value,
          paymentMethodId: paymentMethod.id,
          userId: userInfo?._id || userInfo?.id,
          isFamilyPlan,
        })
      ).unwrap();

      // 6. Refetch user data
      let updatedUser;
      try {
        updatedUser = await dispatch(fetchUserData()).unwrap();
      } catch (e) {
        console.error("Error fetching user data:", e);
        updatedUser = userInfo; // fallback
      }

      setLoading(false);
      showToast.success("Subscription successful!");

      // 7. Redirect based on role
      if (updatedUser.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/accompliq");
      }
    } catch (err) {
      console.error("Stripe error:", err);
      setLoading(false);
      showToast.error("Payment failed. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-8 px-2 sm:px-8">
      {/* Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
          <Loader />
        </div>
      )}
      <div
        className={`bg-white rounded-3xl shadow-2xl flex w-full max-w-6xl overflow-hidden transition-all duration-300 ${
          loading ? "pointer-events-none opacity-60" : ""
        }`}
      >
        {/* Left Side - Single image with overlay cards */}
        <div className="hidden lg:block relative w-1/2 min-h-[700px]">
          <img
            src={planImage}
            alt="Plan Visual"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side - Card Details Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 md:px-12 py-12 relative">
          {/* Back button */}
          <button
            onClick={() => window.history.back()}
            className="absolute top-5 right-6 bg-[#2241CF] border border-gray-200 hover:bg-blue-100 text-white rounded-xl p-2 shadow"
            aria-label="Go Back"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <form
            className="w-full max-w-md mx-auto"
            onSubmit={handlePay}
            autoComplete="off"
          >
            <div className="flex justify-center mb-6">
              <img
                src={accompliq}
                alt="Accompliq Logo"
                className="h-14 md:h-16 w-auto object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold mb-2 text-gray-900">
              Card Details
            </h2>
            <p className="text-xs text-gray-600 mb-4">
              To follow anti-spam laws, your address will appear in the footer
              of every email you send with public circle.
            </p>
            <div className="space-y-4 mb-2">
              {/* Stripe CardElement */}
              <div className="mb-4">
                <label className="block text-sm mb-2 font-semibold text-gray-700">
                  Card Details
                </label>
                <div className="border rounded-md p-3">
                  <CardElement
                    options={{
                      hidePostalCode: true,
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#32325d",
                          "::placeholder": { color: "#a0aec0" },
                        },
                        invalid: { color: "#fa755a" },
                      },
                    }}
                  />
                </div>
              </div>
              {/* Country Select */}
              <div>
                <label className="block text-sm mb-1">Country</label>
                <Select
                  options={countryOptions}
                  value={countryOptions.find((c) => c.value === country)}
                  onChange={(opt) => setCountry(opt.value)}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  isSearchable
                />
              </div>
            </div>

            {/* Plan Detail Box */}
            <div className="mt-6 mb-6">
              <div className="bg-blue-100 rounded-2xl p-5 text-center">
                <div className="text-xl font-bold text-blue-700 mb-2">
                  ${selectedPlan.price}
                </div>
                <div className="text-gray-600 text-sm mb-1">
                  <span className="font-medium">{selectedPlan.label}</span>:{" "}
                  {selectedPlan.description}
                </div>
                <div className="text-lg font-semibold text-blue-900 mt-2">
                  Total Due: {selectedPlan.price}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold text-lg transition ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-yellow-500 font-semibold hover:underline"
              >
                Log in
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CardDetailScreen;
