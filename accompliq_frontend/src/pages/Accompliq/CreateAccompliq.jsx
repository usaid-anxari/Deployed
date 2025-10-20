/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Upload, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import AIGenerationModal from "./AIGenerationModal";
import AIPreviewForm from "./AIPreviewForm";
import SuccessModal from "../../Models/SuccessModal";
import { createAccompliq } from "../../redux/feature/accompliq/accompliqThunk";
import { generateAIDraft } from "../../redux/feature/ai-draft/aiDraftSlice";
import { formConfig } from "./formConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Added for navigation

const CreateAccompliq = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Added for navigation
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Safely get the AI generation state from Redux with default values
  const aiDraftState = useSelector((state) => state.aiDraft || {});
  const { loading: isGeneratingRedux = false, error: generationError = null } =
    aiDraftState;

  // State management
  const [expandedSections, setExpandedSections] = useState({});
  const [formValues, setFormValues] = useState({
    personalInfo: {},
    familyInfo: {},
    educationCareer: {},
    personalLife: {},
    legacyTribute: {},
    funeralDetail: {},
    media: { images: [], videos: [] },
    selectedTemplate: "classic",
    language: "en",
    isPublic: false,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // AI Generation State
  const [showAIModal, setShowAIModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [localIsGenerating, setLocalIsGenerating] = useState(false);
  const [aiGeneratedContent, setAiGeneratedContent] = useState(null);
  const [showAIPreview, setShowAIPreview] = useState(false);
  const [createdAccompliqId, setCreatedAccompliqId] = useState(null);
  const [generatedDraftId, setGeneratedDraftId] = useState(null);

  // Combine local and Redux loading states
  const isGenerating = localIsGenerating || isGeneratingRedux;

  // Progress simulation effect
  useEffect(() => {
    let interval;
    if (isGenerating) {
      interval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Handle generation errors from Redux
  useEffect(() => {
    if (generationError) {
      setSubmitError(generationError);
      setLocalIsGenerating(false);
    }
  }, [generationError]);

  // Toggle section expansion
  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  // Handle form input changes
  const handleInputChange = (sectionKey, fieldKey, value) => {
    setFormValues((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [fieldKey]: value,
      },
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setFormValues((prev) => ({
          ...prev,
          media: {
            ...prev.media,
            images: [reader.result],
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setFormValues((prev) => ({
      ...prev,
      media: {
        ...prev.media,
        images: [],
      },
    }));
  };

  const generateAccompliq = async () => {
    setLocalIsGenerating(true);
    setGenerationProgress(0);
    setSubmitError(null);

    const toastId = toast.loading("Generating your Accompliq...", {
      position: isMobile ? "top-center" : "bottom-center",
    });

    try {
      if (!createdAccompliqId) {
        throw new Error("Accompliq ID not found");
      }

      const result = await dispatch(
        generateAIDraft({
          accompliqId: createdAccompliqId,
          accompliqData: formValues,
        })
      ).unwrap();

      setAiGeneratedContent(result.draft?.draftContent);
      setGeneratedDraftId(result.draft?.id);
      setGenerationProgress(100);
      setShowAIModal(true);
      setShowSuccessModal(false);

      toast.update(toastId, {
        render: "Accompliq generated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Generation error:", error);
      setSubmitError(error.message);
      toast.update(toastId, {
        render: error.message || "Failed to generate Accompliq",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLocalIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const submitData = {
        ...formValues,
        personalInfo: {
          ...formValues.personalInfo,
          dateOfBirth: formValues.personalInfo.dob,
        },
        aiGeneratedDraft: showAIPreview ? aiGeneratedContent : "",
      };

      const result = await dispatch(createAccompliq(submitData)).unwrap();

      if (result?.accompliq?.id) {
        setCreatedAccompliqId(result.accompliq.id);
        setSubmitSuccess(true);
        toast.success("Accompliq created successfully!");
        setShowSuccessModal(true);
      } else {
        throw new Error("Failed to get accompliq ID from response");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError(error.message);
      toast.error(error.message || "Failed to create accompliq");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditForm = () => {
    setShowSuccessModal(false);
  };

  const handleDownload = () => {
    const content = {
      title: `In Loving Memory of ${formValues.personalInfo?.fullName || ""}`,
      content: aiGeneratedContent,
      image: selectedImage,
    };
    setShowAIModal(false);
  };

  const handlePreview = () => {
    setShowAIPreview(true);
    setShowAIModal(false);
  };

  const handleEdit = () => {
    setShowAIModal(false);
    setShowAIPreview(false);
  };

  // Handle cancel action - closes all modals and resets form
  const handleCancel = () => {
    setShowAIModal(false);
    setShowSuccessModal(false);
    setShowAIPreview(false);
    navigate("/accompliq"); // Navigate back to home or previous page
  };

  // Generate form sections dynamically
  const renderFormSections = () => {
    return Object.entries(formConfig).map(([sectionKey, section]) => (
      <div
        key={sectionKey}
        className="mb-4 md:mb-6 border rounded-lg p-3 md:p-4"
      >
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection(sectionKey)}
        >
          <h3 className="text-base md:text-lg font-semibold text-gray-800">
            {section.title}
          </h3>
          {expandedSections[sectionKey] ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </div>

        {expandedSections[sectionKey] && (
          <div className="mt-3 md:mt-4 flex flex-col gap-3 md:gap-4">
            {Object.entries(section.fields).map(([fieldKey, fieldLabel]) => {
              const fieldType =
                fieldKey.includes("Date") || fieldKey === "dob"
                  ? "date"
                  : fieldKey === "ageAtDeath"
                  ? "number"
                  : fieldKey === "finalMessage" ||
                    fieldKey === "accomplishments" ||
                    fieldKey === "servicePlans"
                  ? "textarea"
                  : "text";

              const fieldPlaceholder = `Enter ${fieldLabel.toLowerCase()}`;

              return (
                <div key={fieldKey} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {fieldLabel}
                  </label>
                  {fieldType === "textarea" ? (
                    <textarea
                      className="w-full border border-gray-300 rounded-xl px-3 md:px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm md:text-base"
                      placeholder={fieldPlaceholder}
                      value={formValues[sectionKey]?.[fieldKey] || ""}
                      onChange={(e) =>
                        handleInputChange(sectionKey, fieldKey, e.target.value)
                      }
                      rows={3}
                    />
                  ) : (
                    <input
                      type={fieldType}
                      className="w-full border border-gray-300 rounded-xl px-3 md:px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm md:text-base"
                      placeholder={fieldPlaceholder}
                      value={formValues[sectionKey]?.[fieldKey] || ""}
                      onChange={(e) =>
                        handleInputChange(sectionKey, fieldKey, e.target.value)
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 pt-20 md:pt-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-0">
            Create Your Accompliq
          </h1>
        </div>

        {/* Status Messages */}
        {submitSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm md:text-base">
            Accompliq form created successfully!
          </div>
        )}
        {(submitError || generationError) && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm md:text-base">
            Error: {submitError || generationError}
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              {renderFormSections()}

              {/* Image Upload */}
              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image
                </label>
                <div className="flex items-center space-x-3 md:space-x-4">
                  <label className="cursor-pointer">
                    <div className="flex items-center justify-center px-3 md:px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <Upload className="h-4 w-4 mr-2" />
                      {selectedImage ? "Change Image" : "Upload Image"}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                  {selectedImage && (
                    <div className="relative">
                      <img
                        src={selectedImage}
                        alt="Preview"
                        className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-red-500 text-white rounded-full p-0.5 md:p-1 hover:bg-red-600"
                        aria-label="Remove image"
                      >
                        <X className="h-2.5 w-2.5 md:h-3 md:w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Privacy Settings
                </label>
                <div className="flex space-x-4 md:space-x-6">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="h-4 w-4 text-blue-600"
                      checked={!formValues.isPublic}
                      onChange={() =>
                        setFormValues((prev) => ({
                          ...prev,
                          isPublic: false,
                        }))
                      }
                    />
                    <span className="ml-2 text-sm text-gray-700">Personal</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="h-4 w-4 text-blue-600"
                      checked={formValues.isPublic}
                      onChange={() =>
                        setFormValues((prev) => ({
                          ...prev,
                          isPublic: true,
                        }))
                      }
                    />
                    <span className="ml-2 text-sm text-gray-700">Public</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-between items-center pt-3 md:pt-4 gap-3">
                <button
                  onClick={handleCancel} // Updated to use handleCancel
                  className="px-4 md:px-6 py-2 border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-4 md:px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 w-full sm:w-auto ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Saving..." : "Save & Continue"}
                </button>
              </div>
            </div>

            {/* Preview Section - Hidden on mobile */}
            {!isMobile && (
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Preview
                  </h3>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt="Preview"
                        className="w-full h-auto rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-64 bg-gray-200 rounded-lg">
                        <span className="text-gray-500">No image selected</span>
                      </div>
                    )}
                    <div className="mt-4 space-y-2">
                      {Object.entries(formValues)
                        .filter(
                          ([sectionKey]) =>
                            ![
                              "media",
                              "isPublic",
                              "selectedTemplate",
                              "language",
                            ].includes(sectionKey)
                        )
                        .map(([sectionKey, fields]) => {
                          const nonEmptyFields = Object.entries(fields).filter(
                            ([, value]) =>
                              value && value.toString().trim() !== ""
                          );

                          if (nonEmptyFields.length > 0) {
                            return (
                              <div key={sectionKey}>
                                <h4 className="font-bold text-white bg-gray-900 rounded-t-lg px-4 py-2 mb-4">
                                  {formConfig[sectionKey]?.title}
                                </h4>
                                <ul className="text-sm text-gray-600">
                                  {nonEmptyFields.map(([fieldKey, value]) => (
                                    <li key={fieldKey}>
                                      <span className="font-bold">
                                        {formConfig[sectionKey]?.fields[
                                          fieldKey
                                        ] || fieldKey}
                                        :
                                      </span>{" "}
                                      {Array.isArray(value)
                                        ? value.join(", ")
                                        : value}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            );
                          }
                          return null;
                        })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AIGenerationModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        progress={generationProgress}
        isGenerating={isGenerating}
        onDownload={handleDownload}
        onPreview={handlePreview}
        onEdit={handleEdit}
        aiGeneratedContent={aiGeneratedContent}
        selectedImage={selectedImage}
        accompliqData={formValues}
        generatedDraftId={generatedDraftId}
        isMobile={isMobile}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onEdit={handleEditForm}
        onGenerate={generateAccompliq}
        isGenerating={isGenerating}
        isMobile={isMobile}
      />

      {showAIPreview && aiGeneratedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl md:text-2xl font-bold">
                  AI-Generated Preview
                </h2>
                <button
                  onClick={() => setShowAIPreview(false)}
                  className="text-gray-500 hover-gray-70"
                >
                  <X className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </div>

              <AIPreviewForm
                aiGeneratedContent={aiGeneratedContent}
                selectedImage={selectedImage}
                isMobile={isMobile}
              />

              <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-end gap-3">
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 w-full md:w-auto"
                >
                  Download
                </button>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full md:w-auto"
                >
                  Edit Content
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAccompliq;
