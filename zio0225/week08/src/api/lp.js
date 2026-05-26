import api from './axios';

// LP 게시글 작성 API
export const createLP = async (formData) => {
    // multipart/form-data를 위해 헤더를 설정해줍니다. (axios가 자동 처리하기도 하지만 명시하면 안전합니다.)
    const response = await api.post('/v1/lps', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};