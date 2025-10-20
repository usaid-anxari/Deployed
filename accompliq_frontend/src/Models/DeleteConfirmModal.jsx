import { X } from "lucide-react";

const DeleteConfirmModal = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl w-[400px] p-6 relative shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        {/* Modal Content */}
        <h2 className="text-2xl font-bold mb-4 text-center">Confirm Delete</h2>
        <p className="text-center text-gray-600 mb-6">
          Are you sure you want to delete this bucket item?
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            className="px-8 py-1 border rounded-full hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-8 py-1 bg-red-600 text-white rounded-full hover:bg-red-700"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
