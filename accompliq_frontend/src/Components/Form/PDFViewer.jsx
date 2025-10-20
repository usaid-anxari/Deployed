import React, { useCallback, useEffect, useRef, useState } from "react";

const PDFViewer = ({ filePath, onClose }) => {
  const [pdfjsLib, setPdfjsLib] = useState(null);
  const canvasRef = useRef(null);
  const [pdfInstance, setPdfInstance] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formFields, setFormFields] = useState([]);
  const [formValues, setFormValues] = useState({});
  const containerRef = useRef(null);
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

  // Initialize PDF.js
  // useEffect(() => {
  //   const loadPdfJs = async () => {
  //     try {
  //       const pdfjs = await import("pdfjs-dist/legacy/build/pdf");
  //       const pdfjsWorker = await import(
  //         "pdfjs-dist/legacy/build/pdf.worker.entry"
  //       );
  //       pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  //       setPdfjsLib(pdfjs);
  //     } catch (err) {
  //       console.error("Failed to load PDF.js", err);
  //       setError("Failed to initialize PDF viewer. Please refresh the page.");
  //     }
  //   };

  //   loadPdfJs();
  // }, []);

  useEffect(() => {
  const loadPdfJs = async () => {
    try {
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf");
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
      setPdfjsLib(pdfjs);
    } catch (err) {
      console.error("Failed to load PDF.js", err);
      setError("Failed to initialize PDF viewer. Please refresh the page.");
    }
  };

  loadPdfJs();
}, []);

  const renderPage = useCallback(async (pdfDoc, pageNum, scaleValue) => {
    if (!canvasRef.current || !containerRef.current) return;

    try {
      setIsRendering(true);
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: scaleValue });

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const outputScale = window.devicePixelRatio || 1;

      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      const transform =
        outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

      context.clearRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvasContext: context,
        viewport: viewport,
        transform: transform,
      }).promise;

      // Extract form fields
      const annotations = await page.getAnnotations();
      const fields = annotations.filter((anno) => anno.fieldType);

      const newFields = fields.map((field) => ({
        id: field.id,
        name: field.fieldName || `field_${field.id}`,
        type: field.fieldType,
        rect: field.rect, // [x1, y1, x2, y2]
        page: pageNum,
        value: field.fieldValue || "",
        defaultValue: field.fieldValue || "",
      }));

      setFormFields((prev) => {
        // Keep existing fields from other pages
        const otherPagesFields = prev.filter((f) => f.page !== pageNum);
        return [...otherPagesFields, ...newFields];
      });
    } catch (error) {
      console.error("Error rendering page:", error);
      setError("Error rendering PDF page");
    } finally {
      setIsRendering(false);
    }
  }, []);

  // Load PDF document
  useEffect(() => {
    if (!pdfjsLib || !filePath) return;

    let mounted = true;
    setIsLoading(true);
    setError(null);

    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({
          url: filePath,
          disableAutoFetch: true,
          disableStream: true,
        });

        const loadedPdf = await loadingTask.promise;

        if (mounted) {
          setPdfInstance((prevPdf) => {
            if (prevPdf) prevPdf.destroy();
            return loadedPdf;
          });
          setNumPages(loadedPdf.numPages);
          setIsLoading(false);
        }
      } catch (error) {
        if (mounted) {
          console.error("Error loading PDF:", error);
          setError(`Failed to load PDF: ${error.message}`);
          setIsLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      mounted = false;
    };
  }, [filePath, pdfjsLib]);

  // Render page when dependencies change
  useEffect(() => {
    if (pdfInstance && !isLoading) {
      renderPage(pdfInstance, pageNumber, scale);
    }
  }, [pageNumber, scale, pdfInstance, isLoading, renderPage]);

  // Handle form field changes
  const handleFieldChange = (fieldId, value) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  // Render form fields as HTML inputs
  const renderFormFields = () => {
    return formFields
      .filter((field) => field.page === pageNumber)
      .map((field) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        // Convert PDF coordinates to canvas coordinates
        const scaleX = canvas.width / parseFloat(canvas.style.width);
        const scaleY = canvas.height / parseFloat(canvas.style.height);

        const [x1, y1, x2, y2] = field.rect;
        const width = (x2 - x1) * scaleX;
        const height = (y2 - y1) * scaleY;

        // Flip Y coordinate (PDF has origin at bottom-left)
        const yPos = canvas.height - y1 * scaleY - height;

        const style = {
          position: "absolute",
          left: `${x1 * scaleX}px`,
          top: `${yPos}px`,
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: isEditing ? "rgba(255,255,255,0.9)" : "transparent",
          border: isEditing ? "1px solid #4299e1" : "none",
          pointerEvents: "auto",
          padding: "2px",
          fontSize: isMobile ? "14px" : "12px",
          borderRadius: "2px",
        };

        const value =
          formValues[field.id] !== undefined
            ? formValues[field.id]
            : field.value;

        return (
          <input
            key={field.id}
            type="text"
            style={style}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={`pdf-form-field ${isEditing ? "editable" : ""}`}
            readOnly={!isEditing}
          />
        );
      });
  };

  const goToPrevPage = () => {
    if (pageNumber > 1 && !isRendering) {
      setPageNumber((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (pageNumber < numPages && !isRendering) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const zoomIn = () => {
    if (!isRendering) {
      setScale((prev) => Math.min(prev + 0.25, 3.0));
    }
  };

  const zoomOut = () => {
    if (!isRendering && scale > 0.5) {
      setScale((prev) => Math.max(prev - 0.25, 0.5));
    }
  };

  const handleDownload = () => {
    try {
      const link = document.createElement("a");
      link.href = filePath;
      link.download = filePath.split("/").pop() || "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowMobileMenu(false);
    } catch (error) {
      console.error("Download failed:", error);
      setError("Failed to download PDF");
    }
  };

  const handlePrint = () => {
    try {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
      <html>
        <head>
          <title>Print PDF</title>
          <style>
            body { margin: 0; padding: 0; }
            .page { page-break-after: always; margin-bottom: 20px; }
            .page:last-child { page-break-after: auto; }
          </style>
        </head>
        <body>
          <div style="text-align:center;">
            <img id="print-img" src="${filePath}" style="max-width:100%;height:auto;" />
          </div>
        </body>
      </html>
    `);
      printWindow.document.close();

      // Wait for the image to load before printing
      const interval = setInterval(() => {
        const img = printWindow.document.getElementById("print-img");
        if (img && img.complete) {
          clearInterval(interval);
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        }
      }, 100);

      setShowMobileMenu(false);
    } catch (error) {
      console.error("Print failed:", error);
      setError("Failed to open print dialog");
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setShowMobileMenu(false);
  };

  const handleSave = () => {
    setIsEditing(false);
    setShowMobileMenu(false);
  };

  if (!pdfjsLib) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading PDF viewer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Desktop Toolbar */}
      {!isMobile && (
        <div className="bg-gray-100 p-4 flex flex-wrap gap-2 items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Close
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Download
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            Print
          </button>

          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Save
            </button>
          ) : (
            <button
              onClick={handleEditToggle}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Edit
            </button>
          )}

          {/* Page Navigation */}
          <div className="flex items-center ml-4">
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1 || isLoading || isRendering}
              className="px-3 py-1 bg-gray-300 rounded-l disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1 bg-gray-200">
              Page {pageNumber} of {numPages || "--"}
            </span>
            <button
              onClick={goToNextPage}
              disabled={
                pageNumber >= (numPages || 0) || isLoading || isRendering
              }
              className="px-3 py-1 bg-gray-300 rounded-r disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center ml-4">
            <button
              onClick={zoomOut}
              disabled={scale <= 0.5 || isLoading || isRendering}
              className="px-3 py-1 bg-gray-300 rounded-l disabled:opacity-50"
            >
              -
            </button>
            <span className="px-3 py-1 bg-gray-200">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={isLoading || isRendering || scale >= 3.0}
              className="px-3 py-1 bg-gray-300 rounded-r disabled:opacity-50"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Mobile Toolbar */}
      {isMobile && (
        <div className="bg-gray-100 p-3 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm"
          >
            Close
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              Page {pageNumber} of {numPages || "--"}
            </span>

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-full bg-blue-500 text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu Modal */}
      {isMobile && showMobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-lg p-4">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={handleDownload}
                className="px-4 py-3 bg-green-500 text-white rounded-lg text-sm"
              >
                Download
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-3 bg-yellow-500 text-white rounded-lg text-sm"
              >
                Print
              </button>
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="px-4 py-3 bg-purple-600 text-white rounded-lg text-sm"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-3 bg-blue-500 text-white rounded-lg text-sm"
                >
                  Edit
                </button>
              )}
            </div>

            <div className="flex justify-between mb-4">
              <button
                onClick={zoomOut}
                disabled={scale <= 0.5 || isLoading || isRendering}
                className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
              >
                Zoom Out
              </button>
              <span className="px-4 py-2 bg-gray-200 rounded-lg">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={zoomIn}
                disabled={isLoading || isRendering || scale >= 3.0}
                className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
              >
                Zoom In
              </button>
            </div>

            <div className="flex justify-between">
              <button
                onClick={goToPrevPage}
                disabled={pageNumber <= 1 || isLoading || isRendering}
                className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={goToNextPage}
                disabled={
                  pageNumber >= (numPages || 0) || isLoading || isRendering
                }
                className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>

            <button
              onClick={() => setShowMobileMenu(false)}
              className="w-full mt-4 px-4 py-3 bg-gray-200 rounded-lg"
            >
              Close Menu
            </button>
          </div>
        </div>
      )}

      {/* PDF Content Area */}
      <div className="flex-1 overflow-auto p-2 md:p-4 flex items-center justify-center relative">
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading PDF...</p>
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 rounded-lg">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div ref={containerRef} className="relative">
            <canvas
              ref={canvasRef}
              className="mx-auto shadow-lg"
              aria-label={`PDF page ${pageNumber} of ${numPages}`}
            />
            {renderFormFields()}
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
