import React, { useState } from "react";
import { Download, Edit, Eye, X } from "lucide-react";
import { toast } from "react-toastify";
import AccompliqPreview from "./AccompliqPreview";
import { selectAIDraft } from "../../redux/feature/ai-draft/aiDraftSlice";
import { useDispatch } from "react-redux";
import { downloadAIDraftPDF } from "../../redux/feature/ai-draft/aiDraftSlice";

const AIGenerationModal = ({
  isOpen,
  onClose,
  progress,
  isGenerating,
  onEdit,
  aiGeneratedContent,
  selectedImage,
  generatedDraftId,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const dispatch = useDispatch();
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [previewDraft, setPreviewDraft] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile device
  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      if (!generatedDraftId) {
        toast.error("No draft available to download");
        return;
      }

      const result = await dispatch(downloadAIDraftPDF(generatedDraftId));

      if (downloadAIDraftPDF.fulfilled.match(result)) {
        const url = window.URL.createObjectURL(result.payload.blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `draft-${generatedDraftId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("Draft downloaded successfully!");
      }
    } catch (error) {
      toast.error("Failed to download draft");
      console.error("Download error:", error);
    }
  };

  const handlePreviewClick = async () => {
    if (!generatedDraftId) {
      toast.error("Please generate a draft first");
      return;
    }

    try {
      setLoadingPreview(true);
      toast.info("Loading preview...", { autoClose: 2000 });

      const result = await dispatch(selectAIDraft(generatedDraftId));

      if (selectAIDraft.fulfilled.match(result)) {
        setPreviewDraft(result.payload);
        setShowPreview(true);
      } else {
        toast.error("Failed to load preview");
      }
    } catch (error) {
      toast.error("Error loading preview");
      console.error("Preview error:", error);
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleEdit = () => {
    onEdit();
    toast.info("Entering edit mode...", { autoClose: 2000 });
  };

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div
          className={`bg-white rounded-lg shadow-xl ${
            isGenerating ? "max-w-md" : "max-w-4xl"
          } w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto`}
        >
          {isGenerating ? (
            <>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Generating with AI...
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600">
                  We're creating your accompliq with AI...
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 text-right">{progress}%</p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancel Generation
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Generation Complete!
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-green-600 font-medium">
                  Your accompliq has been successfully generated!
                </p>

                {/* Preview Section */}
                {aiGeneratedContent && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Quick Preview
                    </h3>
                    <div className="space-y-4">
                      {selectedImage && (
                        <img
                          src={selectedImage}
                          alt="Preview"
                          className={`${
                            isMobile ? "w-16 h-16" : "w-24 h-24"
                          } rounded-full object-cover mx-auto`}
                        />
                      )}
                      <h4 className="text-center font-semibold">
                        {aiGeneratedContent.title || "In Loving Memory"}
                      </h4>
                      {aiGeneratedContent.content && (
                        <div
                          className={`${
                            isMobile ? "max-h-32" : "max-h-40"
                          } overflow-y-auto text-sm md:text-base`}
                        >
                          <p className="text-gray-700">
                            {aiGeneratedContent.content}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div
                  className={`grid ${
                    isMobile ? "grid-cols-1" : "grid-cols-3"
                  } gap-3`}
                >
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </button>
                  <button
                    onClick={handlePreviewClick}
                    disabled={loadingPreview}
                    className={`flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                      loadingPreview ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {loadingPreview ? (
                      "Loading..."
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Full Preview
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleEdit}
                    className="flex items-center justify-center px-4 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Content
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && previewDraft && (
        <AccompliqPreview
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          draft={previewDraft}
          isMobile={isMobile}
        />
      )}
    </>
  );
};

export default AIGenerationModal;
