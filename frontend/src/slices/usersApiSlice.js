import { apiSlice } from "./apiSlice";

const USERS_URL = "/api/users";

// Inject endpoints for user-related operations
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Login mutation
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
      // Handle errors properly
      transformErrorResponse: (response) => {
        return response.data ?? { message: "An error occurred" };
      },
    }),

    // Get user profile query
    getUserProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
        method: "GET",
      }),
      providesTags: ["User"], // Mark which cache tags this provides
    }),

    // Update profile mutation
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"], // Invalidate cache when profile is updated
    }),
  }),
});

// Export hooks for use in components
export const {
  useLoginMutation,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
} = usersApiSlice;
