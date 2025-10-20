/* eslint-disable no-dupe-keys */
import React, { useEffect } from "react";
import accompliqLogo from "../../Assets/logo_black_text.png";
import planImage from "../../Assets/authImage1.png";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useDispatch, useSelector } from "react-redux";
import { fetchStripePlans } from "../../redux/feature/stripe/stripeThunk";
import { useNavigate } from "react-router-dom";
import Loader from "../../Utils/Loader";

const ChoosePlanPage = () => {
  const dispatch = useDispatch();
  const {
    plans = [],
    loading,
    error,
  } = useSelector((state) => state.stripe || {});
  const [selectedPlan, setSelectedPlan] = React.useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchStripePlans());
  }, [dispatch]);

  useEffect(() => {
    if (plans.length > 0) {
      setSelectedPlan(plans[0]);
    }
  }, [plans]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedPlan) {
      navigate("/cardDetail", { state: { selectedPlan } });
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-res-600">
        Error loading plans: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6">
      {" "}
      {/* Changed bg color */}
      <div className="flex flex-col lg:flex-row items-stretch bg-white rounded-xl lg:rounded-2xl shadow-lg w-full max-w-4xl lg:max-w-6xl overflow-hidden">
        {/* Left Side Image + Cards */}
        <div className="relative hidden lg:flex flex-col w-1/2 h-auto bg-white p-0 overflow-hidden">
          {/* Background Image */}
          <img
            src={planImage}
            alt="Visual cards"
            className="w-full h-full object-contain max-h-[500px] lg:max-h-[600px]"
          />
          {/* Overlay for darkness */}
        </div>

        {/* Right Side Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-12 relative">
          {/* Back button (Top right corner) */}
          <button
            onClick={() => window.history.back()}
            className="absolute top-5 right-6 bg-[#2241CF] hover:bg-blue-700 text-white rounded-xl p-2 shadow-lg"
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
          <div className="w-full max-w-md mx-auto">
            <div className="flex justify-center mb-6">
              <img
                src={accompliqLogo}
                alt="accompliq Logo"
                className="h-12 md:h-14 w-auto object-contain"
              />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800 text-center">
              Choose your plan
            </h2>
            <p className="text-xs md:text-sm text-gray-500 text-center mb-5">
              To follow anti-spam laws, your address will appear in the footer
              of every email you send with public circle.
            </p>
            {plans.length > 0 && selectedPlan && (
              <form onSubmit={handleSubmit}>
                <label className="block text-sm font-medium mb-1">
                  Select plan level
                </label>
                <div className="mb-3">
                  <Listbox value={selectedPlan} onChange={setSelectedPlan}>
                    <div className="relative">
                      <Listbox.Button className="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
                        <span className="block truncate">
                          {selectedPlan.label}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {plans.map((option) => (
                          <Listbox.Option
                            key={option.value}
                            value={option}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                active
                                  ? "bg-blue-100 text-blue-900"
                                  : "text-gray-900"
                              }`
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {option.label}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </div>

                {/* Invoice Box */}
                <div className="bg-[#2241CF1C] rounded-xl p-5 mb-4 text-center">
                  <div className="text-lg font-semibold text-blue-600 mb-1">
                    {selectedPlan.label}
                  </div>
                  <div className="text-gray-600 text-sm mb-2">
                    {selectedPlan.description}
                  </div>
                  <div className="text-2xl font-bold text-blue-800">
                    Price: ${selectedPlan.price}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#2241CF] hover:bg-blue-800 text-white py-3 rounded-lg font-semibold text-lg transition"
                >
                  Next
                </button>
              </form>
            )}
            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-yellow-500 font-semibold hover:underline"
              >
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChoosePlanPage;
