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

//create accompliq
export const createAccompliq = createAsyncThunk(
  "accompliq/create",
  async (accompliqData, { rejectWithValue }) => {
    try {
      const response = await API.post("/accompliq/create", accompliqData);
      if (response.status === 201 && response.data) {
        return response.data;
      }
      throw new Error(response.data.message || "Failed to create accompliq");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create accompliq"
      );
    }
  }
);

//Get single Accompliq
export const getAccompliq = createAsyncThunk(
  "accompliq/getOne",
  async (accompliqId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/accompliq/${accompliqId}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch accompliq");
      }
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

//upload Media
export const uploadMedia = createAsyncThunk(
  "accompliq/uploadMedia",
  async ({ accompliqId, files }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      const response = API.post(
        `accompliq/upload-media/${accompliqId}`,
        formData,
        {
          headers: {
            "Content-Type": "multiple/form-data",
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to upload media");
      }
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

//Download PDF
export const downloadPDF = createAsyncThunk(
  "accompliq/downloadPDF",
  async (accompliqId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/accompliq/download/${accompliqId}`, {
        responseType: "arraybuffer",
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

//Upload Privacy Settings
export const uploadPrivacyAccompliq = createAsyncThunk(
  "accompliq/uploadPrivacy",
  async ({ accompliqId, isPublic }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/accompliq/privacy/${accompliqId}`, {
        isPublic,
      });
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update privacy");
      }
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

//get public accompliq
export const getPublicAccompliq = createAsyncThunk(
  "accompliq/getPublic",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/accompliq/public-directory");
      if (!response.data.success) {
        throw new Error(
          response.data.message || "failed to get public accompliq"
        );
      }
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

//Edit accompliq
export const editAccompliq = createAsyncThunk(
  "accompliq/edit",
  async ({ accompliqId, updateData, mode }, { rejectWithValue }) => {
    try {
      const response = await API.put(
        `/accompliq/edit/${accompliqId}?mode=${mode}`,
        updateData
      );

      if (mode === "pdf") {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
        return { success: true };
      }

      if (!response.data.success) {
        throw new Error(response.data.message || "failed to edit accompliq");
      }
      return response.data;
    } catch (error) {
      console.error("Edit accompliq error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//Delete accompliq
export const deleteAccompliq = createAsyncThunk(
  "accompliq/delete",
  async (accompliqId, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/accompliq/delete/${accompliqId}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "failed to delete accompliq");
      }
      return { accompliqId, ...response.data };
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

//get user accompliq
export const getUserAccompliq = createAsyncThunk(
  "accompliq/getUserAccompliq",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/accompliq/get-user-accompliq");
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: "Failed to load accompliq",
        status: error.response?.status,
      });
    }
  }
);
