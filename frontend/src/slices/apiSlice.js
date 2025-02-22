import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "@/config";

// Base query setup with empty baseUrl since we're using relative URLs
// This works with Next.js API routes which are served from the same origin
const baseQuery = fetchBaseQuery({
  baseUrl: config.backendUrl + "/api",
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// Create the API slice - this is the core RTK Query configuration
export const apiSlice = createApi({
  // The base query configuration that all endpoints will use
  baseQuery,

  // Define which types of data we may be caching
  // This enables automatic cache invalidation
  tagTypes: ["User", "Profile", "Subscribers"],

  // endpoints will be injected from other files
  endpoints: (builder) => ({}),
});
