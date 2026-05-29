import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { CommonResponse } from "../types/common";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "../utils/token";

const API_URL = import.meta.env.VITE_SERVER_API_URL ?? "http://localhost:8000";

type TokenResponse = {
    accessToken: string;
    refreshToken: string;
};

type RetryableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

export const publicAxios = axios.create({
    baseURL: API_URL,
});

export const axiosInstance = axios.create({
    baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<CommonResponse<unknown>>) => {
        const originalRequest = error.config as RetryableRequestConfig | undefined;

        if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
            return Promise.reject(error);
        }

        const refreshToken = getRefreshToken();

        if (!refreshToken) {
            clearTokens();
            window.dispatchEvent(new CustomEvent("token-refresh-fail"));
            window.location.href = "/login";
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const { data } = await publicAxios.post<CommonResponse<TokenResponse>>("/v1/auth/refresh", {
                refresh: refreshToken,
            });

            setTokens(data.data.accessToken, data.data.refreshToken);
            originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
            window.dispatchEvent(new CustomEvent("token-refresh-success"));

            return axiosInstance(originalRequest);
        } catch (refreshError) {
            clearTokens();
            window.dispatchEvent(new CustomEvent("token-refresh-fail"));
            window.location.href = "/login";
            return Promise.reject(refreshError);
        }
    },
);
