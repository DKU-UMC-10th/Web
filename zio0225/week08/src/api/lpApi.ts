// 지오님의 실제 파일명인 axios.ts에서 불러오기!
import api from './axios'; 

export const getLpList = async (params: { cursor?: number; limit?: number; search?: string; order?: 'asc' | 'desc' } = {}) => {
    const requestParams: Record<string, string | number> = {};

    if (params.order) {
        requestParams.order = params.order;
    }
    if (params.cursor != null) {
        requestParams.cursor = params.cursor;
    }
    if (params.limit != null) {
        requestParams.limit = params.limit;
    }
    if (params.search?.trim()) {
        requestParams.search = params.search.trim();
    }

    const { data } = await api.get('/v1/lps', {
        params: requestParams
    });
    return data;
};

export const getLpDetail = async (lpid: string) => {
    const { data } = await api.get(`/v1/lps/${lpid}`);
    return data;
};

// 🚀 [수정 포인트] 에러 해결을 위해 이름을 createLP (대문자 P)로 변경!
// 이미지 파일을 포함한 FormData를 받을 수 있도록 타입을 수정했습니다.
export const createLP = async (lpData: FormData | { title: string; content?: string; thumbnail?: string }) => {
    const { data } = await api.post('/v1/lps', lpData, {
        // FormData를 보낼 때는 브라우저가 자동으로 'multipart/form-data'를 설정하게 둡니다.
        headers: lpData instanceof FormData ? {} : { 'Content-Type': 'application/json' }
    });
    return data;
};

export const getLpsByUser = async (userId?: string) => {
    const url = userId ? `/v1/lps/user/${userId}` : '/v1/lps/user';
    const { data } = await api.get(url);
    return data;
};

export const updateLp = async (lpId: string, lpData: { title?: string; content?: string; thumbnail?: string }) => {
    const { data } = await api.patch(`/v1/lps/${lpId}`, lpData);
    return data;
};

export const deleteLp = async (lpId: string) => {
    const { data } = await api.delete(`/v1/lps/${lpId}`);
    return data;
};

export const getLpsByTag = async (tagName: string) => {
    const { data } = await api.get(`/v1/lps/tag/${tagName}`);
    return data;
};

export const getLpComments = async (params: { lpid: string; cursor?: number; limit?: number; order?: 'asc' | 'desc' }) => {
    const requestParams: Record<string, string | number> = {};

    if (params.order) {
        requestParams.order = params.order;
    }
    if (params.cursor != null) {
        requestParams.cursor = params.cursor;
    }
    if (params.limit != null) {
        requestParams.limit = params.limit;
    }

    const { data } = await api.get(`/v1/lps/${params.lpid}/comments`, {
        params: requestParams,
    });
    return data;
};

export const postLpComment = async (lpid: string, content: string) => {
    const { data } = await api.post(`/v1/lps/${lpid}/comments`, { content });
    return data;
};