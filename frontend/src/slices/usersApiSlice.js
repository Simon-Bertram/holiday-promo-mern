import { apiSlice } from "./apiSlice";

// Inject endpoints for user-related operations
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Login mutation
    passwordLogin: builder.mutation({
      query: (data) => ({
        url: "/auth/password",
        method: "POST",
        body: data,
      }),
      // Add profile data to login response
      transformResponse: (response) => ({
        ...response,
        profile: {
          ...response.profile,
          role: response.profile?.role || "user",
        },
      }),
      // Invalidate profile cache on login
      invalidatesTags: ["Profile"],
    }),

    magicCodeLogin: builder.mutation({
      query: (data) => ({
        url: "auth/verify-code",
        method: "POST",
        body: data,
      }),
      // Handle errors properly
      transformErrorResponse: (response) => {
        return response.data ?? { message: "An error occurred" };
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: "users/logout",
        method: "POST",
      }),
    }),

    // Register mutation
    register: builder.mutation({
      query: (data) => ({
        url: "users",
        method: "POST",
        body: data,
      }),
      // Handle errors properly
      transformErrorResponse: (response) => {
        return response.data ?? { message: "An error occurred" };
      },
    }),

    // Get user profile query
    getProfile: builder.query({
      query: () => ({
        url: "users/profile",
        method: "GET",
      }),
      transformResponse: (response) => ({
        ...response, // Spread all existing properties
        role: response.role || "user", // Ensure role is always defined
      }),
      providesTags: ["Profile"],
      // Add cache invalidation on logout
      keepUnusedDataFor: 0,
    }),

    // Update profile mutation
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "users/profile",
        method: "PUT",
        body: data,
      }),
      // Invalidate the specific profile that was updated
      invalidatesTags: (result, error, arg) => [
        { type: "Profile", id: arg.id ?? "PROFILE" },
      ],
    }),
  }),
});

// Export hooks for use in components
export const {
  usePasswordLoginMutation,
  useMagicCodeLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = usersApiSlice;
