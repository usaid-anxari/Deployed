import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const SettingsPage = () => {
  const tabs = [
    { id: "", label: "Account" },
    { id: "choose-plan", label: "Choose Plan" },
    { id: "notification", label: "Notification" },
    { id: "change-password", label: "Change Password" },
    { id: "delete-account", label: "Delete Account", danger: true },
  ];

  const handleTabClick = () => {};

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-4 flex justify-center">
      <div className="bg-white rounded-2xl shadow-sm w-full max-w-[960px] p-10 flex flex-col md:flex-row gap-12 font-sans">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 text-sm">
          <h1 className="text-2xl font-semibold mb-1">Settings</h1>
          <p className="text-gray-500 mb-6">Set up your profile</p>
          <div className="space-y-1">
            {tabs.map((tab) => (
              <NavLink
                key={tab.id}
                to={`/profile-setting/${tab.id}`} // 👈 URL for routing
                end // exact for the root "account"
                onClick={() => handleTabClick(tab.id)}
                className={({ isActive }) =>
                  `block w-full px-4 py-2 rounded-md ${
                    isActive
                      ? "bg-[#F1F5F9] text-blue-600 font-medium"
                      : tab.danger
                      ? "text-red-600 hover:bg-gray-100"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          <Outlet /> {/* 🔥 Render nested tab content here */}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
