import api from './axios';

// 로그인 요청 함수
export const loginUser = async (credentials) => {
    // credentials에는 { email, password } 등이 들어옵니다.
    const response = await api.post('/v1/auth/login', credentials);
    return response.data; // 서버에서 준 accessToken, refreshToken 등이 담긴 데이터
};

// 로그아웃 요청 함수 (미션에 포함되어 있으니 미리 만듭니다)
export const logoutUser = async () => {
    const response = await api.post('/v1/auth/logout');
    return response.data;
};