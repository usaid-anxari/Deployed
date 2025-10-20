import React, { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, Info } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteAccount } from "../../redux/feature/auth/authThunk";
import { resetAuthState } from "../../redux/feature/auth/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from "../../Models/AccountDeleteConfirmModal";
import Loader from "../../Utils/Loader";

const DeleteAccount = () => {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get auth state from Redux
  const { userInfo, loading, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const userId = userInfo?.id;

  // Redirect to login when unauthenticated (after deletion)
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const toggleVisibility = () => setShow((prev) => !prev);

  const handleDeleteClick = () => {
    if (!password) {
      toast.error("Please enter your password.");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const result = await dispatch(deleteAccount({ userId, password }));

      if (deleteAccount.fulfilled.match(result)) {
        if (result.payload?.success) {
          toast.success("Your account has been deleted successfully");
          // Remove tokens
          localStorage.removeItem("authToken");
          sessionStorage.removeItem("authToken");
          // Navigate to login IMMEDIATELY before resetting state
          navigate("/login", { replace: true });
          // Now reset the state after a short timeout
          setTimeout(() => {
            dispatch(resetAuthState());
          }, 100);
        } else {
          toast.error(
            result.payload?.message || "Incorrect password. Please try again."
          );
          setPassword("");
        }
      } else if (deleteAccount.rejected.match(result)) {
        toast.error(
          result.payload?.message ||
            "Account deletion failed. Please try again."
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Account deletion error:", error);
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="w-full text-sm relative">
      {loading && <Loader />}

      <h2 className="text-lg font-semibold mb-6">Delete Account</h2>

      <div className="flex items-start gap-2 bg-orange-50 border border-orange-300 text-orange-700 p-3 rounded-md mb-4">
        <Info size={16} className="mt-0.5" />
        <span className="text-sm font-medium">
          This action cannot be undone.
        </span>
      </div>

      <p className="text-gray-700 text-sm mb-2">
        All of your data, including your posts and personal information, will be
        permanently removed.
      </p>
      <p className="text-gray-700 text-sm mb-6">
        Please confirm your password to permanently delete your account.
      </p>

      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Deletion
        </label>
        <div className="flex items-center border border-gray-300 rounded-md px-3 h-10 bg-white">
          <Lock size={16} className="text-gray-400 mr-2" />
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 outline-none text-sm"
            placeholder="Enter your password"
          />
          <button onClick={toggleVisibility} type="button">
            {show ? (
              <EyeOff size={16} className="text-gray-400" />
            ) : (
              <Eye size={16} className="text-gray-400" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
          <Info size={12} className="text-gray-400" />
          Your password is required to proceed with account deletion.
        </p>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          className="bg-white text-gray-800 border border-gray-300 px-5 h-10 rounded-md hover:bg-gray-100"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
        <button
          onClick={handleDeleteClick}
          className="bg-orange-500 text-white px-5 h-10 rounded-md hover:bg-orange-600"
          disabled={loading}
        >
          Delete Account
        </button>
      </div>

      {showConfirm && (
        <ConfirmModal
          open={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleConfirmDelete}
          loading={loading}
          message="Are you sure you want to permanently delete your account? This action cannot be undone."
        />
      )}
    </div>
  );
};

export default DeleteAccount;
