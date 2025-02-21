import { createSlice } from "@reduxjs/toolkit";

// This slice manages authentication state
const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: null,
    isLoading: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
