import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import { fetchAIDrafts } from "../../redux/feature/ai-draft/aiDraftSlice";

const PreviewModal = ({ isOpen, onClose, accompliqId }) => {
  const dispatch = useDispatch();
  const { aiDrafts, loading, error } = useSelector((state) => state.aiDrafts);

  useEffect(() => {
    if (isOpen && accompliqId) {
      dispatch(fetchAIDrafts(accompliqId));
    }
  }, [isOpen, accompliqId, dispatch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-full sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col sm:flex-row">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 z-10 p-1 bg-white rounded-full shadow"
          aria-label="Close preview"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Left side - AI Draft Preview */}
        <div className="w-full sm:w-1/2 p-3 sm:p-4 border-b sm:border-b-0 sm:border-r border-gray-200">
          <div className="sticky top-0 bg-white pb-2 sm:pb-0">
            <h3 className="text-lg sm:text-xl font-bold text-blue-500 mb-1 sm:mb-2">
              Stantly Accompliq
            </h3>
            <div className="text-xs sm:text-sm text-gray-600 mb-1">
              Created: {new Date().toLocaleDateString()}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
              {accompliqId?.isPublic ? "Public" : "Private"} | Classic Template
            </div>
          </div>
          <div className="overflow-y-auto max-h-[calc(90vh-150px)] sm:max-h-[calc(90vh-100px)]">
            {loading ? (
              <div className="text-center py-8">Loading AI Draft...</div>
            ) : error ? (
              <div className="text-red-500 text-sm sm:text-base p-2">
                {error}
              </div>
            ) : aiDrafts?.length > 0 ? (
              <div className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">
                {aiDrafts[0]?.draftContent || "No draft available"}
              </div>
            ) : (
              <div className="text-center py-8">No AI drafts found</div>
            )}
          </div>
        </div>

        {/* Right side - Actual Accompliq Data */}
        <div className="w-full sm:w-1/2 p-3 sm:p-4 bg-gray-50">
          <div className="sticky top-0 bg-gray-50 pb-2 sm:pb-0">
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
              {accompliqId?.personalInfo?.fullName || "Untitled Accompliq"}
            </h3>
            <div className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
              <span className="block sm:inline">
                {accompliqId?.personalInfo?.dob || "Birth: Not specified"}
              </span>
              <span className="hidden sm:inline"> | </span>
              <span className="block sm:inline">
                {accompliqId?.personalInfo?.deathDate || "Death: Not specified"}
              </span>
            </div>
          </div>
          <div className="overflow-y-auto max-h-[calc(90vh-150px)] sm:max-h-[calc(90vh-100px)]">
            <div className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">
              {accompliqId?.description || "No description available"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
