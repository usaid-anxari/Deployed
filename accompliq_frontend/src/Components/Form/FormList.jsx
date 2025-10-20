import React from "react";
import { useNavigate } from "react-router-dom";

const FormList = () => {
  const navigate = useNavigate();

  const forms = [
    {
      id: 1,
      name: "Revocable Living Trust",
      path: "/Assets/forms/RevocableLivingTrust.html",
      type: "html",
    },
    {
      id: 2,
      name: "Beneficiary Designation Form",
      path: "/Assets/forms/BeneficiaryDesignationForm.html",
      type: "html",
    },
    {
      id: 3,
      name: "Digital Estate Plan",
      path: "/Assets/forms/DigitalEstatePlan.html",
      type: "html",
    },
    {
      id: 4,
      name: "DISCLAIMER",
      path: "/Assets/forms/DISCLAIMER.html",
      type: "html",
    },
    {
      id: 5,
      name: "Durable Power Of Attorney For Finances",
      path: "/Assets/forms/DurablePowerOfAttorneyForFinances.html",
      type: "html",
    },
    {
      id: 6,
      name: "Durable Power Of Attorney For Healthcare",
      path: "/Assets/forms/DurablePowerOfAttorneyForHealthcare.html",
      type: "html",
    },
    {
      id: 7,
      name: "Guardian Ship Designation Form",
      path: "/Assets/forms/GuardianShipDesignationForm.html",
      type: "html",
    },
    {
      id: 8,
      name: "HIPAA Authorization Form",
      path: "/Assets/forms/HIPAAAuthorizationForm.html",
      type: "html",
    },
    {
      id: 9,
      name: "Letter Of Instruction",
      path: "/Assets/forms/LetterOfInstruction.html",
      type: "html",
    },
    {
      id: 10,
      name: "Living Will And Advance Healthcare Directive",
      path: "/Assets/forms/LivingWillAndAdvanceHealthcareDirective.html",
      type: "html",
    },
    {
      id: 11,
      name: "Living Will",
      path: "/Assets/forms/LivingWill.html",
      type: "html",
    },
  ];

  const handleFormClick = async (path, type) => {
    try {
      const fullPath = `${process.env.PUBLIC_URL}${path}`;
      const response = await fetch(fullPath, { method: "HEAD" });

      if (!response.ok) {
        throw new Error(`File not found at ${path}`);
      }

      if (type === "html") {
        navigate(
          `/personal-planning/html?file=${encodeURIComponent(fullPath)}`
        );
      } else if (type === "pdf") {
        navigate(`/personal-planning/view?file=${encodeURIComponent(path)}`);
      }
    } catch (error) {
      console.error("Failed to access form:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
          Personal Planning Forms
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
          {forms.map((form) => (
            <div
              key={form.id}
              onClick={() => handleFormClick(form.path, form.type)}
              className="p-4 bg-white rounded-lg cursor-pointer hover:bg-blue-50 transition-colors duration-200 border border-gray-200 hover:border-blue-300 shadow-xs hover:shadow-sm flex items-center"
            >
              <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
              <h3 className="text-sm md:text-base font-medium text-gray-700">
                {form.name}
              </h3>
              <svg
                className="ml-auto h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormList;
