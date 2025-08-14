import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; 
import authReducer from "./slice/studentSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "admin", "teacher"]
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  // admin: adminReducer,
  // teacher: teacherReducer
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["tutor.updateTutorProfile.profileData", "register"]
      }
    })
});

// Persistor
export const persistor = persistStore(store);

export default store;
