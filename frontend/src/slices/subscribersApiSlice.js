import { apiSlice } from "./apiSlice";

export const subscribersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all subscribers
    getSubscribers: builder.query({
      query: () => ({
        url: "/subscribers",
        method: "GET",
      }),
      providesTags: ["Subscribers"],
      // Error handling
      transformErrorResponse: (response) => {
        if (response.status === 401 || response.status === 403) {
          return { message: "You are not authorized to perform this action" };
        }
        return response.data ?? { message: "An error occurred" };
      },
    }),
    // Get subscriber by ID
    getSubscriberById: builder.query({
      query: (id) => ({
        url: `/subscribers/${id}`,
        method: "GET",
      }),
      providesTags: ["Subscribers"],
      // Error handling
      transformErrorResponse: (response) => {
        if (response.status === 401 || response.status === 403) {
          return { message: "You are not authorized to perform this action" };
        }
        return response.data ?? { message: "An error occurred" };
      },
    }),
    // Create a new subscriber
    createSubscriber: builder.mutation({
      query: (data) => ({
        url: "/subscribers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscribers"],
      // Error handling
      transformErrorResponse: (response) => {
        if (response.status === 401 || response.status === 403) {
          return { message: "You are not authorized to perform this action" };
        }
        return response.data ?? { message: "An error occurred" };
      },
    }),
    // Update a subscriber
    updateSubscriber: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/subscribers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Subscribers"],
    }),
    deleteSubscriber: builder.mutation({
      query: (id) => ({
        url: `/subscribers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscribers"],
      // Error handling
      transformErrorResponse: (response) => {
        if (response.status === 401 || response.status === 403) {
          return { message: "You are not authorized to perform this action" };
        }
        return response.data ?? { message: "An error occurred" };
      },
    }),
  }),
});

export const {
  useGetSubscribersQuery,
  useGetSubscriberByIdQuery,
  useCreateSubscriberMutation,
  useUpdateSubscriberMutation,
  useDeleteSubscriberMutation,
} = subscribersApiSlice;
