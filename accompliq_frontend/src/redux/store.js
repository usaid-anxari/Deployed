import { configureStore } from "@reduxjs/toolkit";
import { loadAuthState, saveAuthState } from "./feature/auth/authPersist";
import authReducer from "./feature/auth/authSlice";
import accompliqReducer from "./feature/accompliq/accompliqSlice";
import aiDraftReducer from "./feature/ai-draft/aiDraftSlice";
import bucketListsReducer from "./feature/bucketList/bucketSlice";
import stripeReducer from "./feature/stripe/stripeSlice";

const preloadedState = {
  auth: {
    ...loadAuthState(),
    isAuthenticated: !!loadAuthState()?.token,
  },
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    accompliq: accompliqReducer,
    aiDrafts: aiDraftReducer,
    bucketLists: bucketListsReducer,
    stripe: stripeReducer,
  },

  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

store.subscribe(() => {
  saveAuthState(store.getState());
});
