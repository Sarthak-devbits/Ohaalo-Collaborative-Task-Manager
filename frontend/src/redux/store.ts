import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import userReducer from "./slice/userSlice";

// Configuration for Redux Persist
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["settingsFilter", "resourcesFilter", "resourcesOtpmise"], // Add reducers you don't want to persist here
};

// Combine all reducers
const appReducer = combineReducers({
  user: userReducer,
});

// Handle resetting the state upon logout action (if needed)
const rootReducer = (state: any, action: any) => {
  if (action.type === "user/logout") {
    // state.resourcesOtpmise = undefined;
    // state.contentOtpmise = undefined;
    // state.recentUploads = undefined;
  }
  return appReducer(state, action);
};

// Apply the persistReducer to the rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create and configure the Redux store
const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Create a persistor for the store
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
