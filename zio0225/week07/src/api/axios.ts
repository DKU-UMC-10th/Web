import axios, { 
  type AxiosInstance, 
  type AxiosError, 
  type InternalAxiosRequestConfig 
} from 'axios';

// 1. axios 인스턴스 생성
const api: AxiosInstance = axios.create({
    // Vite 프록시를 사용한다면 '/api' 처럼 접두사를 붙이는 것이 관리가 편합니다.
    // .env 파일에 VITE_API_BASE_URL=/v1 등으로 관리하는 것을 추천해요.
    baseURL: 'http://localhost:8000', 
    timeout: 5000, // 응답 대기 시간 설정 (선택)
});

// 2. 요청 인터셉터
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
            // as AxiosRequestHeaders 타입 단언 없이도 최신 버전에서는 잘 작동합니다.
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 3. 응답 인터셉터
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // 401 에러(토큰 만료) 발생 시 처리
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                
                // 주의: 토큰 갱신 시에는 'api' 인스턴스가 아닌 일반 'axios'를 써야 합니다.
                // (api를 쓰면 여기서 또 401이 날 때 무한 루프에 빠질 위험이 있음)
                const { data } = await axios.post<{ accessToken: string }>(
                    '/v1/auth/refresh', // 프록시 설정에 맞게 경로 확인
                    { refreshToken }
                );

                const newAccessToken = data.accessToken;
                localStorage.setItem('accessToken', newAccessToken);

                // 새 토큰으로 헤더 교체 후 원래 요청 재시도
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }
                return api(originalRequest);
            } catch (refreshError) {
                // 리프레시 토큰까지 만료된 경우: 로그아웃 처리
                console.error("세션이 만료되었습니다. 다시 로그인해주세요.");
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                
                // SPA라면 navigate를 쓰는 게 좋지만, 인터셉터는 React 외부이므로 
                // 강제 이동 방식이 가장 확실합니다.
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;