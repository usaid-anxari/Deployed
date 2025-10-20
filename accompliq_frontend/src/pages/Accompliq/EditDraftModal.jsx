import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateDraftContent } from "../../redux/feature/ai-draft/aiDraftSlice";
import { toast } from "react-toastify";
import { X } from "lucide-react"; // Using Lucide icon for consistency

const EditDraftModal = ({
  isOpen,
  onClose,
  content,
  onContentChange,
  draftId,
  isLoading,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleSave = async () => {
    if (!draftId) {
      toast.error("No draft selected for update");
      return;
    }

    if (!content?.trim()) {
      toast.error("Content cannot be empty");
      return;
    }

    try {
      const resultAction = await dispatch(
        updateDraftContent({ draftId, content })
      );

      if (updateDraftContent.fulfilled.match(resultAction)) {
        toast.success("Draft updated successfully");
        onClose();
      }
    } catch (error) {
      toast.error(error.message || "Failed to update draft");
      console.error("Update error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-lg w-full max-w-4xl flex flex-col"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 md:p-6 pb-2 md:pb-4 border-b">
          <h2 className="text-lg md:text-xl font-bold">Edit Draft</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto p-4 md:p-6">
          <textarea
            value={content || ""}
            onChange={(e) => onContentChange(e.target.value)}
            className="w-full h-full min-h-[200px] md:min-h-[300px] p-3 md:p-4 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="Edit your draft content..."
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 p-4 md:p-6 pt-3 md:pt-4 border-t">
          <button
            onClick={onClose}
            className="px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm md:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm md:text-base ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDraftModal;
