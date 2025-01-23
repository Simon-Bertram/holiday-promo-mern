import { createSlice } from "@reduxjs/toolkit";

// Helper function to safely get initial user info
const getUserInfo = () => {
  if (typeof window === "undefined") return null;

  const userInfo = localStorage.getItem("userInfo");
  if (!userInfo) return null;

  try {
    return JSON.parse(userInfo);
  } catch {
    return null;
  }
};

const initialState = {
  userInfo: getUserInfo(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      }
    },
    logout: (state, action) => {
      state.userInfo = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("userInfo");
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
