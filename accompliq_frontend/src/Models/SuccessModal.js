import React from "react";
import { X } from "lucide-react";
const SuccessModal = ({
  isOpen,
  onClose,
  onEdit,
  onGenerate,
  isGenerating,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold mb-4">
            Accompliq Form Created Successfully!
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-6">What would you like to do next?</p>

        <div className="flex flex-col space-y-3">
          <button
            onClick={onEdit}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Edit Accompliq Form
          </button>
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className={`px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors ${
              isGenerating ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </span>
            ) : (
              "Generate Accompliq"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
