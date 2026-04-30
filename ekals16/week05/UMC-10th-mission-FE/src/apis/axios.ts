import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import useLocalStorage from "../hooks/useLocalStorage";
import type { InternalAxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// 전역 변수로 refresh 요청의 Promise를 저장해서 중복 요청을 방지한다.
let refreshPromise:Promise<string> | null = null;

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 요청 인터셉터: 모든 요청 전에 accessToken을 Authorization 헤더에 추가한다.
axiosInstance.interceptors.request.use((config) => {
    // accessToken을 로컬 스토리지에서 가져온다.
    const { getItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const accessToken = getItem();

    // accessToken이 존재하면 Authorization 헤더에 Bearer 토큰으로 추가한다.
    if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // 수정된 요청 설정을 반환한다.
    return config;
}, (error) => {
    // 요청 인터셉터가 실패하면 에러를 반환한다.
    return Promise.reject(error);
});

// 응답 인터셉터: 401 Unauthorized 에러가 발생하면 accessToken을 갱신한다.
axiosInstance.interceptors.response.use((response) => {
    // 응답이 성공적이면 그대로 반환한다.
    return response;
},
async (error) => {
    const originalRequest: CustomAxiosRequestConfig = error.config;

    // 401 에러이면서, 아직 토큰 갱신 시도를 하지 않은 경우에만 갱신 로직을 수행한다.
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        // refresh 엔드포인트 401 에러가 발생한 경우 (Unauthorized), 중복 재시도 방지를 위해 로그아웃 처리.
        if (originalRequest.url === "/v1/auth/refresh") {
            const { removeItem: removeAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
            const { removeItem: removeRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
            removeAccessToken();
            removeRefreshToken();
            window.location.href = "/login";
            return Promise.reject(error);
        }
        // 재시도 플래그 설정
        originalRequest._retry = true;

        // 이미 리프레시 요청이 진행중이면, 그 Promise를 재사용합니다.
        if (!refreshPromise) {
            refreshPromise = (async () => {
                const { getItem: getRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
                const refreshToken = getRefreshToken();

                // refresh 토큰으로 새 accessToken을 요청한다.
                const { data } = await axiosInstance.post("/v1/auth/refresh", {
                    refresh: refreshToken,
                });

                // 새 토큰을 로컬 스토리지에 저장한다.
                const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
                const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
                setAccessToken(data.data.accessToken);
                setRefreshToken(data.data.refreshToken);

                return data.data.accessToken;
            })()
                .catch((refreshError) => {
                    // refresh 실패 시 토큰 삭제 후 에러 반환
                    const { removeItem: removeAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
                    const { removeItem: removeRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
                    removeAccessToken();
                    removeRefreshToken();
                    return Promise.reject(refreshError);
                })
                .finally(() => {
                    // refresh 요청이 끝나면 프라미스 초기화
                    refreshPromise = null;
                });
        }

        // 새 accessToken으로 원래 요청을 다시 실행한다.
        return refreshPromise.then((newAccessToken) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance.request(originalRequest);
        });
    }

    // 401 에러가 아닌 경우에 그대로 오류를 반환
    return Promise.reject(error);
},
);
            