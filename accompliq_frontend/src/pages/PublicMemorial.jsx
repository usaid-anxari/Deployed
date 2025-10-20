
import React from "react";
import { MessageCircle } from "lucide-react";

const memorials = [
  {
    id: 1,
    fullName: "Michael Johnson",
    birthDate: "March 12, 1945",
    deathDate: "July 18, 2022",
    coverPhoto: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    mainPhoto: "https://randomuser.me/api/portraits/men/32.jpg",
    biography:
      "Michael was a devoted husband, loving father, and a pillar of faith in his community. He enjoyed singing in the church choir and mentoring young people.",
  },
  {
    id: 2,
    fullName: "Elizabeth Williams",
    birthDate: "June 5, 1950",
    deathDate: "October 10, 2021",
    coverPhoto: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    mainPhoto: "https://randomuser.me/api/portraits/women/44.jpg",
    biography:
      "Elizabeth dedicated her life to serving others through mission work and teaching. She loved gardening, reading Scripture, and spending time with her grandchildren.",
  },
  {
    id: 3,
    fullName: "David Anderson",
    birthDate: "January 23, 1965",
    deathDate: "April 2, 2023",
    coverPhoto: "https://images.unsplash.com/photo-1503264116251-35a269479413?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    mainPhoto: "https://randomuser.me/api/portraits/men/45.jpg",
    biography:
      "David was a faithful servant of Christ, known for his warm smile and generosity. He enjoyed Bible study groups, volunteering, and fishing with friends.",
  },
];

const PublicMemorial = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Public Memorials
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {memorials.map((memorial) => (
          <div
            key={memorial.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition hover:shadow-xl"
          >
            {/* Cover + Portrait */}
            <div
              className="h-36 bg-cover bg-center relative"
              style={{ backgroundImage: `url(${memorial.coverPhoto})` }}
            >
              <div className="absolute inset-0 bg-black/30"></div>
              <img
                src={memorial.mainPhoto}
                alt={memorial.fullName}
                className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
              />
            </div>
            {/* Info */}
            <div className="pt-14 px-6 pb-6 flex-1 flex flex-col text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {memorial.fullName}
              </h2>
              <p className="text-gray-500 text-sm italic">
                {memorial.birthDate} – {memorial.deathDate}
              </p>
              <p className="mt-3 text-gray-600 text-sm line-clamp-3">
                {memorial.biography}
              </p>
            </div>
            {/* Actions */}
            <div className="border-t px-6 py-4 flex justify-center">
              <button
                onClick={() => alert(`Viewing tribute wall for ${memorial.fullName}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm flex items-center gap-2 hover:bg-blue-700 transition"
              >
                <MessageCircle size={16} /> Tribute Wall
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicMemorial;
