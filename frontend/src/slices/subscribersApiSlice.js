import { apiSlice } from "./apiSlice";

export const subscribersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubscribers: builder.query({
      query: () => ({
        url: "/subscribers",
        method: "GET",
      }),
      providesTags: ["Subscribers"],
    }),
    getSubscriberById: builder.query({
      query: (id) => ({
        url: `/subscribers/${id}`,
        method: "GET",
      }),
      providesTags: ["Subscribers"],
    }),
    createSubscriber: builder.mutation({
      query: (data) => ({
        url: "/subscribers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscribers"],
    }),
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
