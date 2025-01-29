import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import { apiSlice } from "../slices/apiSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });
};
