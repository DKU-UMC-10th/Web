import axiosInstance from './axios'; // 👈 지오님이 쓰시는 axios 설정 파일 경로

/**
 * 1. 댓글 목록 조회
 * GET /v1/lps/{lpid}/comments
 */
export const getComments = async (lpid) => {
    const response = await axiosInstance.get(`/v1/lps/${lpid}/comments`);
    // 서버 응답 구조에 따라 response.data 혹은 response.data.result 등으로 조절하세요.
    return response.data; 
};

/**
 * 2. 댓글 작성
 * POST /v1/lps/{lpid}/comments
 */
export const postComment = async (lpid, data) => {
    // data는 { content: "댓글내용" } 형태
    const response = await axiosInstance.post(`/v1/lps/${lpid}/comments`, data);
    return response.data;
};

/**
 * 3. 댓글 수정
 * PATCH /v1/comments/{commentId}
 */
export const patchComment = async (commentId, data) => {
    // data는 { content: "수정할내용" } 형태
    const response = await axiosInstance.patch(`/v1/comments/${commentId}`, data);
    return response.data;
};

/**
 * 4. 댓글 삭제
 * DELETE /v1/comments/{commentId}
 */
export const deleteComment = async (commentId) => {
    const response = await axiosInstance.delete(`/v1/comments/${commentId}`);
    return response.data;
};