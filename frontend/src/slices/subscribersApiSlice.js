import { apiSlice } from "./apiSlice";

export const subscribersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubscribers: builder.query({
      query: () => ({
        url: "/subscribers",
        method: "GET",
      }),
    }),
    getSubscriberById: builder.query({
      query: (id) => ({
        url: `/subscribers/${id}`,
        method: "GET",
      }),
    }),
    createSubscriber: builder.mutation({
      query: (data) => ({
        url: "/subscribers",
        method: "POST",
        body: data,
      }),
    }),
    updateSubscriber: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/subscribers/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteSubscriber: builder.mutation({
      query: (id) => ({
        url: `/subscribers/${id}`,
        method: "DELETE",
      }),
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
