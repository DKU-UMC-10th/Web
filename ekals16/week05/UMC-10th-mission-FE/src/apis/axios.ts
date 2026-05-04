import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const rawAccessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    const accessToken = rawAccessToken ? JSON.parse(rawAccessToken) : null;

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});