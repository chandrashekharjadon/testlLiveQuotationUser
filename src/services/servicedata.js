import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "../firebase"; // Firebase auth

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,

    prepareHeaders: async (headers) => {
        const user = auth.currentUser;

        if (user) {
            const token = await user.getIdToken();
            headers.set("Authorization", `Bearer ${token}`);
        }

        return headers;
    },
});

export const serviceApi = createApi({
    reducerPath: "serviceApi",
    baseQuery,

    endpoints: (builder) => ({
        getUserData: builder.query({
            query: (CompanyId) => ({
                url: "/api/getAll",
                params: CompanyId ? { CompanyId } : {},
            }),
        }),
    }),
});

export const { useGetUserDataQuery } = serviceApi;