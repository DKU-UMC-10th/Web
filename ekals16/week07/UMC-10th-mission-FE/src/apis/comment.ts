import { axiosInstance } from "./axios";
import type { PaginationOrder } from "../enums/common";
import type {
  RequestCreateCommentDto,
  RequestUpdateCommentDto,
  ResponseCommentDto,
  ResponseCommentListDto,
} from "../types/comment";

export const getCommentList = async ({
  lpId,
  order,
}: {
  lpId: string;
  order?: PaginationOrder;
}): Promise<ResponseCommentListDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: { order },
  });

  return data;
};

export const createComment = async ({
  lpId,
  content,
}: {
  lpId: string;
} & RequestCreateCommentDto): Promise<ResponseCommentDto> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
    content,
  });

  return data;
};

export const updateComment = async ({
  lpId,
  commentId,
  content,
}: {
  lpId: string;
  commentId: number;
} & RequestUpdateCommentDto): Promise<ResponseCommentDto> => {
  const { data } = await axiosInstance.patch(
    `/v1/lps/${lpId}/comments/${commentId}`,
    { content },
  );

  return data;
};

export const deleteComment = async ({
  lpId,
  commentId,
}: {
  lpId: string;
  commentId: number;
}): Promise<void> => {
  await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
};
