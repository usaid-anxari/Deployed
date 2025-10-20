import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateProfileSettings,
  fetchUserData,
} from "../../redux/feature/auth/authThunk";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../Utils/cropImage";
import LoadingSpinner from "../../Utils/Loader";

const AccountSettings = () => {
  const [selectedProfilePictureFile, setSelectedProfilePictureFile] =
    useState(null);
  const [showModal, setShowModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageForCrop, setImageForCrop] = useState(null);
  const [isFormModified, setIsFormModified] = useState(false);
  const initialFormData = useRef(null);

  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  // Form state, now includes phoneNumber
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    gender: "male",
    dateOfBirth: "",
    phoneNumber: "",
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!userInfo) {
      const fetchData = async () => {
        try {
          await dispatch(fetchUserData()).unwrap();
        } catch (err) {
          toast.error("Failed to load profile data");
        } finally {
          setIsInitialLoad(false);
        }
      };
      fetchData();
    } else {
      setIsInitialLoad(false);
    }
  }, [dispatch, userInfo]);

  // Update form when userInfo changes
  useEffect(() => {
    if (userInfo) {
      const newFormData = {
        fullName: userInfo.fullName || "",
        email: userInfo.email || "",
        gender: userInfo.gender?.toLowerCase() || "male",
        dateOfBirth: userInfo.dateOfBirth
          ? userInfo.dateOfBirth.slice(0, 10)
          : "",
        phoneNumber: userInfo.phoneNumber || "",
      };

      setFormData(newFormData);
      // Set initial form data only once
      if (!initialFormData.current) {
        initialFormData.current = { ...newFormData };
      }
      setSelectedProfilePictureFile(null);
    }
  }, [userInfo]);

  // Check for changes whenever formData or profile picture changes
  useEffect(() => {
    if (initialFormData.current) {
      const hasFormChanged =
        formData.fullName !== initialFormData.current.fullName ||
        formData.gender !== initialFormData.current.gender ||
        formData.dateOfBirth !== initialFormData.current.dateOfBirth ||
        formData.phoneNumber !== initialFormData.current.phoneNumber ||
        selectedProfilePictureFile !== null;

      setIsFormModified(hasFormChanged);
    }
  }, [formData, selectedProfilePictureFile]);

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImageForCrop(reader.result);
        setShowModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("fullName", formData.fullName);
    fd.append("gender", formData.gender);
    fd.append("dateOfBirth", formData.dateOfBirth);
    fd.append("phoneNumber", formData.phoneNumber);

    // Log selectedProfilePictureFile info
    if (selectedProfilePictureFile) {
      fd.append("profilePicture", selectedProfilePictureFile);
    } else {
    }

    await dispatch(updateProfileSettings(fd));

    // Update initial data after successful save
    if (userInfo) {
      initialFormData.current = {
        fullName: formData.fullName,
        email: userInfo.email,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        phoneNumber: formData.phoneNumber,
      };
      setSelectedProfilePictureFile(null);
    }
  };

  const handleCropSave = async () => {
    const croppedImageBlob = await getCroppedImg(
      imageForCrop,
      croppedAreaPixels,
      zoom
    );
    // Convert blob to file
    const croppedFile = new File([croppedImageBlob], "avatar.jpg", {
      type: "image/jpeg",
    });
    setSelectedProfilePictureFile(croppedFile);
    setShowModal(false);
    setImageForCrop(null);
  };

  // Loading states
  if (isInitialLoad) {
    return <LoadingSpinner />;
  }

  if (error && !userInfo) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Failed to load profile data</div>
      </div>
    );
  }

  // Get image preview
  const imagePreview = selectedProfilePictureFile
    ? URL.createObjectURL(selectedProfilePictureFile)
    : userInfo.profilePicture;

  return (
    <form className="space-y-6 text-sm" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold">Account Settings</h2>

      {/* Profile Picture */}
      <div>
        {/* <p className="text-xs text-gray-500 mb-2">
          400px, JPG or PNG, max 200kb
        </p> */}
        <div className="flex items-center gap-4">
          <div className="h-44 w-44 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
            {imagePreview && typeof imagePreview === "string" ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "";
                }}
              />
            ) : (
              userInfo.fullName?.charAt(0) || "U"
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="profilePictureInput"
            onChange={handleProfilePictureChange}
          />
          <button
            className="border border-gray-300 bg-white px-4 h-10 rounded-md shadow-sm text-sm"
            type="button"
            onClick={() =>
              document.getElementById("profilePictureInput").click()
            }
          >
            Upload Image
          </button>
        </div>
        {/* Simple modal for image selection */}
        {showModal && imageForCrop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
              <h4 className="mb-2 font-medium">Crop Your Profile Picture</h4>
              <div
                style={{
                  position: "relative",
                  width: 300,
                  height: 300,
                  background: "#eee",
                }}
              >
                <Cropper
                  image={imageForCrop}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  showGrid={false}
                  cropShape="round"
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                />
              </div>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-64 mt-3"
              />
              <div className="flex gap-2 mt-4">
                <button
                  className="px-4 py-1 bg-blue-600 text-white rounded"
                  onClick={handleCropSave}
                  type="button"
                >
                  Save
                </button>
                <button
                  className="px-4 py-1 bg-gray-200 rounded"
                  onClick={() => {
                    setShowModal(false);
                    setImageForCrop(null);
                  }}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 h-10"
        />
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 h-10"
          pattern="[0-9+\-() ]{7,}"
        />
      </div>

      {/* Email (readonly) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="text"
          value={formData.email}
          disabled
          className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 h-10 text-gray-700"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gender
        </label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 h-10"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Date of Birth */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date of Birth
        </label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 h-10"
          max={new Date().toISOString().slice(0, 10)}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isFormModified || loading}
          className={`bg-blue-600 text-white rounded-md px-5 h-10 hover:bg-blue-700 text-sm shadow-sm ${
            !isFormModified || loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default AccountSettings;
