/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../redux/feature/auth/authThunk";
import { showToast } from "../../Utils/toastConfig";
import Loader from "../../Utils/Loader";

const ChangePassword = () => {
  const [current, setCurrent] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.auth);

  const toggleVisibility = () => setShow(!show);

  const passwordChecks = {
    hasUppercase: /[A-Z]/.test(newPassword),
    hasNumber: /\d/.test(newPassword),
    hasLength: newPassword.length >= 8,
  };

  const getIndicatorColor = (condition) => {
    return condition ? "text-green-600" : "text-orange-500";
  };

  const getProgress = () => {
    const checks = Object.values(passwordChecks);
    return `${(checks.filter(Boolean).length / checks.length) * 100}%`;
  };

  const handleSubmit = async () => {
    if (newPassword !== confirm) {
      showToast.error("Passwords do not match");
      return;
    }

    const promise = dispatch(
      changePassword({ currentPassword: current, newPassword })
    );

    showToast.promise(promise.unwrap(), {
      loading: "Changing password...",
      success: "Password changed successfully!",
      error: (err) => err?.message || "Something went wrong. Please try again.",
    });

    try {
      const result = await promise.unwrap();
      if (result.success) {
        setCurrent("");
        setNewPassword("");
        setConfirm("");
      }
    } catch {
      // No need to do anything extra. `toast.promise` handles this.
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="w-full text-sm">
      <h2 className="text-lg font-semibold mb-6">Change Password</h2>

      {/* Current Password */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Current Password
        </label>
        <div className="flex items-center border border-gray-300 rounded-md px-3 h-10 bg-white">
          <Lock size={16} className="text-gray-400 mr-2" />
          <input
            type={show ? "text" : "password"}
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="flex-1 outline-none text-sm"
          />
          <button onClick={toggleVisibility} type="button">
            {show ? (
              <EyeOff size={16} className="text-gray-400" />
            ) : (
              <Eye size={16} className="text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          New Password
        </label>
        <div className="flex items-center border border-gray-300 rounded-md px-3 h-10 bg-white">
          <Lock size={16} className="text-gray-400 mr-2" />
          <input
            type={show ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="flex-1 outline-none text-sm"
          />
          <button onClick={toggleVisibility} type="button">
            {show ? (
              <EyeOff size={16} className="text-gray-400" />
            ) : (
              <Eye size={16} className="text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm New Password
        </label>
        <div className="flex items-center border border-gray-300 rounded-md px-3 h-10 bg-white">
          <Lock size={16} className="text-gray-400 mr-2" />
          <input
            type={show ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="flex-1 outline-none text-sm"
          />
          <button onClick={toggleVisibility} type="button">
            {show ? (
              <EyeOff size={16} className="text-gray-400" />
            ) : (
              <Eye size={16} className="text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Password Strength Feedback
      <div className="mb-6">
        <div
          className="h-1 rounded bg-orange-500"
          style={{ width: getProgress() }}
        />
        <p className="text-xs text-orange-500 mt-2">
          Weak password. Must contain at least:
        </p>
        <ul className="text-xs mt-1 space-y-1">
          <li className={getIndicatorColor(passwordChecks.hasUppercase)}>
            • At least 1 uppercase
          </li>
          <li className={getIndicatorColor(passwordChecks.hasNumber)}>
            • At least 1 number
          </li>
          <li className={getIndicatorColor(passwordChecks.hasLength)}>
            • At least 8 characters
          </li>
        </ul>
      </div> */}

      <div className="flex justify-end">
        <button
          className="bg-blue-600 text-white px-6 h-10 rounded-md text-sm hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
