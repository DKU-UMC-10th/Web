import { axiosInstance } from "./axios";
import type { PaginationDto } from "../types/common";
import type {
    RequestCreateLpDto,
    RequestUpdateLpDto,
    ResponseLpDetailDto,
    ResponseLpListDto,
} from "../types/lp";

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

export const createLp = async (createLpDto: RequestCreateLpDto): Promise<ResponseLpDetailDto> => {
    const { data } = await axiosInstance.post("/v1/lps", createLpDto);
    return data;
};

export const updateLp = async ({
    lpid,
    updateLpDto,
}: {
    lpid: string;
    updateLpDto: RequestUpdateLpDto;
}): Promise<ResponseLpDetailDto> => {
    const { data } = await axiosInstance.patch(`/v1/lps/${lpid}`, updateLpDto);
    return data;
};

export const deleteLp = async (lpid: string): Promise<void> => {
    await axiosInstance.delete(`/v1/lps/${lpid}`);
};

export const likeLp = async (lpid: string): Promise<ResponseLpDetailDto> => {
    const { data } = await axiosInstance.post(`/v1/lps/${lpid}/likes`);
    return data;
};

export const unlikeLp = async (lpid: string): Promise<ResponseLpDetailDto> => {
    const { data } = await axiosInstance.delete(`/v1/lps/${lpid}/likes`);
    return data;
};
