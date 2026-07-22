import axios from "axios";
import { useMemo } from "react";
import { auth } from "../../firebase";

const useApi = () => {
  const Api = useMemo(() => {
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      withCredentials: true,
    });

    axiosInstance.interceptors.request.use(
      async (config) => {
        const user = auth.currentUser;

        if (user && !config.url.includes("/login")) {
          const token = await user.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    return axiosInstance;
  }, []);

  return Api;
};

export default useApi;