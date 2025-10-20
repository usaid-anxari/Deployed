import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { MoreVertical, Eye, Edit, Download, Trash2, Plus } from "lucide-react";
import {
  downloadAIDraftPDF,
  fetchAIDrafts,
  getDraftForEdit,
  deleteDraft,
} from "../../redux/feature/ai-draft/aiDraftSlice";
import AccompliqPreview from "./AccompliqPreview";
import EditDraftModal from "./EditDraftModal";

const AIDraftPreview = ({ draft }) => {
  const description = draft?.draftContent || "No description available";
  const [expanded, setExpanded] = useState(false);
  const fullName =
    draft?.accompliqDetails?.personalInfo?.fullName ||
    draft?.personalInfo?.fullName ||
    "Untitled Memorial";

  return (
    <div className="bg-white p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-md w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex flex-col text-left">
          <h2 className="text-lg md:text-xl font-bold text-blue-700">
            {fullName}'s Autobiography
          </h2>
        </div>
      </div>

      <div className="my-3 md:my-4 border-t border-gray-300"></div>

      <div className="space-y-3 md:space-y-4">
        <div className="relative">
          <p
            className={`text-sm md:text-base text-gray-700 ${
              !expanded && "line-clamp-3"
            }`}
          >
            {description}
          </p>
          {description.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-600 hover:text-blue-800 text-xs md:text-sm font-medium mt-1 focus:outline-none"
            >
              {expanded ? "See Less" : "See More"}
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 md:mt-6 text-center text-xs text-gray-500">
        <p>Created with Accompliq App</p>
        <p>
          © {new Date().getFullYear()} {fullName}
        </p>
      </div>
    </div>
  );
};

const Accompliq = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [previewDraft, setPreviewDraft] = useState(null);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAccompliqPreview, setShowAccompliqPreview] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [editedContent, setEditedContent] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "public", "private"

  const { drafts, loading, error, editStatus } = useSelector(
    (state) => state.aiDrafts
  );

  useEffect(() => {
    dispatch(fetchAIDrafts());
  }, [dispatch]);

  useEffect(() => {
    if (drafts && Array.isArray(drafts)) {
      if (drafts.length > 0) {
        const validDrafts = drafts.filter(
          (draft) => draft.personalInfo?.fullName || draft.draftContent
        );
        console.log(
          "Draft statuses:",
          validDrafts.map((d) => ({ id: d.id, isPublic: d.isPublic }))
        );
        if (validDrafts.length > 0) {
          setPreviewDraft(validDrafts[0]);
          setSelectedDraft(validDrafts[0]);
        }
      }
    }
  }, [drafts]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenuOpen) {
        setContextMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenuOpen]);

  const handleThreeDotClick = (e, draft) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedDraft(draft);
    setContextMenuOpen(true);
    setMenuPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleCreateMenuClick = (e) => {
    e.stopPropagation();
    navigate(`/CreateAccompliq`);
  };

  const handlePreview = (draft) => {
    setPreviewDraft(draft);
    setShowAccompliqPreview(true);
    setContextMenuOpen(false);
  };

  const handleDownload = async () => {
    if (!selectedDraft?.id) return;

    try {
      const response = await dispatch(downloadAIDraftPDF(selectedDraft.id));

      if (response.payload) {
        const blob = new Blob([response.payload.blob], {
          type: "application/pdf",
        });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${selectedDraft.personalInfo?.fullName || "draft"}.pdf`
        );

        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);

        toast.success("Draft downloaded successfully!");
      }
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download draft");
    }
  };

  const handleEditDraft = async () => {
    if (!selectedDraft?.id) return;

    try {
      const response = await dispatch(getDraftForEdit(selectedDraft.id));
      setEditedContent(response.payload.draft.draftContent);
      setShowEditModal(true);
    } catch (error) {
      console.error("Failed to load draft for editing:", error);
      toast.error("Failed to load draft for editing");
    }
  };

  const handleDelete = async () => {
    if (!selectedDraft?.id) return;

    try {
      await dispatch(deleteDraft(selectedDraft.id));
      dispatch(fetchAIDrafts());
      setShowDeleteConfirm(false);
      toast.success("Draft deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete draft");
    }
  };

  const handleToggleFilter = () => {
    setFilterStatus((prev) => {
      if (prev === "all") return "public";
      if (prev === "public") return "private";
      return "all";
    });
  };

  // Helper function to determine if a draft is public
  const isDraftPublic = (draft) => {
    // Default to true if isPublic is undefined or null
    return draft.isPublic !== false && draft.isPublic !== "false";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex justify-center items-center">
        <div className="text-base md:text-lg">Loading your drafts...</div>
      </div>
    );
  }

  if (error && !(drafts && drafts.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="text-red-500 mb-4 md:mb-6">
          Error: {error.message || "Failed to load drafts"}
        </div>
        <button
          onClick={() => dispatch(fetchAIDrafts())}
          className="px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm md:text-base"
        >
          Retry
        </button>
      </div>
    );
  }

  const hasDrafts =
    drafts &&
    Array.isArray(drafts) &&
    drafts.length > 0 &&
    drafts.some((draft) => draft.personalInfo?.fullName || draft.draftContent);

  // Filter drafts based on selected status
  const filteredDrafts = drafts.filter((draft) => {
    if (filterStatus === "all") return true;
    const publicStatus = isDraftPublic(draft);
    if (filterStatus === "public") return publicStatus;
    if (filterStatus === "private") return !publicStatus;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 pt-16 md:pt-10">
      <div className="max-w-4xl mx-auto">
        {error &&
          ((typeof error === "string" && error !== "No drafts found") ||
            (typeof error === "object" &&
              error.message !== "No drafts found")) && (
            <div className="mb-3 md:mb-4 p-3 md:p-4 bg-red-100 text-red-700 rounded text-sm md:text-base">
              {typeof error === "string"
                ? error
                : error.message || "An unexpected error occurred"}
            </div>
          )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Accompliq
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateMenuClick}
              className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
            >
              <Plus className="h-4 w-4 md:h-5 md:w-5" />
              <span>Create New</span>
            </button>
            <button
              onClick={handleToggleFilter}
              className={`py-2 px-4 rounded-full text-white font-medium transition-colors ${
                filterStatus === "all"
                  ? "bg-gray-500 hover:bg-gray-600"
                  : filterStatus === "public"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {filterStatus === "all"
                ? "All"
                : filterStatus === "public"
                ? "Public"
                : "Private"}
            </button>
          </div>
        </div>

        {/* Add filter status indicator */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredDrafts.length} of {drafts.length} drafts (
          {filterStatus} filter)
        </div>

        {hasDrafts ? (
          <div className="space-y-4 md:space-y-6">
            {filteredDrafts.length > 0 ? (
              filteredDrafts.map((draft) => {
                if (
                  !draft.accompliqDetails?.personalInfo?.fullName &&
                  !draft.personalInfo?.fullName &&
                  !draft.draftContent
                ) {
                  return null;
                }

                const fullName =
                  draft?.accompliqDetails?.personalInfo?.fullName ||
                  draft?.personalInfo?.fullName ||
                  "Untitled Memorial";
                const description =
                  draft?.draftContent ||
                  draft?.personalLife?.description ||
                  "No description available";
                const createdAt = draft?.createdAt
                  ? new Date(draft.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Not specified";
                const isPublic = isDraftPublic(draft);

                return (
                  <div
                    key={draft.id}
                    className="bg-[#2241CF] p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm relative hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={(e) => handleThreeDotClick(e, draft)}
                      className="absolute top-2 right-2 md:top-4 md:right-4 text-white hover:text-gray-200 p-1 rounded-full hover:bg-[#1A36A1] transition-colors"
                    >
                      <MoreVertical className="h-5 w-5 md:h-6 md:w-6" />
                    </button>

                    <div className="grid grid-cols-2 gap-4 md:gap-8">
                      <div className="bg-[#1A36A1] p-3 md:p-4 rounded-xl">
                        <AIDraftPreview draft={draft} />
                      </div>

                      <div className="flex flex-col justify-between">
                        <div className="space-y-3 md:space-y-4">
                          <div className="p-3 md:p-4 rounded-lg">
                            <div className="space-y-2 md:space-y-3">
                              <div>
                                <p className="text-lg md:text-xl font-bold text-[#FFFFFF]">
                                  {fullName}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 md:gap-4">
                                <p className="text-xs md:text-sm font-medium text-[#FBBC05]">
                                  Created:
                                </p>
                                <p className="text-xs md:text-sm text-[#FBBC05]">
                                  {createdAt}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 md:gap-4">
                                <p className="text-xs md:text-sm font-medium text-[#FBBC05]">
                                  Status:
                                </p>
                                <div className="flex items-center gap-1 md:gap-2">
                                  {isPublic ? (
                                    <>
                                      <svg
                                        className="w-3 h-3 md:w-4 md:h-4"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path
                                          fillRule="evenodd"
                                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      <span className="text-xs md:text-sm text-[#FFFFFF]">
                                        Public
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <svg
                                        className="w-3 h-3 md:w-4 md:h-4"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      <span className="text-xs md:text-sm text-[#FFFFFF]">
                                        Private
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-3 md:p-4 rounded-lg">
                            <h3 className="font-bold text-base md:text-lg text-[#FFFFFF] mb-1 md:mb-2">
                              Description
                            </h3>
                            <p className="text-xs md:text-sm text-[#FFFFFF] line-clamp-3">
                              {description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 bg-white rounded-lg">
                <p>No {filterStatus} drafts found</p>
                <button
                  onClick={() => setFilterStatus("all")}
                  className="mt-2 text-blue-600 hover:text-blue-800"
                >
                  Show all drafts
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 md:py-8">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm max-w-4xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
                No Accompliq available
              </h2>
              <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 max-w-lg mx-auto">
                Create a new accompliq to get started
              </p>
              <button
                onClick={handleCreateMenuClick}
                className="px-6 py-2 md:px-8 md:py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-colors text-sm md:text-base"
              >
                Create New Accompliq
              </button>
            </div>
          </div>
        )}

        {contextMenuOpen && (
          <div
            className="fixed z-50 bg-white shadow-lg rounded-md py-1 w-40 md:w-48 border border-gray-200"
            style={{
              top: `${menuPosition.y}px`,
              left: `${Math.min(menuPosition.x, window.innerWidth - 180)}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center text-sm"
              onClick={() => handlePreview(selectedDraft)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </button>
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center text-sm"
              onClick={() => {
                handleEditDraft();
                setContextMenuOpen(false);
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </button>
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center text-sm"
              onClick={() => {
                handleDownload();
                setContextMenuOpen(false);
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600 flex items-center text-sm"
              onClick={() => {
                setShowDeleteConfirm(true);
                setContextMenuOpen(false);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        )}

        {showAccompliqPreview && (
          <AccompliqPreview
            isOpen={showAccompliqPreview}
            onClose={() => setShowAccompliqPreview(false)}
            draft={previewDraft}
          />
        )}

        {showEditModal && (
          <EditDraftModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            content={editedContent || selectedDraft?.draftContent || ""}
            onContentChange={setEditedContent}
            draftId={selectedDraft?.id}
            isLoading={editStatus === "saving"}
          />
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-4 md:p-6 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-medium mb-3 md:mb-4">
                Confirm Deletion
              </h3>
              <p className="mb-4 md:mb-6 text-sm md:text-base">
                Are you sure you want to delete this draft? This action cannot
                be undone.
              </p>
              <div className="flex justify-end gap-2 md:gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1 md:px-4 md:py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 md:px-4 md:py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm md:text-base"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accompliq;