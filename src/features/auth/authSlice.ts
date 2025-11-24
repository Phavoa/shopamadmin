// src/features/auth/authSlice.ts
import { AuthState, User } from "../../types/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken?: string;
        user?: User;
      }>
    ) {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken)
        state.refreshToken = action.payload.refreshToken;
      if (action.payload.user) state.user = action.payload.user;
      state.isAuthenticated = !!action.payload.accessToken;
    },
    updateUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearCredentials(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, updateUser, clearCredentials } =
  authSlice.actions;
export default authSlice.reducer;
