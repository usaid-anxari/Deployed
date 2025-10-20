/* eslint-disable no-unused-vars */
import {
  Fragment,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Transition } from "@headlessui/react";
import {
  fetchFamilyMembers,
  resendInviteLink,
  removeFamilyMember,
} from "../../redux/feature/stripe/stripeThunk";
import AddFamilyMemberModal from "./AddFamilyMemberModal";
import { showToast, TOAST_MESSAGES } from "../../Utils/toastConfig";
import toast from "react-hot-toast";
import ConfirmationModal from "../../Models/ConfirmationModal";

const FamilyMembersTable = () => {
  const [selectedTab, setSelectedTab] = useState("All");
  const [selectedRows, setSelectedRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationConfig, setConfirmationConfig] = useState({
    title: "",
    message: "",
    confirmText: "",
    confirmColor: "blue",
    onConfirm: () => {},
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const userInfo = useSelector((state) => state.auth.userInfo);
  const initialFetchDone = useRef(false);
  const dispatch = useDispatch();

  const {
    invitedMembers = [],
    loadingFamilyMembers,
    loadingResendInvite,
    loading,
    error,
  } = useSelector((state) => state.stripe);

  const isFamilyAdmin = !userInfo?.invitedBy;
  const inviterId = isFamilyAdmin ? userInfo?.id : null;

  const filteredData = useMemo(() => {
    return selectedTab === "All"
      ? invitedMembers
      : invitedMembers.filter((item) => {
          if (!item.status) return false;
          return item.status.toLowerCase() === selectedTab.toLowerCase();
        });
  }, [selectedTab, invitedMembers]);

  const invitedCount = useMemo(
    () =>
      invitedMembers.filter(
        (item) =>
          item.role !== "Admin" &&
          (item.status === "pending" ||
            item.status === "Active" ||
            item.status === "accepted")
      ).length,
    [invitedMembers]
  );

  const isInvitedUser = !!userInfo?.invitedBy;
  const maxInvitesReached = invitedCount >= 3;
  const disableInviteButton = !isFamilyAdmin || maxInvitesReached;

  const fetchMembers = useCallback(() => {
    if (inviterId && !initialFetchDone.current) {
      dispatch(fetchFamilyMembers(inviterId))
        .unwrap()
        .catch((error) => {
          if (error === "Only the family plan admin can view members") {
            showToast.error("Only the family plan admin can manage members");
          }
        });
      initialFetchDone.current = true;
    }
  }, [dispatch, inviterId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleInviteSuccess = useCallback(() => {
    if (userInfo?.id) {
      dispatch(fetchFamilyMembers(userInfo.id));
    }
  }, [dispatch, userInfo?.id]);

  const handleResendLink = useCallback(
    async (memberId) => {
      setIsProcessing(true);
      const toastId = showToast.loading("Resending invitation...");
      try {
        await dispatch(
          resendInviteLink({ inviteId: memberId, inviterId })
        ).unwrap();
        showToast.success(TOAST_MESSAGES.FAMILY_INVITE_RESENT);
      } catch (error) {
        showToast.error(error.message || TOAST_MESSAGES.FAMILY_INVITE_FAILED);
      } finally {
        toast.dismiss(toastId);
        setIsProcessing(false);
        setShowConfirmation(false);
      }
    },
    [dispatch, inviterId]
  );

  const handleRemoveUser = useCallback(
    async (memberId) => {
      setIsProcessing(true);
      const toastId = showToast.loading("Removing family member...");

      try {
        await dispatch(removeFamilyMember({ memberId, inviterId })).unwrap();
        showToast.success(TOAST_MESSAGES.FAMILY_MEMBER_REMOVED);
        setShowConfirmation(false);
        await dispatch(fetchFamilyMembers(inviterId));
      } catch (error) {
        showToast.error(error.message || TOAST_MESSAGES.FAMILY_REMOVE_FAILED);
      } finally {
        toast.dismiss(toastId);
        setIsProcessing(false);
      }
    },
    [dispatch, inviterId]
  );

  const handleRemoveClick = useCallback(
    (memberId) => {
      const onConfirm = () => {
        handleRemoveUser(memberId);
      };

      setConfirmationConfig({
        title: "Remove Family Member",
        message: "Are you sure you want to remove this user?",
        confirmText: "Remove User",
        confirmColor: "red",
        onConfirm: onConfirm,
      });
      setShowConfirmation(true);
    },
    [handleRemoveUser]
  );

  const handleResendClick = useCallback(
    (memberId) => {
      setConfirmationConfig({
        title: "Resend Invitation",
        message:
          "Are you sure you want to resend the invitation link to this user?",
        confirmText: "Resend Link",
        confirmColor: "blue",
        onConfirm: () => handleResendLink(memberId),
      });
      setShowConfirmation(true);
    },
    [handleResendLink]
  );

  const toggleRowSelection = useCallback((id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedRows((prev) =>
      prev.length === filteredData.length
        ? []
        : filteredData.map((item) => item.id)
    );
  }, [filteredData]);

  const TabButtons = useMemo(
    () =>
      ["All", "Active", "Pending"].map((tab) => (
        <button
          key={tab}
          onClick={() => setSelectedTab(tab)}
          className={`px-3 py-1 whitespace-nowrap border-b-2 ${
            selectedTab === tab
              ? "border-[#2241CF] text-[#2241CF] font-semibold"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {tab}
        </button>
      )),
    [selectedTab]
  );

  const MobileMemberCard = useCallback(
    ({ item }) => (
      <div
        key={item.id}
        className={`p-4 border rounded-lg mb-3 ${
          selectedRows.includes(item.id)
            ? "bg-blue-50 border-blue-200"
            : "border-gray-200"
        }`}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={selectedRows.includes(item.id)}
              onChange={() => toggleRowSelection(item.id)}
              className="h-4 w-4 rounded focus:ring-[#2241CF]"
            />
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="h-10 w-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/40";
                }}
              />
            ) : (
              <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm text-gray-500">
                  {(
                    item.name?.charAt(0) ||
                    item.email?.charAt(0) ||
                    "?"
                  ).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-medium text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.email}</p>
            </div>
          </div>
          <ActionMenu item={item} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500">Role</p>
            <span
              className={`inline-flex items-center ${
                item.role === "Admin" ? "text-[#2241CF]" : "text-gray-600"
              }`}
            >
              {item.role}
            </span>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <span
              className={`inline-flex items-center ${
                item.status === "Active" ? "text-[#0D33FF]" : "text-[#FBBC05]"
              }`}
            >
              {item.status === "Active" ? "● Active" : "● Pending"}
            </span>
          </div>
        </div>
      </div>
    ),
    [selectedRows, toggleRowSelection]
  );

  const ActionMenu = useCallback(
    ({ item }) => {
      // If role is Admin, return a non-clickable hyphen
      if (item.role === "Admin") {
        return <span className="text-gray-400">-</span>;
      }

      return (
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 bottom-10 z-50 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1 max-h-[300px] overflow-auto">
                {item.status === "pending" && (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => handleResendClick(item.id)}
                        className={`${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        } block w-full px-4 py-2 text-left text-sm`}
                      >
                        Resend Link
                      </button>
                    )}
                  </Menu.Item>
                )}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => handleRemoveClick(item.id)}
                      className={`${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      } block w-full px-4 py-2 text-left text-sm`}
                      disabled={isProcessing}
                    >
                      Remove User
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      );
    },
    [handleResendClick, handleRemoveClick, isProcessing]
  );

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      {/* Show admin info at the top for all non-admin members */}
      {isInvitedUser && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600">A</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Family Plan Admin</h4>
              <p className="text-sm text-gray-500">
                {userInfo.invitedByEmail || "Admin details"}{" "}
                {/* Add actual admin email here */}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Only show management UI for admin users */}
      {isFamilyAdmin ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <div className="flex space-x-1 sm:space-x-4 overflow-x-auto pb-2 w-full sm:w-auto custom-scrollbar">
              {TabButtons}
            </div>

            <button
              onClick={() => setShowModal(true)}
              disabled={maxInvitesReached}
              className={`flex items-center space-x-1 px-3 py-2 rounded-full w-full sm:w-auto justify-center
              ${
                maxInvitesReached
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-[#2241CF] text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              }
            `}
              title={
                maxInvitesReached
                  ? "You have reached the maximum number of family invites."
                  : "Invite new family members"
              }
            >
              <span>+</span>
              <span>Invite Family Member</span>
            </button>
          </div>

          {loadingFamilyMembers && !showModal && !showConfirmation && (
            <p className="text-gray-500">Loading family members...</p>
          )}
          {error && <p className="text-red-500">{error}</p>}

          {/* Mobile Cards */}
          <div className="block md:hidden space-y-3">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <MobileMemberCard key={item.id} item={item} />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No members found</p>
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            {filteredData.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={
                          selectedRows.length === filteredData.length &&
                          filteredData.length > 0
                        }
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded focus:ring-[#2241CF]"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className={
                        selectedRows.includes(item.id) ? "bg-blue-50" : ""
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(item.id)}
                          onChange={() => toggleRowSelection(item.id)}
                          className="h-4 w-4 rounded focus:ring-[#2241CF]"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-8 w-8 rounded-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/40";
                            }}
                          />
                        ) : (
                          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs text-gray-500">
                              {(
                                item.name?.charAt(0) ||
                                item.email?.charAt(0) ||
                                "?"
                              ).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`${
                            item.role === "Admin"
                              ? "text-[#2241CF] font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          {item.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.status === "Active"
                              ? "text-[#0D33FF]"
                              : "text-[#FBBC05]"
                          }`}
                        >
                          {item.status === "Active" ? "● Active" : "● Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <ActionMenu item={item} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center py-4">No members found</p>
            )}
          </div>
        </>
      ) : (
        !loading &&
        !error && (
          <div className="text-center py-8 text-gray-500">
            Only the family plan admin can view and manage members
          </div>
        )
      )}

      {/* Modals (shown for all users but only functional for admin) */}
      {showModal && (
        <AddFamilyMemberModal
          onClose={() => setShowModal(false)}
          onInviteSuccess={handleInviteSuccess}
        />
      )}
      {showConfirmation && (
        <ConfirmationModal
          isOpen={showConfirmation}
          onClose={() => {
            !isProcessing && setShowConfirmation(false);
          }}
          onConfirm={confirmationConfig.onConfirm}
          title={confirmationConfig.title}
          message={confirmationConfig.message}
          confirmText={confirmationConfig.confirmText}
          confirmColor={confirmationConfig.confirmColor}
          isLoading={isProcessing}
        />
      )}
    </div>
  );
};

export default FamilyMembersTable;
