import { createSlice } from "@reduxjs/toolkit";
import {
  createAccompliq,
  deleteAccompliq,
  downloadPDF,
  editAccompliq,
  getAccompliq,
  getPublicAccompliq,
  getUserAccompliq,
  uploadPrivacyAccompliq,
  uploadMedia,
} from "./accompliqThunk";

const initialState = {
  accompliq: [],
  currentAccompliq: null,
  publicAccompliq: [],
  userAccompliq: [],
  loading: false,
  error: null,
  aiDraft: null,
  mediaUploadStatus: "idle",
  downloadStatus: "idle",
  selectedTemplate: null,
};

const accompliqSlice = createSlice({
  name: "accompliq",
  initialState,
  reducers: {
    clearAccompliqError: (state) => {
      state.error = null;
    },
    resetAccompliqState: () => initialState,
    clearCurrentState: (state) => {
      state.currentAccompliq = null;
    },
  },
  extraReducers: (builder) => {
    builder

      //create accompliq
      .addCase(createAccompliq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccompliq.fulfilled, (state, action) => {
        state.loading = false;
        state.accompliq.push(action.payload.accompliq);
        state.error = null;
      })
      .addCase(createAccompliq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create accompliq";
      })

      // get Accompliq
      .addCase(getAccompliq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAccompliq.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAccompliq = action.payload.accompliq;
      })
      .addCase(getAccompliq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch accompliq";
      })

      //upload media
      .addCase(uploadMedia.pending, (state) => {
        state.mediaUploadStatus = "loading";
        state.error = null;
      })
      .addCase(uploadMedia.fulfilled, (state, action) => {
        state.mediaUploadStatus = "succeeded";
        if (state.currentAccompliq) {
          state.currentAccompliq.media = action.payload.accompliq.media;
        }
      })
      .addCase(uploadMedia.rejected, (state, action) => {
        state.mediaUploadStatus = "failed";
        state.error = action.payload?.message || "Failed to upload media";
      })

      //Download PDF
      .addCase(downloadPDF.pending, (state) => {
        state.downloadStatus = "loading";
      })
      .addCase(downloadPDF.fulfilled, (state) => {
        state.downloadStatus = "succeeded";
      })
      .addCase(downloadPDF.rejected, (state, action) => {
        state.downloadStatus = "failed";
        state.error = action.payload?.message || "Failed to download PDF";
      })

      //Update Privacy
      .addCase(uploadPrivacyAccompliq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadPrivacyAccompliq.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentAccompliq) {
          state.currentAccompliq.isPublic = action.payload.accompliq.isPublic;
        }
      })
      .addCase(uploadPrivacyAccompliq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update privacy";
      })

      //Get Public Accompliq
      .addCase(getPublicAccompliq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPublicAccompliq.fulfilled, (state, action) => {
        state.loading = false;
        state.publicAccompliq = action.payload.accompliq;
      })
      .addCase(getPublicAccompliq.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch public accompliq";
      })

      //edit Accompliq
      .addCase(editAccompliq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editAccompliq.fulfilled, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to edit accompliq";
      })
      .addCase(editAccompliq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update accompliq";
      })

      //Delete Accompliq
      .addCase(deleteAccompliq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccompliq.fulfilled, (state, action) => {
        state.loading = false;
        state.accompliq = state.accompliq.filter(
          (obit) => obit.id !== action.payload.accompliqId
        );
        state.currentAccompliq = null;
      })
      .addCase(deleteAccompliq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete accompliq";
      })

      //Get user Accompliq
      .addCase(getUserAccompliq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserAccompliq.fulfilled, (state, action) => {
        state.loading = false;
        state.userAccompliq = action.payload.accompliq;
      })
      .addCase(getUserAccompliq.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch user accompliq";
      });
  },
});

export const { clearAccompliqError, resetAccompliqState, clearCurrentState } =
  accompliqSlice.actions;

export default accompliqSlice.reducer;
