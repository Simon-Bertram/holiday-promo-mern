import { configureStore } from "@reduxjs/toolkit";
import authReducer, { setCredentials } from "../slices/authSlice";
import { apiSlice } from "../slices/apiSlice";
import { getCookie } from "./utils/cookie.js";

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });

  // Only run on client side
  if (typeof window !== "undefined") {
    // Check for JWT cookie on app initialization
    const jwt = getCookie("jwt");
    if (jwt) {
      store.dispatch(setCredentials({ token: jwt }));
    }

    // Check local storage for user info on app initialization
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      store.dispatch(setCredentials(JSON.parse(userInfo)));
    }
  }

  return store;
};
