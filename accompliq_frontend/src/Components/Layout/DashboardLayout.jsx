import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardNavbar from "./DashboardNavbar";
import Sidebar from "./Sidebar";

const NAVBAR_HEIGHT = "4rem"; // 64px

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen((prev) => !prev);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-visible">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        isMobileSidebarOpen={isMobileSidebarOpen}
        closeMobileSidebar={closeMobileSidebar}
      />

      <div
        className="flex-1 flex flex-col overflow-visible transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isCollapsed ? "5rem" : "16rem",
          marginTop: NAVBAR_HEIGHT,
          transition: "margin 0.3s",
        }}
      >
        <DashboardNavbar
          toggleMobileSidebar={toggleMobileSidebar}
          isCollapsed={isCollapsed}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet /> {/* This renders the nested route component */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
