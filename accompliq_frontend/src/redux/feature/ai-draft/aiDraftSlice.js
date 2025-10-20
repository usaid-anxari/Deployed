// features/aiDraft/aiDraftSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../Services/Api";
import { createAccompliq } from "../accompliq/accompliqThunk";

// Initial state
const initialState = {
  drafts: [],
  selectedDraft: null,
  loading: false,
  error: null,
  generationStatus: "idle",
  downloadStatus: "idle",
};

// Thunk for generating a new AI draft
export const generateAIDraft = createAsyncThunk(
  "aiDraft/generate",
  async (
    { accompliqId = null, accompliqData },
    { rejectWithValue, dispatch }
  ) => {
    try {
      let finalAccompliqId = accompliqId;

      // Create accompliq if no ID provided
      if (!finalAccompliqId) {
        const createResponse = await dispatch(
          createAccompliq(accompliqData)
        ).unwrap();
        finalAccompliqId = createResponse.accompliq?.id;

        if (!finalAccompliqId) {
          throw new Error("Failed to create Accompliq");
        }
      }

      // Generate AI draft
      const response = await API.post(
        `/ai-drafts/generate/${finalAccompliqId}`,
        {
          ...accompliqData,
          model: "gpt-3.5-turbo",
          temperature: 0.7,
        }
      );

      return {
        ...response.data,
        accompliqId: finalAccompliqId,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Thunk for getting all drafts for an accompliq
export const getDrafts = createAsyncThunk(
  "aiDraft/getAll",
  async (accompliqId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/ai-drafts/${accompliqId}`);
      return response.data.drafts;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch drafts"
      );
    }
  }
);
export const selectAIDraft = createAsyncThunk(
  "aiDraft/select",
  async (draftId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/ai-drafts/selected/${draftId}`);

      // Handle both single draft and list response
      if (response.data.drafts) {
        // Find the specific draft we want from the list
        const selectedDraft = response.data.drafts.find(
          (d) => d.id === draftId
        );
        return selectedDraft || rejectWithValue("Draft not found in response");
      }
      return response.data.draft || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to select draft"
      );
    }
  }
);

// Thunk for selecting a draft
export const fetchAIDrafts = createAsyncThunk(
  "aiDraft/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/ai-drafts/all");
      return response.data.drafts;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch drafts"
      );
    }
  }
);

// Thunk for deleting a draft
export const deleteDraft = createAsyncThunk(
  "aiDraft/delete",
  async (draftId, { rejectWithValue }) => {
    try {
      await API.delete(`/ai-drafts/${draftId}`);
      return draftId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete draft"
      );
    }
  }
);

// Thunk for updating draft content
export const updateDraftContent = createAsyncThunk(
  "aiDraft/update",
  async ({ draftId, content }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/ai-drafts/selected/${draftId}`, {
        content,
      });
      return response.data.draft;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update draft"
      );
    }
  }
);

//Thunk for download draft
export const downloadAIDraftPDF = createAsyncThunk(
  "aiDraft/downloadPDF",
  async (draftId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/ai-drafts/download/${draftId}`, {
        responseType: "blob", // Important for file downloads
      });
      return { draftId, blob: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to download PDF"
      );
    }
  }
);
// Thunk for getting draft for editing
export const getDraftForEdit = createAsyncThunk(
  "aiDraft/getForEdit",
  async (draftId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/ai-drafts/edit/${draftId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get draft for editing"
      );
    }
  }
);
// Thunk for saving edited draft
export const saveEditedDraft = createAsyncThunk(
  "aiDraft/saveEdit",
  async ({ draftId, updatedContent }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/ai-drafts/edit/${draftId}`, {
        updatedContent,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save edited draft"
      );
    }
  }
);

const aiDraftSlice = createSlice({
  name: "aiDraft",
  initialState,
  reducers: {
    clearDrafts: (state) => {
      state.drafts = [];
      state.selectedDraft = null;
    },
    resetGenerationStatus: (state) => {
      state.generationStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    // Generate Draft
    builder.addCase(generateAIDraft.pending, (state) => {
      state.generationStatus = "generating";
      state.loading = true;
      state.error = null;
    });
    builder.addCase(generateAIDraft.fulfilled, (state, action) => {
      state.generationStatus = "success";
      state.loading = false;
      state.drafts = [action.payload, ...state.drafts];
      if (action.payload.isSelected) {
        state.selectedDraft = action.payload;
      }
    });
    builder.addCase(generateAIDraft.rejected, (state, action) => {
      state.generationStatus = "failed";
      state.loading = false;
      state.error = action.payload;
    });

    // Get Drafts
    builder.addCase(getDrafts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getDrafts.fulfilled, (state, action) => {
      state.loading = false;
      state.drafts = action.payload;
      state.selectedDraft =
        action.payload.find((draft) => draft.isSelected) || null;
    });
    builder.addCase(getDrafts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Select Draft
    builder.addCase(fetchAIDrafts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAIDrafts.fulfilled, (state, action) => {
      state.loading = false;
      state.drafts = action.payload?.drafts || action.payload || [];
      state.selectedDraft = action.payload;
    });
    builder.addCase(fetchAIDrafts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Delete Draft
    builder.addCase(deleteDraft.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteDraft.fulfilled, (state, action) => {
      state.loading = false;
      state.drafts = state.drafts.filter(
        (draft) => draft.id !== action.payload
      );
      if (state.selectedDraft?.id === action.payload) {
        state.selectedDraft =
          state.drafts.find((draft) => draft.isSelected) || null;
      }
    });
    builder.addCase(deleteDraft.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update Draft
    builder.addCase(updateDraftContent.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateDraftContent.fulfilled, (state, action) => {
      state.loading = false;
      state.drafts = state.drafts.map((draft) =>
        draft.id === action.payload.id ? action.payload : draft
      );
      if (state.selectedDraft?.id === action.payload.id) {
        state.selectedDraft = action.payload;
      }
    });
    builder.addCase(updateDraftContent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch AI Draft
    builder.addCase(selectAIDraft.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(selectAIDraft.fulfilled, (state, action) => {
      state.loading = false;

      if (!action.payload) {
        console.error("No draft payload received");
        return;
      }

      // Update the selected draft in the list
      state.drafts = (state.drafts || []).map((draft) => {
        if (draft.id === action.payload.id) {
          return { ...draft, selected: true };
        }
        // Ensure other drafts are marked as not selected
        if (draft.selected) {
          return { ...draft, selected: false };
        }
        return draft;
      });
    });

    builder.addCase(selectAIDraft.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    //Download PDF
    builder.addCase(downloadAIDraftPDF.pending, (state) => {
      state.downloadStatus = "downloading";
      state.error = null;
    });
    builder.addCase(downloadAIDraftPDF.fulfilled, (state) => {
      state.downloadStatus = "success";
    });
    builder.addCase(downloadAIDraftPDF.rejected, (state, action) => {
      state.downloadStatus = "failed";
      state.error = action.payload;
    });

    // Get Draft for Edit
    builder.addCase(getDraftForEdit.pending, (state) => {
      state.editStatus = "loading";
      state.error = null;
    });
    builder.addCase(getDraftForEdit.fulfilled, (state, action) => {
      state.editStatus = "loaded";
      state.selectedDraft = action.payload.draft;
      state.editedContent = action.payload.draft.draftContent;
    });
    builder.addCase(getDraftForEdit.rejected, (state, action) => {
      state.editStatus = "failed";
      state.error = action.payload;
    });

    // Save Edited Draft
    builder.addCase(saveEditedDraft.pending, (state) => {
      state.editStatus = "saving";
      state.error = null;
    });
    builder.addCase(saveEditedDraft.fulfilled, (state, action) => {
      state.editStatus = "saved";
      state.drafts = state.drafts.map((draft) =>
        draft.id === action.payload.draft.id ? action.payload.draft : draft
      );
      if (state.selectedDraft?.id === action.payload.draft.id) {
        state.selectedDraft = action.payload.draft;
      }
    });
    builder.addCase(saveEditedDraft.rejected, (state, action) => {
      state.editStatus = "failed";
      state.error = action.payload;
    });
  },
});

export const {
  resetGenerationStatus,
  resetDownloadStatus,
  clearSelectedDraft,
  clearDrafts,
} = aiDraftSlice.actions;
export default aiDraftSlice.reducer;
