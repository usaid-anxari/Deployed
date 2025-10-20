import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  logoutUser,
  registerUser,
  setPassword,
  updateProfile,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  fetchUserData,
  updateProfileSettings,
  verifyInviteToken,
  claimInvite,
  changePassword,
  deleteAccount,
} from "./authThunk";

const initialState = {
  userInfo: null,
  token: null,
  inviteEmail: null,
  inviteUserId: null,
  loading: false,
  error: null,
  currentStep: "register",
  isAuthenticated: false,
  passwordResetRequested: false,
  passwordResetEmail: null,
  passwordResetSuccess: false,
  passwordResetTokenInvalid: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAuthState: (_state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.currentStep = "verify-email";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      })

      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = {
          ...state.userInfo,
          _id: action.payload.userId,
          email: action.payload.email,
          isVerified: true,
          profileCompleted: "password", // Force this to password step
        };
        state.currentStep = "set-password"; // Explicitly set next step
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Email verification failed";
      })

      // Set Password
      .addCase(setPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(setPassword.fulfilled, (state, _action) => {
      //   state.loading = false;
      //   state.userInfo = {
      //     ...state.userInfo,
      //     profileCompleted: "profile",
      //   };
      //   state.currentStep = "complete-profile";
      // })
      .addCase(setPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = {
          ...state.userInfo,
          profileCompleted: action.payload.profileCompleted, // ✅ USE BACKEND RESPONSE
          role: action.payload.role,
          isVerified: action.payload.isVerified,
        };
        state.token = action.payload.token; // ✅ Also store the token
        state.isAuthenticated = true; // ✅ Mark as authenticated
        state.currentStep = "complete-profile"; // This can stay
      })
      .addCase(setPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Password setup failed";
      })

      // change password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // You can set a flag or message if needed
        state.passwordChanged = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to change password";
        state.passwordChanged = false;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.user;
        state.token = action.payload.authToken;
        state.isAuthenticated = true;

        // Just update the state, don't navigate here
        if (action.payload.user?.profileCompleted === "subscription") {
          state.currentStep = "subscription";
        } else if (action.payload.user?.profileCompleted === "profile") {
          state.currentStep = "complete-profile";
        } else if (action.payload.user?.profileCompleted === "completed") {
          state.currentStep =
            action.payload.user?.role === "admin" ? "dashboard" : "accompliq";
        }
      })

      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Profile update failed";
        state.currentStep = "complete-profile";
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.currentStep = action.payload.nextStep || "dashboard";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.status === 404
            ? "User not registered. Please sign up first."
            : action.payload?.message || "Login failed";
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, () => {
        return initialState; // Fully resets auth state including isAuthenticated and token
      })
      .addCase(logoutUser.rejected, () => {
        return initialState; // Ensure failed logout still resets auth state
      })

      //Delete
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          // Just reset all fields one by one (mutate draft)
          Object.assign(state, initialState); // this is safe in Immer
          state.loading = false;
        } else {
          state.error = action.payload?.message || "Deletion failed";
        }
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Deletion failed";
      })

      // Request Password Reset
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.passwordResetRequested = false;
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.loading = false;
        state.passwordResetRequested = true;
        state.passwordResetEmail = action.payload.email;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Password reset request failed";
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.passwordResetSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordResetSuccess = true;
        state.passwordResetRequested = false;
        state.passwordResetEmail = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Password reset failed";

        // Handle specific error cases
        if (action.payload?.status === 401) {
          state.passwordResetTokenInvalid = true;
        }
      })

      // fetchUserData
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "User data fetch failed";
        localStorage.removeItem("authToken");
      })

      // profile detail update
      .addCase(updateProfileSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(updateProfileSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // --- Verify Invite Token ---
    builder
      .addCase(verifyInviteToken.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.inviteEmail = null;
      })
      .addCase(verifyInviteToken.fulfilled, (state, action) => {
        state.loading = false;
        state.inviteEmail = action.payload.email;
        state.inviteUserId = action.payload.userId;
      })
      .addCase(verifyInviteToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Invite verification failed";
        state.inviteEmail = null;
      });

    // --- Claim Invite ---
    builder
      .addCase(claimInvite.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.inviteClaimed = false;
      })
      .addCase(claimInvite.fulfilled, (state, action) => {
        state.loading = false;
        state.inviteClaimed = true;
      })
      .addCase(claimInvite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to claim invite";
        state.inviteClaimed = false;
      });
  },
});

export const { clearError, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
