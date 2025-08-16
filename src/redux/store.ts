import { configureStore } from '@reduxjs/toolkit';
import studentReducer from './slice/studentSlice';
import adminReducer from './slice/adminSlice';
import courseReducer from './slice/courseSlice';
import leaveReducer from './slice/leaveSlice'; // Add this import

export const store = configureStore({
  reducer: {
    student: studentReducer,
    admin: adminReducer,
    course: courseReducer,
    leave: leaveReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;