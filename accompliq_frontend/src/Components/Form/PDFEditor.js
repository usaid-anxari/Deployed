import React, { useEffect, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
// import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
// import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.entry";

// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const hardcodedFields = [
  {
    id: "name",
    value: "",
    rect: [100, 700, 300, 720], // PDF coordinates
    page: 1,
  },
  {
    id: "dob",
    value: "",
    rect: [100, 660, 300, 680],
    page: 1,
  },
];

const PDFEditor = ({ filePath }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [pdf, setPdf] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [scale, setScale] = useState(1.0);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Check if mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(filePath);
        const pdfDoc = await loadingTask.promise;
        const page = await pdfDoc.getPage(1);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        // Adjust canvas size based on device
        if (isMobile) {
          const containerWidth = containerRef.current.offsetWidth;
          const adjustedScale = containerWidth / viewport.width;
          const adjustedViewport = page.getViewport({ scale: adjustedScale });

          canvas.width = adjustedViewport.width;
          canvas.height = adjustedViewport.height;

          await page.render({
            canvasContext: context,
            viewport: adjustedViewport,
          }).promise;
        } else {
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({
            canvasContext: context,
            viewport,
          }).promise;
        }

        setPdf(pdfDoc);
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    loadPDF();
  }, [filePath, scale, isMobile]);

  const handleChange = (id, val) => {
    setFormValues((prev) => ({ ...prev, [id]: val }));
  };

  const handleDownload = async () => {
    try {
      const existingPdfBytes = await fetch(filePath).then((res) =>
        res.arrayBuffer()
      );
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const form = pdfDoc.getForm();

      hardcodedFields.forEach((field) => {
        const value = formValues[field.id] || "";
        const tf =
          form.getTextField(field.id) || form.createTextField(field.id);
        tf.setText(value);
      });

      const pdfBytes = await pdfDoc.save();
      saveAs(new Blob([pdfBytes]), "FilledForm.pdf");
      setShowMobileMenu(false);
    } catch (error) {
      console.error("Error saving PDF:", error);
      alert("Failed to save PDF. Please try again.");
    }
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 2.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const renderFields = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    // Calculate scaling factors based on actual rendered size
    const scaleX = canvas.width / canvas.offsetWidth;
    const scaleY = canvas.height / canvas.offsetHeight;

    return hardcodedFields.map((field) => {
      const [x1, y1, x2, y2] = field.rect;
      const width = (x2 - x1) * scaleX;
      const height = (y2 - y1) * scaleY;
      const top = canvas.height - y1 * scaleY - height;

      return (
        <input
          key={field.id}
          type="text"
          value={formValues[field.id] || ""}
          onChange={(e) => handleChange(field.id, e.target.value)}
          style={{
            position: "absolute",
            left: `${x1 * scaleX}px`,
            top: `${top}px`,
            width: `${width}px`,
            height: `${height}px`,
            background: "rgba(255,255,255,0.9)",
            border: "1px solid #4299e1",
            padding: isMobile ? "8px" : "4px",
            fontSize: isMobile ? "16px" : "14px",
            borderRadius: "4px",
          }}
          className="focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      );
    });
  };

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
      {/* Desktop Controls */}
      {!isMobile && (
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            -
          </button>
          <span className="px-3 py-1 bg-gray-200 rounded">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            disabled={scale >= 2.0}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            +
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Download Filled PDF
          </button>
        </div>
      )}

      {/* Mobile Controls */}
      {isMobile && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center"
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

      {/* Mobile Menu */}
      {isMobile && showMobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-end">
          <div className="w-full bg-white rounded-t-lg p-4">
            <div className="flex justify-between mb-4">
              <button
                onClick={zoomOut}
                disabled={scale <= 0.5}
                className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
              >
                Zoom Out
              </button>
              <span className="px-4 py-2 bg-gray-200 rounded-lg">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={zoomIn}
                disabled={scale >= 2.0}
                className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
              >
                Zoom In
              </button>
            </div>
            <button
              onClick={handleDownload}
              className="w-full py-3 bg-blue-500 text-white rounded-lg mb-2"
            >
              Download Filled PDF
            </button>
            <button
              onClick={() => setShowMobileMenu(false)}
              className="w-full py-3 bg-gray-200 rounded-lg"
            >
              Close Menu
            </button>
          </div>
        </div>
      )}

      {/* PDF Canvas Container */}
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-auto flex items-center justify-center p-4"
      >
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full shadow-lg"
          style={{
            width: isMobile ? "100%" : "auto",
            height: isMobile ? "auto" : "90%",
          }}
        />
        {renderFields()}
      </div>
    </div>
  );
};

export default PDFEditor;
