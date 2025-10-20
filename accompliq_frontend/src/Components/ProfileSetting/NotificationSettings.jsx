import React, { useState } from "react";

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    upgradeReminders: true,
    family: false,
    promotions: true,
    customization: true,
  });

  const handleToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const items = [
    {
      id: "upgradeReminders",
      title: "Upgrade Reminders",
      desc: "Upgrade due date",
    },
    {
      id: "family",
      title: "Family",
      desc: "Family sharing",
    },
    {
      id: "promotions",
      title: "Promotions & Offers",
      desc: "Discounts & Coupons, Special Deals on OTC Products,",
    },
    {
      id: "customization",
      title: "Customization Options",
      desc: "Turn off non-essential notifications, Set preferred contact method,",
    },
  ];

  return (
    <div className="w-full text-sm">
      <h2 className="text-lg font-semibold mb-6">Notification Settings</h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white rounded-md px-4 py-3 border border-gray-200"
          >
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>

            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications[item.id]}
                onChange={() => handleToggle(item.id)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 transition-all duration-300">
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                    notifications[item.id] ? "translate-x-full" : ""
                  }`}
                />
              </div>
            </label>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-10">
        <button className="bg-blue-600 text-white px-6 h-10 rounded-md text-sm hover:bg-blue-700">
          Save
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;
