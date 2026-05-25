import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const crmApi = createApi({
  reducerPath: "crmApi",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_CRM_BASE_URL,
  }),

  endpoints: (builder) => ({
    getAllQueryes: builder.query({
      query: () => "queries",
    }),
  }),
});

export const {
  useGetAllQueryesQuery,
} = crmApi;