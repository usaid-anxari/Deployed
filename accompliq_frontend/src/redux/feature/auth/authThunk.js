import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../Services/Api";

const handleApiError = (error, rejectWithValue) => {
  if (!error.response) {
    return rejectWithValue({
      status: "network-error",
      message: "Network connection error",
      originalError: error.message,
    });
  }

  const { status, data } = error.response;
  return rejectWithValue({
    status,
    message: data?.message || "An error occurred",
    nextStep: data?.nextStep || null,
    errors: data?.errors || null,
    code: data?.code || null,
    timestamp: new Date().toISOString(),
  });
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/register", { email });
      if (!response.data.success) {
        throw new Error(response.data.message || "Registration failed");
      }
      return response.data;
    } catch (error) {
      console.error("[FRONTEND] /auth/register error:", error);
      return handleApiError(error, rejectWithValue);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verify",
  async (token, { rejectWithValue }) => {
    try {
      const response = await API.post(`/auth/verify-email/${token}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return {
        ...response.data,
        token,
        isVerified: true,
        userId: response.data.userId,
        email: response.data.email,
        profileCompleted: response.data.profileCompleted || "password",
      };
    } catch (error) {
      console.error("[FRONTEND] /auth/verify-email error:", error);
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  }
);

// export const setPassword = createAsyncThunk(
//   "auth/setPassword",
//   async ({ userId, password, confirmPassword }, { rejectWithValue }) => {
//     try {
//       if (password !== confirmPassword) {
//         throw new Error("Passwords do not match");
//       }
//       const response = await API.post("/auth/set-password", {
//         userId,
//         password,
//         confirmPassword,
//       });

//       if (!response.data.success) {
//         throw new Error(response.data.message);
//       }

//       // ✅ FIX: Store the token from backend response
//       if (response.data.token) {
//         localStorage.setItem("authToken", response.data.token);
//       }

//       return {
//         ...response.data,
//         profileCompleted: "profile",
//       };
//     } catch (error) {
//       console.error("[FRONTEND] /auth/set-password error:", error);
//       return rejectWithValue({
//         message: error.response?.data?.message || error.message,
//       });
//     }
//   }
// );

// export const setPassword = createAsyncThunk(
//   "auth/setPassword",
//   async ({ userId, password, confirmPassword }, { rejectWithValue }) => {
//     try {
//       if (password !== confirmPassword) {
//         throw new Error("Passwords do not match");
//       }
      
//       console.log("🔄 [setPassword] Sending request to backend...");
//       const response = await API.post("/auth/set-password", {
//         userId,
//         password,
//         confirmPassword,
//       });

//       console.log("📥 [setPassword] Backend response:", response.data);

//       if (!response.data.success) {
//         throw new Error(response.data.message);
//       }

//       // ✅ FIX: Store the token from backend response
//       if (response.data.token) {
//         localStorage.setItem("authToken", response.data.token);
//         console.log("🔑 [setPassword] Token stored successfully:", response.data.token.substring(0, 20) + "...");
//         console.log("✅ [setPassword] Token in localStorage:", localStorage.getItem("authToken") ? "YES" : "NO");
//       } else {
//         console.warn("⚠️ [setPassword] No token received from backend");
//         console.log("Available response data keys:", Object.keys(response.data));
//       }

//       return {
//         ...response.data,
//         profileCompleted: "profile",
//       };
//     } catch (error) {
//       console.error("[FRONTEND] /auth/set-password error:", error);
//       return rejectWithValue({
//         message: error.response?.data?.message || error.message,
//       });
//     }
//   }
// );

export const setPassword = createAsyncThunk(
  "auth/setPassword",
  async ({ userId, password, confirmPassword }, { rejectWithValue }) => {
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      
      console.log("🔄 [setPassword] Sending request to backend...");
      const response = await API.post("/auth/set-password", {
        userId,
        password,
        confirmPassword,
      });

      console.log("📥 [setPassword] Backend response:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // ✅ Store the token from backend response
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        console.log("🔑 [setPassword] Token stored successfully:", response.data.token.substring(0, 20) + "...");
        console.log("✅ [setPassword] Token in localStorage:", localStorage.getItem("authToken") ? "YES" : "NO");
      } else {
        console.warn("⚠️ [setPassword] No token received from backend");
        console.log("Available response data keys:", Object.keys(response.data));
      }

      // ✅ FIX: Just return the backend response as-is
      return response.data;
    } catch (error) {
      console.error("[FRONTEND] /auth/set-password error:", error);
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
      });
    }
  }
);

// Change password (for logged-in users)
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await API.post(
        "/auth/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Password change failed");
      }

      return {
        ...response.data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("[FRONTEND] /auth/change-password error:", error);
      return handleApiError(error, rejectWithValue);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ userId, updateData }, { rejectWithValue }) => {
    try {
      const response = await API.put(
        `/auth/update-profile/${userId}`,
        updateData
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      if (response.data.authToken) {
        localStorage.setItem("authToken", response.data.authToken);
      }

      return {
        ...response.data,
        user: {
          ...response.data.user,
          role: response.data.user.role,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Profile update failed",
        errors: error.response?.data?.errors,
      });
    }
  }
);

// Login with multiple authentication methods
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password, loginMethod = "email" }, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/login", {
        email,
        password,
        loginMethod,
      });

      // ALWAYS save the token if it exists in response
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }

      // Optionally, handle a "soft fail" (e.g., 403 but with token for onboarding)
      if (!response.data.success) {
        // Still return the data (so reducer/UI can route)
        return {
          ...response.data,
          timestamp: new Date().toISOString(),
          nextStep: response.data.nextStep,
        };
      }

      return {
        ...response.data,
        timestamp: new Date().toISOString(),
        nextStep: response.data.nextStep,
      };
    } catch (error) {
      // Handle error but STILL save token if possible
      const token =
        error.response?.data?.token || error.response?.data?.authToken || null;
      if (token) {
        localStorage.setItem("authToken", token);
      }
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Logout with session cleanup
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("authToken") || "";

      // Attempt server logout if token exists
      if (token) {
        const response = await API.post(
          "/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.success) {
          throw new Error(response.data.message || "Logout failed");
        }
      }

      // Clear all auth-related storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("authToken"); // Remove both for backward compatibility
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("token");

      return {
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      // Ensure cleanup even if logout fails
      localStorage.removeItem("authToken");
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("token");
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  }
);
// Password reset request
export const requestPasswordReset = createAsyncThunk(
  "auth/requestPasswordReset",
  async (email, { rejectWithValue }) => {
    try {
      // Validate email format
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Please provide a valid email address");
      }

      const response = await API.post("/auth/forgot-password", {
        email,
      });

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Password reset request failed"
        );
      }

      return {
        ...response.data,
        email,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Complete password reset
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      // Basic validation
      if (!token || !newPassword) {
        throw new Error("Token and new password are required");
      }

      if (newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      const response = await API.post("/auth/reset-password", {
        token,
        newPassword,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Password reset failed");
      }

      return {
        ...response.data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// fetchUserData
export const fetchUserData = createAsyncThunk(
  "auth/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await API.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch user data");
      }
      return response.data.user;
    } catch (error) {
      console.error("[fetchUserData] Error:", error);
      return handleApiError(error, rejectWithValue);
    }
  }
);
export const updateProfileSettings = createAsyncThunk(
  "auth/updateProfileSettings",
  async (formData, { rejectWithValue, getState }) => {
    try {
      // Get token from state if you use auth
      const token = getState().auth.token;

      const response = await API.put(
        "/profileUpdate/profile-settings",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.user; // returns updated user
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

// Verify invite token (get invited email, validate link)
export const verifyInviteToken = createAsyncThunk(
  "stripe/verifyInviteToken",
  async ({ inviteToken }, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/verify-invite", { inviteToken });
      // ADD THIS:
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }
      return {
        email: response.data.email,
        inviterId: response.data.inviterId,
        subscriptionId: response.data.subscriptionId,
        userId: response.data.userId,
        isVerified: response.data.isVerified,
        profileCompleted: response.data.profileCompleted,
      };
    } catch (error) {
      console.error("[FRONTEND] /auth/verify-invite error:", error);
      return handleApiError(error, rejectWithValue);
    }
  }
);
// Claim invite (link account after registration/password)
export const claimInvite = createAsyncThunk(
  "stripe/claimInvite",
  async ({ inviteToken, userId }, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/claim-invite", {
        inviteToken,
        userId,
      });

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error("[FRONTEND] /auth/claim-invite error:", error);
      return handleApiError(error, rejectWithValue);
    }
  }
);

//Delete
export const deleteAccount = createAsyncThunk(
  "auth/deleteAccount",
  async ({ userId, password }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await API.delete(`/auth/delete-account/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { password },
      });

      // Handle backend's success: false response
      if (res.data && res.data.success === false) {
        return rejectWithValue(res.data);
      }

      return res.data;
    } catch (err) {
      return handleApiError(err, rejectWithValue);
    }
  }
);
