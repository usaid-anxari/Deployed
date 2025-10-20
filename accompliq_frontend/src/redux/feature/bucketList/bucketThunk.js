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

// Create Bucket List Item
export const createBucketItem = createAsyncThunk(
  "bucket/create",
  async ({ formData, image }, { rejectWithValue }) => {
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (image) {
        data.append("image", image);
      }

      const response = await API.post("/bucket/createList", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201 && response.data) {
        return response.data;
      }
      throw new Error(response.data.message || "Failed to create bucket item");
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Edit Bucket List Item

export const editBucketItem = createAsyncThunk(
  "bucket/edit",
  async ({ bucketId, formData, image }, { rejectWithValue }) => {
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (image) {
        data.append("image", image);
      }
      const response = await API.put(`/bucket/edit/${bucketId}`, data, {
        header: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (!response.data) {
        throw new Error(response.data.message || "Failed to edit bucket list");
      }
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Delete Bucket List Item
export const deleteBucketItem = createAsyncThunk(
  "bucket/delete",
  async (bucketId, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/bucket/delete/${bucketId}`);
      if (!response.data) {
        throw new Error(
          response.data.message || "Failed to delete bucket item"
        );
      }
      return { bucketId, ...response.data };
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Mark Bucket List Item as Completed
export const completeBucketList = createAsyncThunk(
  "bucket/Complete",
  async (bucketId, { rejectWithValue }) => {
    try {
      const response = await API.put(`/bucket/complete/${bucketId}`);
      if (!response.data) {
        throw new Error(
          response.data.message || "Failed to complete bucket item"
        );
      }
      return response.data;
    } catch (error) {
      return handleApiError(Error, rejectWithValue);
    }
  }
);

// Get All Bucket List Items for User
export const getBucketLists = createAsyncThunk(
  "bucket/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/bucket/get");
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: "Failed to load bucket lists",
        status: error.response?.status,
      });
    }
  }
);

// Get Single Bucket List Item
export const getBucketItem = createAsyncThunk(
  "bucket/getOne",
  async (bucketId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/bucket/get/${bucketId}`);
      if (!response.data) {
        throw new Error(response.data.message || "Failed to fetch bucket item");
      }
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);
