import React from "react";
import { Download, Edit } from "lucide-react";

const AIPreviewForm = ({
  aiGeneratedContent,
  selectedImage,
  onDownload,
  onEdit,
}) => {
  // Default structure for AI-generated content
  const {
    title = "AI-Generated Accompliq",
    introduction = "",
    lifeStory = "",
    accomplishments = "",
    personality = "",
    family = "",
    legacy = "",
    closing = "",
  } = aiGeneratedContent || {};

  return (
    <div className="max-w-3xl mx-auto bg-white p-4 md:p-6 rounded-lg shadow-md">
      {/* Header with action buttons - Stacked on mobile */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={onDownload}
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full md:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </button>
          <button
            onClick={onEdit}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors w-full md:w-auto"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
        </div>
      </div>

      {/* Profile Image */}
      {selectedImage && (
        <div className="flex justify-center mb-6">
          <img
            src={selectedImage}
            alt="Profile"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-200"
          />
        </div>
      )}

      {/* AI-Generated Content Sections */}
      <div className="space-y-6 md:space-y-8">
        {introduction && (
          <section>
            <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">
              Introduction
            </h2>
            <p className="text-gray-700 whitespace-pre-line text-sm md:text-base">
              {introduction}
            </p>
          </section>
        )}

        {lifeStory && (
          <section>
            <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">
              Life Story
            </h2>
            <p className="text-gray-700 whitespace-pre-line text-sm md:text-base">
              {lifeStory}
            </p>
          </section>
        )}

        {accomplishments && (
          <section>
            <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">
              Notable Accomplishments
            </h2>
            <p className="text-gray-700 whitespace-pre-line text-sm md:text-base">
              {accomplishments}
            </p>
          </section>
        )}

        {personality && (
          <section>
            <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">
              Personality & Character
            </h2>
            <p className="text-gray-700 whitespace-pre-line text-sm md:text-base">
              {personality}
            </p>
          </section>
        )}

        {family && (
          <section>
            <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">
              Family
            </h2>
            <p className="text-gray-700 whitespace-pre-line text-sm md:text-base">
              {family}
            </p>
          </section>
        )}

        {legacy && (
          <section>
            <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">
              Legacy
            </h2>
            <p className="text-gray-700 whitespace-pre-line text-sm md:text-base">
              {legacy}
            </p>
          </section>
        )}

        {closing && (
          <section>
            <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">
              Final Words
            </h2>
            <p className="text-gray-700 whitespace-pre-line text-sm md:text-base">
              {closing}
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

export default AIPreviewForm;
