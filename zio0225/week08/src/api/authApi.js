import axiosInstance from './axiosInstance';

export const login = (data) => axiosInstance.post('/auth/login', data);
export const logout = () => axiosInstance.post('/auth/logout');
export const withdraw = () => axiosInstance.delete('/auth/withdraw'); // 탈퇴