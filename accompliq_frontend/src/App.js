import React from "react";
import AppRouter from "./AppRouter";
// import { ToastContainer } from "react-toastify";
// import { Toaster } from "react-hot-toast";
import { ToastContainer } from "./Utils/toastConfig";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        theme="colored"
      /> */}
      {/* <Toaster position="top-right" /> */}
      <ToastContainer />
      <AppRouter />
    </div>
  );
};

export default App;
