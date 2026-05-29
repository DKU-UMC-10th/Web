import type { PaginationDto } from "../types/common";
import type {
    RequestCommentDto,
    RequestLpDto,
    ResponseCommentDto,
    ResponseDeleteCommentDto,
    ResponseLpCommentListDto,
    ResponseLpDetailDto,
    ResponseLpListDto,
    ResponseLpMutationDto,
    ResponseUploadImageDto,
} from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async (paginationDto:PaginationDto)
: Promise<ResponseLpListDto> => {
    const{data} = await axiosInstance.get("/v1/lps", {
        params:paginationDto,
    });

    return data;
};

export const getLpDetail = async (lpid: string): Promise<ResponseLpDetailDto> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpid}`);

    return data;
};

export const getLpComments = async (lpid: string, paginationDto: PaginationDto): Promise<ResponseLpCommentListDto> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpid}/comments`, {
        params: paginationDto,
    });

    return data;
};

export const uploadImage = async (file: File): Promise<ResponseUploadImageDto> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axiosInstance.post("/v1/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
};

export const postLp = async (body: RequestLpDto): Promise<ResponseLpMutationDto> => {
    const { data } = await axiosInstance.post("/v1/lps", body);

    return data;
};

export const patchLp = async ({ lpid, body }: { lpid: string; body: Partial<RequestLpDto> }): Promise<ResponseLpMutationDto> => {
    const { data } = await axiosInstance.patch(`/v1/lps/${lpid}`, body);

    return data;
};

export const deleteLp = async (lpid: string) => {
    const { data } = await axiosInstance.delete(`/v1/lps/${lpid}`);

    return data;
};

export const postComment = async ({ lpid, body }: { lpid: string; body: RequestCommentDto }): Promise<ResponseCommentDto> => {
    const { data } = await axiosInstance.post(`/v1/lps/${lpid}/comments`, body);

    return data;
};

export const patchComment = async ({
    lpid,
    commentId,
    body,
}: {
    lpid: string;
    commentId: number;
    body: RequestCommentDto;
}): Promise<ResponseCommentDto> => {
    const { data } = await axiosInstance.patch(`/v1/lps/${lpid}/comments/${commentId}`, body);

    return data;
};

export const deleteComment = async ({ lpid, commentId }: { lpid: string; commentId: number }): Promise<ResponseDeleteCommentDto> => {
    const { data } = await axiosInstance.delete(`/v1/lps/${lpid}/comments/${commentId}`);

    return data;
};

export const likeLp = async (lpid: string) => {
    const { data } = await axiosInstance.post(`/v1/lps/${lpid}/likes`);

    return data;
};

export const unlikeLp = async (lpid: string) => {
    const { data } = await axiosInstance.delete(`/v1/lps/${lpid}/likes`);

    return data;
};
