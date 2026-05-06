import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

// 1. axios 인스턴스 생성
const api: AxiosInstance = axios.create({
    // ✅ 절대 주소를 지우고 빈 문자열로 둡니다. 
    // 이렇게 해야 Vite 프록시('/v1')가 작동합니다.
    baseURL: '', 
});

// 2. 응답 인터셉터 설정
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                
                // ✅ 여기도 절대 주소를 지우고 상대 경로인 '/v1/auth/refresh'만 남깁니다.
                const { data } = await axios.post<{ accessToken: string }>(
                    '/v1/auth/refresh', 
                    { refreshToken }
                );

                const newAccessToken = data.accessToken;
                localStorage.setItem('accessToken', newAccessToken);

                if (originalRequest.headers) {
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                }
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;