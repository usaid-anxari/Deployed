import axios from "axios";
console.log(process.env.REACT_APP_API_URL);


const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL,
    // "https://api.accompliq.com/api",
});

// ===== REQUEST INTERCEPTOR =====
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    // Add security headers
    config.headers = {
      ...config.headers,
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// ===== RESPONSE INTERCEPTOR =====
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("CORS Error Details:", error.config, error.response);
    return Promise.reject(error);
  }
);

export default API;
