import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Modal from "../../Components/Modal/Modal";

const HtmlFormViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [htmlContent, setHtmlContent] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const componentRef = useRef(null);

  useEffect(() => {
    // Check if mobile device
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const file = urlParams.get("file");

    if (file) {
      fetch(file)
        .then((response) => response.text())
        .then((data) => {
          setHtmlContent(data);
        })
        .catch((error) => {
          console.error("Failed to load the form:", error);
        });
    }
  }, [location]);

  const handlePrint = () => {
    if (!componentRef.current || !htmlContent) {
      alert("Content is not ready for printing.");
      return;
    }

    const printWindow = window.open("", "_blank", "width=800,height=600");

    if (printWindow) {
      printWindow.document.write("<html><head><title>Print Form</title>");
      printWindow.document.write(`
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        .form-container {
          max-width: 100%;
          margin: 0 auto;
        }
      </style>
    `);
      printWindow.document.write("</head><body>");
      printWindow.document.write(componentRef.current.innerHTML);
      printWindow.document.write("</body></html>");
      printWindow.document.close();

      // Wait for content to render, then print
      const interval = setInterval(() => {
        if (printWindow.document.readyState === "complete") {
          clearInterval(interval);
          printWindow.focus();
          printWindow.print();
          // Optionally, don't auto-close. Comment this if you want to debug
          printWindow.close();
        }
      }, 100);
    }
  };

  const handleDownloadPDF = async () => {
    if (!componentRef.current || !htmlContent) {
      console.warn("No content to generate PDF");
      return;
    }

    try {
      const canvas = await html2canvas(componentRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `form_${new Date().getTime()}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleCancel = () => {
    const editedFields = document.querySelectorAll('[contentEditable="true"]');
    let hasEdits = false;

    editedFields.forEach((field) => {
      if (field.textContent.trim() !== "") {
        hasEdits = true;
      }
    });

    if (hasEdits) {
      setShowCancelModal(true);
    } else {
      navigate(-1);
    }
  };

  const confirmCancel = (shouldCancel) => {
    if (shouldCancel) {
      const editedFields = document.querySelectorAll(
        '[contentEditable="true"]'
      );
      editedFields.forEach((field) => {
        field.textContent = "";
        const index = field.getAttribute("data-index");
        if (index) {
          localStorage.removeItem(`form-${index}`);
        }
      });
      navigate(-1);
    }
    setShowCancelModal(false);
  };

  return (
    <div className="relative pb-16 md:pb-0">
      {/* Mobile floating action button */}
      {isMobile && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center"
            onClick={() => setShowCancelModal(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Desktop action buttons */}
      {!isMobile && (
        <div className="fixed bottom-4 right-4 flex gap-2 bg-white p-2 rounded-2xl shadow-lg z-50 no-print">
          <button
            onClick={handlePrint}
            disabled={!htmlContent}
            className={`px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 ${
              !htmlContent ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600"
          >
            Download PDF
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Mobile action sheet modal */}
      <Modal
        isOpen={showCancelModal && isMobile}
        onClose={() => setShowCancelModal(false)}
      >
        <div className="p-4">
          <div className="flex flex-col gap-2 mb-4">
            <button
              onClick={handlePrint}
              disabled={!htmlContent}
              className={`px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${
                !htmlContent ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Print Form
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Download as PDF
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCancelModal(false)}
              className="flex-1 px-4 py-3 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Back to Form
            </button>
            <button
              onClick={() => confirmCancel(true)}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Cancel Editing
            </button>
          </div>
        </div>
      </Modal>

      {/* Desktop cancel confirmation modal */}
      <Modal
        isOpen={showCancelModal && !isMobile}
        onClose={() => setShowCancelModal(false)}
      >
        <div className="p-4">
          <h3 className="text-lg font-medium mb-4">Unsaved Changes</h3>
          <p className="mb-6">
            You have unsaved changes. Are you sure you want to cancel?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => confirmCancel(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              No, Stay
            </button>
            <button
              onClick={() => confirmCancel(true)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Form content */}
      <div className="form-container px-4 md:px-0">
        <div ref={componentRef}>
          {htmlContent ? (
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading form...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HtmlFormViewer;
