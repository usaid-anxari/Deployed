/* eslint-disable no-unused-vars */
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";

const AddBucketModal = ({ onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    dueDate: "",
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({
    title: "",
    startDate: "",
    dueDate: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        startDate: initialData.startDate
          ? new Date(initialData.startDate).toISOString().slice(0, 10)
          : "",
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().slice(0, 10)
          : "",
        description: initialData.description || "",
        image: null,
      });
      if (initialData.imageUrl) {
        setImagePreview(initialData.imageUrl);
      }
    }
  }, [initialData]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      title: "",
      startDate: "",
      dueDate: "",
      description: "",
    };

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      valid = false;
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
      valid = false;
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
      valid = false;
    } else if (new Date(formData.startDate) < new Date()) {
      newErrors.startDate = "Start date cannot be in the past";
      valid = false;
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Deadline is required";
      valid = false;
    } else if (
      formData.startDate &&
      new Date(formData.dueDate) < new Date(formData.startDate)
    ) {
      newErrors.dueDate = "Deadline cannot be before start date";
      valid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      valid = false;
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("Image size should be less than 5MB");
        return;
      }
      setFormData({ ...formData, image: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      if (!initialData) {
        // Only reset if it's not an edit
        setFormData({
          title: "",
          startDate: "",
          dueDate: "",
          description: "",
          image: null,
        });
        setImagePreview(null);
      }
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Bucket List" : "Add New Bucket List"}
        </h2>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="My Bucket"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2241CF] focus:border-[#2241CF] ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              maxLength={100}
            />
            <div className="flex justify-between mt-1">
              {errors.title ? (
                <p className="text-red-500 text-xs">{errors.title}</p>
              ) : (
                <div></div>
              )}
              <p className="text-xs text-gray-500">
                {formData.title.length}/100
              </p>
            </div>
          </div>

          {/* Date Fields - Stack on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2241CF] focus:border-[#2241CF] ${
                  errors.startDate ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2241CF] focus:border-[#2241CF] ${
                  errors.dueDate ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                min={
                  formData.startDate || new Date().toISOString().split("T")[0]
                }
              />
              {errors.dueDate && (
                <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Describe your bucket list item..."
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2241CF] focus:border-[#2241CF] h-32 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              maxLength={500}
            ></textarea>
            <div className="flex justify-between mt-1">
              {errors.description ? (
                <p className="text-red-500 text-xs">{errors.description}</p>
              ) : (
                <div></div>
              )}
              <p className="text-xs text-gray-500">
                {formData.description.length}/500
              </p>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="bucketImageUpload"
              />
              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-contain rounded-lg"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="bucketImageUpload"
                  className="flex flex-col items-center justify-center cursor-pointer py-8"
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 5MB
                  </p>
                </label>
              )}
            </div>
          </div>

          {/* Buttons - Stack on mobile */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-[#2241CF] text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Processing..."
                : initialData
                ? "Update Bucket"
                : "Create Bucket"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBucketModal;
