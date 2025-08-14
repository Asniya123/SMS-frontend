import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface UserState {
  userId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: UserState = {
  userId: null,
  accessToken: null,
  refreshToken: null,
};

// Load initial state from cookies if available (optional for persistence)
const storedUserId = Cookies.get("userId");
const storedAccessToken = Cookies.get("accessToken");
const storedRefreshToken = Cookies.get("refreshToken");

if (storedUserId && storedAccessToken && storedRefreshToken) {
  initialState.userId = storedUserId;
  initialState.accessToken = storedAccessToken;
  initialState.refreshToken = storedRefreshToken;
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData(
      state,
      action: PayloadAction<{ userId: string; accessToken: string; refreshToken: string }>
    ) {
      state.userId = action.payload.userId;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      // Persist to cookies for persistence
      Cookies.set("userId", action.payload.userId);
      Cookies.set("accessToken", action.payload.accessToken);
      Cookies.set("refreshToken", action.payload.refreshToken);
    },
    clearAdminData(state) {
      state.userId = null;
      state.accessToken = null;
      state.refreshToken = null;

      // Clear cookies on logout
      Cookies.remove("userId");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    },
  },
});

export const { setUserData, clearAdminData } = userSlice.actions;
export default userSlice.reducer;