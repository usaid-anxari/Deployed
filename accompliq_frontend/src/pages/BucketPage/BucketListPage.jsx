/* eslint-disable no-unused-vars */
import { MoreVertical, RefreshCw, Plus, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  completeBucketList,
  createBucketItem,
  deleteBucketItem,
  editBucketItem,
  getBucketLists,
} from "../../redux/feature/bucketList/bucketThunk";
import AddBucketModal from "./AddBucketModal";
import DeleteConfirmModal from "../../Models/DeleteConfirmModal";
import imageLogo from "../../Assets/AccompliqLogo-02.png";
import {
  ToastContainer,
  showToast,
  TOAST_MESSAGES,
} from "../../Utils/toastConfig.js";

const BucketList = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const tabs = ["All", "Completed", "In-completed"];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");
  const menuRef = useRef(null);
  const [deleteId, setDeleteId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const { items = [], loading = false } = useSelector(
    (state) => state.bucketLists || {}
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    dispatch(getBucketLists())
      .then(() => {
        setIsRefreshing(false);
        showToast.success(TOAST_MESSAGES.REFRESH_SUCCESS);
      })
      .catch(() => {
        setIsRefreshing(false);
        showToast.error(TOAST_MESSAGES.REFRESH_ERROR);
      });
  };

  const calculateProgress = (startDate, dueDate) => {
    const start = new Date(startDate).getTime();
    const end = new Date(dueDate).getTime();
    const now = new Date().getTime();

    if (start >= end) return 0;
    if (now <= start) return 0;
    if (now >= end) return 100;

    const totalDuration = end - start;
    const passedDuration = now - start;

    return Math.min(100, Math.max(0, (passedDuration / totalDuration) * 100));
  };

  const getProgressColor = (progress) => {
    const hue = ((100 - progress) * 1.2).toString(10);
    return `hsl(${hue}, 100%, 45%)`;
  };

  const getTimeRemaining = (dueDate) => {
    const now = new Date();
    const deadline = new Date(dueDate);
    const diff = deadline - now;

    if (diff <= 0) return "";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} day${days !== 1 ? "s" : ""} left`;
    if (hours > 0) return `${hours} hour${hours !== 1 ? "s" : ""} left`;
    return "Less than an hour left";
  };

  const DeadlinePassedActions = ({ onComplete, onEdit }) => {
    return (
      <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
        <p className="text-sm text-red-600 mb-2">
          Deadline has passed. What would you like to do?
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={onComplete}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-1 px-3 rounded-xl"
          >
            Mark as Completed
          </button>
          <button
            onClick={onEdit}
            className="flex-1 bg-[#2241CF] hover:bg-blue-600 text-white text-sm py-1 px-3 rounded-xl"
          >
            Extend Deadline
          </button>
        </div>
      </div>
    );
  };

  const filteredItems = items
    .filter((item) => {
      if (activeTab === "Completed") return item.isCompleted === true;
      if (activeTab === "In-completed") return item.isCompleted === false;
      return true;
    })
    .filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  useEffect(() => {
    dispatch(getBucketLists());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEdit = (item) => {
    setEditData(item);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteBucketItem(id))
      .then(() => {
        showToast.success(TOAST_MESSAGES.DELETE_SUCCESS);
      })
      .catch(() => {
        showToast.error(TOAST_MESSAGES.DELETE_ERROR);
      });
  };

  const handleComplete = (id) => {
    dispatch(completeBucketList(id))
      .then(() => {
        showToast.success(TOAST_MESSAGES.COMPLETE_SUCCESS);
      })
      .catch(() => {
        showToast.error(TOAST_MESSAGES.COMPLETE_ERROR);
      });
  };

  const handleSubmitModal = (formData) => {
    const isEdit = !!editData;
    const action = isEdit ? "update" : "create";

    const promise = isEdit
      ? dispatch(
          editBucketItem({
            bucketId: editData.id,
            formData: {
              title: formData.title,
              startDate: formData.startDate,
              dueDate: formData.dueDate,
              description: formData.description,
            },
            image: formData.image,
          })
        )
      : dispatch(
          createBucketItem({
            formData: {
              title: formData.title,
              startDate: formData.startDate,
              dueDate: formData.dueDate,
              description: formData.description,
            },
            image: formData.image,
          })
        );

    showToast.promise(promise, {
      loading: isEdit ? TOAST_MESSAGES.UPDATING : TOAST_MESSAGES.CREATING,
      success: isEdit
        ? TOAST_MESSAGES.UPDATE_SUCCESS
        : TOAST_MESSAGES.CREATE_SUCCESS,
      error: isEdit ? TOAST_MESSAGES.UPDATE_ERROR : TOAST_MESSAGES.CREATE_ERROR,
    });

    setShowModal(false);
    setEditData(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2241CF]"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header with Tabs and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Tabs - Scrollable on mobile */}
        <div className="w-full sm:w-auto overflow-x-auto pb-2">
          <div className="flex space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`whitespace-nowrap pb-2 px-1 ${
                  activeTab === tab
                    ? "border-b-2 border-[#2241CF] text-[#2241CF] font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Search - Hidden on mobile when not active */}
        <div className="w-full sm:w-auto flex items-center gap-3">
          {isMobileSearchOpen ? (
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <input
                type="text"
                placeholder="Search..."
                className="border p-2 pl-10 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-[#2241CF]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <button
                onClick={() => setIsMobileSearchOpen(false)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="sm:hidden p-2 text-gray-500 hover:text-gray-700"
            >
              <Search size={20} />
            </button>
          )}

          {/* Desktop Search */}
          <div className="hidden sm:block relative">
            <input
              type="text"
              placeholder="Search..."
              className="border p-2 pl-10 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-[#2241CF]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between sm:justify-end gap-3 mb-6">
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full transition-colors"
          disabled={isRefreshing}
        >
          <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
          {/* <span className="hidden sm:inline">Refresh</span> */}
        </button>

        <button
          className="flex items-center gap-2 bg-[#2241CF] text-white px-4 sm:px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add Bucket List</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Empty State */}
      {currentItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <img
            src={imageLogo}
            alt="No items"
            className="w-24 h-24 opacity-50 mb-4"
          />
          <h3 className="text-lg font-medium text-gray-700 mb-1">
            No bucket list items found
          </h3>
          <p className="text-gray-500 max-w-md">
            {searchTerm
              ? "Try adjusting your search or filter to find what you're looking for."
              : "Get started by creating your first bucket list item."}
          </p>
          {!searchTerm && (
            <button
              className="mt-4 bg-[#2241CF] text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
              onClick={() => setShowModal(true)}
            >
              Create Bucket List
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {currentItems.map((item) => {
          const progress = calculateProgress(item.startDate, item.dueDate);
          const progressColor = getProgressColor(progress);
          const timeRemaining = getTimeRemaining(item.dueDate);

          return (
            <div
              key={item.id}
              className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative"
            >
              {/* More Options */}
              <div
                className="absolute top-4 right-4 cursor-pointer"
                onClick={() =>
                  setOpenMenuId(openMenuId === item.id ? null : item.id)
                }
              >
                <MoreVertical
                  size={20}
                  className="text-gray-500 hover:text-gray-700"
                />
              </div>

              {openMenuId === item.id && (
                <div
                  ref={menuRef}
                  className="absolute top-10 right-4 bg-white shadow-lg rounded-lg w-40 z-10 border border-gray-200"
                >
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => setDeleteId(item.id)}
                  >
                    Delete
                  </button>

                  {!item.isCompleted && (
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      onClick={() => handleComplete(item.id)}
                    >
                      Mark as Complete
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="w-full sm:w-28 flex-shrink-0">
                  <img
                    src={item.imageUrl || imageLogo}
                    alt={item.title}
                    className="w-full h-28 rounded-lg object-cover shadow-sm border border-gray-200"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = imageLogo;
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Start:{" "}
                    {new Date(item.startDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    Deadline:{" "}
                    <span
                      className={
                        new Date(item.dueDate) < new Date()
                          ? "text-red-500"
                          : "text-gray-700"
                      }
                    >
                      {new Date(item.dueDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {item.isCompleted
                      ? "Completed"
                      : new Date(item.dueDate) < new Date()
                      ? "Deadline passed"
                      : `${Math.round(progress)}% complete`}{" "}
                    {!item.isCompleted &&
                      new Date(item.dueDate) > new Date() &&
                      `(${timeRemaining})`}
                  </span>
                  {!item.isCompleted && (
                    <span className="text-sm font-semibold">
                      {Math.round(progress)}%
                    </span>
                  )}
                </div>
                {!item.isCompleted && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: progressColor,
                      }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 mt-3 text-sm line-clamp-3">
                {item.description}
              </p>

              {/* Deadline Passed Actions */}
              {!item.isCompleted && new Date(item.dueDate) < new Date() && (
                <DeadlinePassedActions
                  onComplete={() => handleComplete(item.id)}
                  onEdit={() => handleEdit(item)}
                />
              )}

              {/* Status Badge */}
              {item.isCompleted && (
                <div className="absolute top-4 left-4 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Completed
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <div className="flex items-center gap-1 overflow-x-auto pb-2 w-full sm:w-auto">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`min-w-[36px] px-3 py-1 rounded-full ${
                  currentPage === index + 1
                    ? "bg-[#2241CF] text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 whitespace-nowrap">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredItems.length)}{" "}
            of {filteredItems.length} items
          </p>
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <AddBucketModal
          onClose={() => {
            setShowModal(false);
            setEditData(null);
          }}
          onSubmit={handleSubmitModal}
          initialData={editData}
        />
      )}

      {deleteId && (
        <DeleteConfirmModal
          onClose={() => setDeleteId(null)}
          onConfirm={() => {
            handleDelete(deleteId);
            setDeleteId(null);
          }}
          title="Delete Bucket List Item"
          message="Are you sure you want to delete this bucket list item? This action cannot be undone."
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default BucketList;
