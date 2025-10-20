/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PDFViewer from "../../Components/Form/PDFViewer";
import FormList from "../../Components/Form/FormList";

const PersonalPlanningForms = ({ mode = "list" }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [pdfFile, setPdfFile] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (mode === "view") {
      const file = searchParams.get("file");
      if (!file) {
        console.error("No file parameter provided for view mode");
        navigate("/personal-planning", { replace: true });
        return;
      }

      try {
        const decodedPath = decodeURIComponent(file);

        verifyPdfExists(decodedPath).then((exists) => {
          if (exists) {
            setPdfFile(decodedPath);
            setError(null);
          } else {
            setError(`PDF not found: ${decodedPath}`);
            navigate("/personal-planning", { replace: true });
          }
        });
      } catch (err) {
        console.error("Error processing file parameter:", err);
        setError("Invalid file path");
        navigate("/personal-planning", { replace: true });
      }
    }
  }, [mode, searchParams, navigate]);

  const verifyPdfExists = async (path) => {
    try {
      // Handle both absolute and relative paths
      let fullPath;
      if (path.startsWith("http") || path.startsWith("/")) {
        fullPath = path;
      } else {
        fullPath = `${process.env.PUBLIC_URL || ""}/${path.replace(
          /^\/+/,
          ""
        )}`;
      }

      const response = await fetch(fullPath, { method: "HEAD" });
      return response.ok;
    } catch (err) {
      console.error("Error verifying PDF:", err);
      return false;
    }
  };

  const handleClosePdf = () => {
    navigate("/personal-planning", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {error && (
        <div className="p-4 bg-red-100 text-red-700 border border-red-400 rounded mb-4">
          {error}
        </div>
      )}

      {mode === "view" && pdfFile ? (
        <PDFViewer
          filePath={pdfFile}
          onClose={handleClosePdf}
          onError={(err) => {
            setError(`Failed to load PDF: ${err.message}`);
            navigate("/personal-planning", { replace: true });
          }}
        />
      ) : (
        <FormList />
      )}
    </div>
  );
};

export default PersonalPlanningForms;
