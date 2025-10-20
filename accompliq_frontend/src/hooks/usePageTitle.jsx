// src/hooks/usePageTitle.js
import { useEffect } from "react";

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = `${title} | Accompliq`;
    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = "Accompliq";
    };
  }, [title]);
};

export default usePageTitle;
