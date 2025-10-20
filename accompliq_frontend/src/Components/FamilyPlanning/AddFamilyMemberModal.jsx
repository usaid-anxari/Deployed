import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { inviteFamilyMembers } from "../../redux/feature/stripe/stripeThunk";
import { showToast } from "../../Utils/toastConfig";
import { FaTimes, FaPlus, FaMinus } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";

const AddFamilyMemberModal = ({ onClose, onInviteSuccess }) => {
  const [emails, setEmails] = useState([""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
    setError("");
  };

  const addEmailField = () => {
    if (emails.length < 5) {
      setEmails([...emails, ""]);
    }
  };

  const removeEmailField = (index) => {
    if (emails.length > 1) {
      const newEmails = [...emails];
      newEmails.splice(index, 1);
      setEmails(newEmails);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validEmails = emails.filter((email) => email.trim() !== "");

    if (validEmails.length === 0) {
      setError("Please enter at least one email address");
      return;
    }

    const invalidEmails = validEmails.filter(
      (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );

    if (invalidEmails.length > 0) {
      setError("Please enter valid email addresses");
      return;
    }

    setIsLoading(true);

    if (userInfo?.id) {
      dispatch(
        inviteFamilyMembers({
          inviterId: userInfo.id,
          inviteeEmails: validEmails,
        })
      )
        .unwrap()
        .then((res) => {
          if (res.invitesSent?.length) {
            showToast.success(`Invited: ${res.invitesSent.join(", ")}`);
          }

          if (res.invitesSkipped?.length) {
            res.invitesSkipped.forEach(({ email, reason }) => {
              if (reason === "already_invited") {
                showToast.error(`${email} has already been invited.`);
              } else if (reason === "already_registered") {
                showToast.error(`${email} already has an account.`);
              } else {
                showToast.error(`Could not invite ${email}.`);
              }
            });
          }

          if (onInviteSuccess) {
            onInviteSuccess();
          }
          onClose();
        })
        .catch((err) => {
          console.error("Error inviting members:", err);
          setError("Failed to send invitations. Please try again.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setError("Unable to get inviter information. Please log in again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Family Members</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Enter email addresses of family members you want to invite
        </p>

        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-3">
            {emails.map((email, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email {index + 1} {index === 0 && "*"}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      placeholder="member@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2241CF] focus:border-[#2241CF]"
                      required={index === 0}
                    />
                    {emails.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEmailField(index)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
                      >
                        <FaMinus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {emails.length < 5 && (
            <button
              type="button"
              onClick={addEmailField}
              className="mt-3 flex items-center text-sm text-[#2241CF] hover:text-blue-700"
            >
              <FaPlus className="mr-1 h-3 w-3" />
              Add another email
            </button>
          )}

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-[#2241CF] text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center min-w-[140px]"
            >
              {isLoading ? (
                <>
                  <ImSpinner8 className="animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                "Send Invitations"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFamilyMemberModal;
