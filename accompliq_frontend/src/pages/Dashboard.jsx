import React from "react";

const Dashboard = () => {
  return (
    <div className="p-6">
      <div className="mb-6 flex justify-end"></div>
      {/* First Row - 4 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-[#2241CF] p-6 rounded-2xl shadow text-white flex flex-col justify-between h-full">
          <h3 className="text-md font-medium mb-2">Total Revenue Generated</h3>
          <p className="text-2xl font-bold">
            $783 <span className="text-sm font-normal">This Month</span>
          </p>
        </div>

        <div className="bg-[#FBBC05] p-6 rounded-2xl shadow text-white flex flex-col justify-between h-full">
          <h3 className="text-md font-medium mb-2">Public Planning Created</h3>
          <p className="text-2xl font-bold">783</p>
        </div>

        <div className="bg-[#5F5F5F] p-6 rounded-2xl shadow text-white flex flex-col justify-between h-full">
          <h3 className="text-md font-medium mb-2">Bucket List</h3>
          <p className="text-2xl font-bold">76</p>
        </div>

        <div className="bg-[#BB92FF] p-6 rounded-2xl shadow text-white flex flex-col justify-between h-full">
          <h3 className="text-md font-medium mb-2">Personal Planning Form</h3>
          <p className="text-2xl font-bold">76</p>
        </div>
      </div>

      {/* Second Row - 4 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#BB92FF] p-6 rounded-2xl shadow text-white flex flex-col justify-between h-full">
          <h3 className="text-md font-medium mb-2">Family User</h3>
          <p className="text-2xl font-bold">76</p>
        </div>

        <div className="bg-[#5F5F5F] p-6 rounded-2xl shadow text-white flex flex-col justify-between h-full">
          <h3 className="text-md font-medium mb-2">Overall User</h3>
          <p className="text-2xl font-bold">76</p>
        </div>

        <div className="bg-[#FBBC05] p-6 rounded-2xl shadow text-white flex flex-col justify-between h-full">
          <h3 className="text-md font-medium mb-2">Family Plan Created</h3>
          <p className="text-2xl font-bold">$56k</p>
        </div>

        <div className="bg-[#2241CF] p-6 rounded-2xl shadow text-white flex flex-col justify-between h-full">
          <h3 className="text-md font-medium mb-2">Created Accompliq</h3>
          <p className="text-2xl font-bold">783</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
