
import { useMsal } from '@azure/msal-react';
import axios from 'axios';
import { useMemo } from 'react';
import { loginRequest } from "../../authConfig";

const useApi = () => {
    const { accounts, instance } = useMsal();  // Ensure you have access to the MSAL instance

    const Api = useMemo(() => {
        const axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_BASE_URL,
            withCredentials: true,
        });

        axiosInstance.interceptors.request.use(
            async (config) => { // Make this function async
                if (!config.url.includes('/login') && accounts.length > 0) {
                    try {
                        // Acquire token silently
                        const response = await instance.acquireTokenSilent({
                            ...loginRequest,
                            account: accounts[0]
                        });

                        const accessToken = response.accessToken;

                        // Set Authorization header with the access token
                        config.headers['Authorization'] = `Bearer ${accessToken}`;
                    } catch (error) {
                        console.error('Error acquiring token:', error);
                        // Optionally handle token acquisition error (e.g., fall back to login)
                    }
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return axiosInstance;
    }, [accounts, instance]); // Adding 'instance' to the dependency array

    return Api;
};

export default useApi;



