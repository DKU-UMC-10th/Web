import axiosInstance from './axiosInstance';

export const patchUserProfile = (data) => axiosInstance.patch('/user/profile', data);