import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    checkAuth: builder.query({
      query: () => "/auth/check",
      providesTags: ["User"],
    }),

    signUp: builder.mutation({
      query: (formData) => ({
        url: "/auth/register",
        method: "POST",
        body: { ...formData },
      }),
      invalidatesTags: ["User"],
    }),

    login: builder.mutation({
      query: (formData) => ({
        url: "/auth/login",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "/auth/update-profile",
        method: "PATCH",
        body: formData,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useCheckAuthQuery,
  useSignUpMutation,
  useLogoutMutation,
  useLoginMutation,
  useUpdateProfileMutation,
} = authApi;
