import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const crmApi = createApi({
  reducerPath: "crmApi",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_CRM_BASE_URL,
  }),

  endpoints: (builder) => ({
    getAllQueries: builder.query({
      query: () => "queries",
    }),
    getAllQueriesById: builder.query({
      query: (id) => `queries/${id}`,
    }),
  }),
});

export const {
  useGetAllQueriesQuery,
  useGetAllQueriesByIdQuery,
} = crmApi;