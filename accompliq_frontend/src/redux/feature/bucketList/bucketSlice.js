import { createSlice } from "@reduxjs/toolkit";
import {
  completeBucketList,
  createBucketItem,
  deleteBucketItem,
  editBucketItem,
  getBucketItem,
  getBucketLists,
} from "./bucketThunk";

const initialState = {
  items: [],
  currentItem: null,
  loading: false,
  error: null,
  success: false,
};

const bucketSlice = createSlice({
  name: "bucket",
  initialState,
  reducer: {
    resetBucketState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    // create Bucket Item
    builder.addCase(createBucketItem.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(createBucketItem.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.items.push(action.payload.bucket);
    });
    builder.addCase(createBucketItem.rejected, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });

    // Edit Bucket Item
    builder.addCase(editBucketItem.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(editBucketItem.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      const index = state.items.findIndex(
        (item) => item.id === action.payload.bucket.id
      );
      if (index !== -1) {
        state.items[index] = action.payload.bucket;
      }
      if (state.currentItem?.id === action.payload.bucket.id) {
        state.loading = false;
        state.error = action.payload;
      }
    });
    builder.addCase(editBucketItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Delete Bucket Item
    builder.addCase(deleteBucketItem.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(deleteBucketItem.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.items = state.items.filter(
        (item) => item.id !== action.payload.bucketId
      );
      if (state.currentItem?.id === action.payload.bucketId) {
        state.currentItem = null;
      }
    });
    builder.addCase(deleteBucketItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    //Complete Bucket Item
    builder.addCase(completeBucketList.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(completeBucketList.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      const index = state.items.findIndex(
        (item) => item.id === action.payload.bucket.id
      );
      if (index !== -1) {
        state.items[index] = action.payload.bucket;
      }
      if (state.currentItems?.id === action.payload.bucket.id) {
        state.currentItem = action.payload.bucket;
      }
    });
    builder.addCase(completeBucketList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get All Bucket Lists
    builder.addCase(getBucketLists.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getBucketLists.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.buckets;
    });
    builder.addCase(getBucketLists.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    //getSingle Bucket Item
    builder.addCase(getBucketItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getBucketItem.fulfilled, (state, action) => {
      state.loading = false;
      state.currentItem = action.payload.bucket;
    });
    builder.addCase(getBucketItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { resetBucketState } = bucketSlice.actions;
export default bucketSlice.reducer;
