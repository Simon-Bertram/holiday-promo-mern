import { apiSlice } from "./apiSlice";

const USERS_URL = "/api/users";
const AUTH_URL = "/api/auth";

// Inject endpoints for user-related operations
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Login mutation
    passwordLogin: builder.mutation({
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

    magicCodeLogin: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/verify-code`,
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
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),

    // Register mutation
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
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
        url: `${USERS_URL}/profile`,
        method: "GET",
        credentials: "include",
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
        url: `${USERS_URL}/profile`,
        method: "PUT",
        credentials: "include",
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
