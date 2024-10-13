import { configureStore } from "@reduxjs/toolkit";
import localforage from "localforage";
import { combineReducers } from "redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import userReducer from "./slices/userSlice";

// Combine all the reducers
const combinedReducer = combineReducers({
  user: userReducer,
});

// Create a no-op storage for SSR (Next.js server-side)
const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem() {
      return Promise.resolve(null);
    },
    removeItem() {
      return Promise.resolve(null);
    },
  };
};

// Check if window is available (to detect if code is running in the browser)
let storage;
if (typeof window !== "undefined") {
  // Initialize localforage only in client-side
  localforage.config({
    driver: localforage.INDEXEDDB, // Use IndexedDB as the primary driver
    name: "metaverse",
    storeName: "metaverse", // Collection name
    version: 1.0,
    description: "Metaverse storage",
  });
  storage = localforage;
} else {
  // Use no-op storage during SSR
  storage = createNoopStorage();
}

// Redux persist configuration
const persistConfig = {
  key: "redux",
  storage,
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, combinedReducer);

// Create and configure the Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create a persistor for the Redux store
export const persistor = persistStore(store);
