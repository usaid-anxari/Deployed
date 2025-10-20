// src/components/ConfirmModal.jsx
import React from "react";
import { X } from "lucide-react";

const ConfirmModal = ({ open, onClose, onConfirm, loading, message }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Confirm Deletion
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 text-sm border rounded-md text-gray-700 border-gray-300 hover:bg-gray-100"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
