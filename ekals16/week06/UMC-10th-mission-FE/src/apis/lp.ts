import { axiosInstance } from "./axios";
import type { PaginationDto } from "../types/common";
import type { ResponseLpCommentsDto } from "../types/comment";
import type { ResponseLpDetailDto, ResponseLpListDto } from "../types/lp";

export const getLpList = async (paginationDto: PaginationDto): Promise<ResponseLpListDto> => {
    const { data } = await axiosInstance.get("/v1/lps", {
        params: paginationDto,
    });
    return data;
};

export const getLpDetail = async (lpid: string): Promise<ResponseLpDetailDto> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpid}`);
    return data;
};

export const getLpComments = async (
    lpid: string,
    paginationDto: PaginationDto,
): Promise<ResponseLpCommentsDto> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpid}/comments`, {
        params: paginationDto,
    });
    return data;
};
