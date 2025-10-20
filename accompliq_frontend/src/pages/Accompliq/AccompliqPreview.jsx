import React from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";

const AccompliqPreview = ({ isOpen, onClose, draft }) => {
  // Log the full draft data when component mounts/updates
  React.useEffect(() => {
    if (isOpen && draft) {
    }
  }, [isOpen, draft]);

  const fullName =
    draft?.accompliqDetails?.personalInfo?.fullName ||
    draft?.personalInfo?.fullName ||
    "Untitled Accompliq";

  const dateOfBirth =
    draft?.accompliqDetails?.personalInfo?.dob ||
    draft?.personalInfo?.dob ||
    "Not specified";
  const dateOfDeath =
    draft?.accompliqDetails?.personalInfo?.deathDate ||
    draft?.personalInfo?.deathDate ||
    "Not specified";
  const spouse =
    draft?.accompliqDetails?.familyInfo?.spouse ||
    draft?.familyInfo?.spouse ||
    "Not specified";
  const children =
    draft?.accompliqDetails?.familyInfo?.children ||
    draft?.familyInfo?.children ||
    "Not specified";
  const description = draft?.draftContent || "No description available";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
      <div className="w-full bg-white p-4 md:p-6 lg:p-8 font-serif border border-gray-200 rounded-lg max-w-2xl md:max-w-3xl mx-auto shadow-sm relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-500 hover:text-gray-700 p-1"
          aria-label="Close preview"
        >
          <X className="h-5 w-5 md:h-6 md:w-6" />
        </button>

        {/* Header with logo placeholder */}
        <div className="mb-4 md:mb-6 text-center">
          <div className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
            <span className="text-blue-700">My</span>Accompliq
          </div>
          <p className="text-xs text-gray-500 tracking-widest">
            Honoring Life's Journey
          </p>
        </div>

        <div className="border-t border-gray-300 my-3 md:my-4" />

        {/* Main Content */}
        <div className="space-y-3 md:space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-1 md:mb-2">
            In Loving Memory of {fullName}
          </h2>

          <div className="flex flex-col md:flex-row justify-center gap-2 md:gap-8 text-xs md:text-sm text-gray-600">
            <p>
              <span className="font-medium">Born:</span> {dateOfBirth}
            </p>
            <p>
              <span className="font-medium">Passed:</span> {dateOfDeath}
            </p>
          </div>

          {/* Image placeholder */}
          <div className="my-3 md:my-4 h-32 md:h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm md:text-base">
            [Photo of {fullName}]
          </div>

          <div className="mt-3 md:mt-4 text-sm md:text-base leading-relaxed text-gray-700 whitespace-pre-wrap">
            {description}
          </div>

          {/* Family section */}
          {(spouse !== "Not specified" || children !== "Not specified") && (
            <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-200">
              <h3 className="font-bold text-gray-800 mb-1 md:mb-2">Family</h3>
              {spouse !== "Not specified" && (
                <p className="text-sm md:text-base">
                  <span className="font-medium">Beloved spouse:</span> {spouse}
                </p>
              )}
              {children !== "Not specified" && (
                <p className="text-sm md:text-base">
                  <span className="font-medium">Cherished children:</span>{" "}
                  {children}
                </p>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 md:mt-8 pt-3 md:pt-4 border-t border-gray-200 text-xs md:text-sm text-gray-500 text-center">
            <p>Memorial arrangements will be announced at a later date.</p>
            <p className="mt-1 md:mt-2">
              © {new Date().getFullYear()} Accompliq
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

AccompliqPreview.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  draft: PropTypes.shape({
    id: PropTypes.string,
    draftContent: PropTypes.string,
    createdAt: PropTypes.string,
    isPublic: PropTypes.bool,
    accompliqDetails: PropTypes.shape({
      personalInfo: PropTypes.shape({
        fullName: PropTypes.string,
        dob: PropTypes.string,
        deathDate: PropTypes.string,
      }),
      familyInfo: PropTypes.shape({
        spouse: PropTypes.string,
        children: PropTypes.string,
      }),
    }),
    personalInfo: PropTypes.shape({
      fullName: PropTypes.string,
      dob: PropTypes.string,
      deathDate: PropTypes.string,
    }),
    familyInfo: PropTypes.shape({
      spouse: PropTypes.string,
      children: PropTypes.string,
    }),
    personalLife: PropTypes.object,
  }),
};

export default AccompliqPreview;
