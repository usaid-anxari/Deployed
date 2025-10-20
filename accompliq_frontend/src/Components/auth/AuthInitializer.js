import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../redux/feature/auth/authThunk";
import { useNavigate } from "react-router-dom";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const initializeAuth = async () => {
      if (token && !isAuthenticated) {
        try {
          await dispatch(fetchUserData()).unwrap();
          // Reset history after auth initialization
          window.history.pushState(null, "", "/");
          window.history.replaceState(null, "", "/");
        } catch (error) {
          localStorage.removeItem("authToken");
          window.history.pushState(null, "", "/login");
          window.history.replaceState(null, "", "/login");
          navigate("/login");
        }
      }
    };
    initializeAuth();
  }, [dispatch, token, isAuthenticated, navigate]);

  // if (loading && token) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="text-center">
  //         <div
  //           className="spinner-border animated-spin inline-block w-8 h-8 border-4 rounded-full"
  //           role="status"
  //         >
  //           <span className="visually-hidden">Loading...</span>
  //         </div>
  //         <p className="mt-3">Loading user data...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return children;
};

export default AuthInitializer;
