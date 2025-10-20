import React from "react";
import { MoreVertical } from "lucide-react";

export default function SampleBuckets() {
  const buckets = [
    {
      id: 1,
      bucketName: "Write a book",
      startDate: "03 May 2025",
      endDate: "12 May 2026",
      photo: "https://randomuser.me/api/portraits/men/21.jpg",
      status: "completed",
      progress: 0,
      description: "Unleash creativity and tell a tale"
    },
    {
      id: 2,
      bucketName: "Art",
      startDate: "03 May 2025",
      endDate: "04 May 2025",
      photo: "https://randomuser.me/api/portraits/men/42.jpg",
      status: "10 hours left",
      progress: 0,
      description: "Set up a studio to make pottery, paint, or blow glass."
    },
    {
      id: 3,
      bucketName: "Exploration",
      startDate: "03 April 2025",
      endDate: "02 May 2025",
      photo: "https://cdn.pixabay.com/photo/2022/09/07/18/50/forest-7439390_1280.jpg",
      status: "completed",
      progress: 100,
      description: "I will explore Tokyo distircts"
    },
     {
      id: 4,
      bucketName: "Travelling",
      startDate: "03 Sep 2025",
      endDate: "12 Dec 2025",
      photo: "https://media.istockphoto.com/id/1465916031/photo/the-way-to-the-plane.jpg?s=1024x1024&w=is&k=20&c=doT99YUQz3li5oUYlR_XMDDhHgT4GQzf-H2v3U2Kuno=",
      status: "completed",
      progress: 0,
      description: "Secret spots in London"
    },
    {
      id: 5,
      bucketName: "Programming",
      startDate: "13 Sep 2025",
      endDate: "14 Feb 2026",
      photo: "https://randomuser.me/api/portraits/men/13.jpg",
      status: "4 months left",
      progress: 25,
      description: "Expand tech skills by learning new programming langauges"
    },
    {
      id: 6,
      bucketName: "Business",
      startDate: "06 Oct 2025",
      endDate: "08 Dec 2025",
      photo: "https://randomuser.me/api/portraits/men/3.jpg",
      status: "2 months left",
      progress: 0,
      description: "I will explore Tokyo distircts"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-16">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1E1E1E] leading-snug text-center mb-12 mt-8">Sample Buckets</h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buckets.map((bucket) => (
          <div
            key={bucket.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={bucket.photo}
                  alt={bucket.bucketName}
                  className="w-12 h-12 rounded-full object-cover ring-4 ring-yellow-400"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {bucket.bucketName}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <span>Start: {bucket.startDate}</span>
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Deadline */}
            <div className="mb-4">
              <span className="text-sm text-gray-600">
                Deadline:{" "}
                <span
                  className={
                    bucket.status === "completed"
                      ? "text-green-600 font-medium"
                      : "text-red-500 font-medium"
                  }
                >
                  {bucket.endDate}
                </span>
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">
                  {bucket.progress}% complete ({bucket.status})
                </span>
                <span className="font-semibold text-gray-900">
                  {bucket.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    bucket.status === "completed"
                      ? "bg-blue-500"
                      : "bg-blue-500"
                  }`}
                  style={{ width: `${bucket.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-gray-700 text-sm">{bucket.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}