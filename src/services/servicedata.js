
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { loginRequest } from "../authConfig";
import { msalInstance } from "../msalConfig"; // Import the MSAL instance

const baseQueryWithAuth = async (args, api, extraOptions) => {
    const baseQuery = fetchBaseQuery({
        baseUrl: process.env.REACT_APP_BASE_URL, // Backend API URL
        prepareHeaders: async (headers) => {
            try {
                const accounts = msalInstance.getAllAccounts();
                if (accounts.length > 0) {
                    // Acquire token silently
                    const response = await msalInstance.acquireTokenSilent({
                        ...loginRequest,
                        account: accounts[0],
                    });

                    if (response?.accessToken) {
                        headers.set("Authorization", `Bearer ${response.accessToken}`);
                    } else {
                        console.warn(" No access token received");
                    }
                }
            } catch (error) {

                // If token acquisition fails, force interactive login
                if (error.message.includes("interaction_required")) {
                    console.warn("Interactive login required");
                    await msalInstance.loginPopup(loginRequest);
                }
            }
            return headers;
        },
    });

    return baseQuery(args, api, extraOptions);
};

// Define the API slice with RTK Query
export const serviceApi = createApi({
    reducerPath: "serviceApi",
    baseQuery: baseQueryWithAuth, // Use custom baseQuery
    endpoints: (builder) => ({
        getUserData: builder.query({
            query: () => "/api/getAll",
        }),
    }),
});

export const { useGetUserDataQuery } = serviceApi;