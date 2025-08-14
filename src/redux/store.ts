import { configureStore } from '@reduxjs/toolkit'
import studentReducer from './slice/studentSlice'

export const store = configureStore({
  reducer: {
    student: studentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
