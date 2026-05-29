import type { CursorBasedResponse } from "./common";

export type LpComment = {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type RequestCreateCommentDto = {
  content: string;
};

export type RequestUpdateCommentDto = {
  content: string;
};

export type ResponseCommentListDto = CursorBasedResponse<{
  data: LpComment[];
}>;

export type ResponseCommentDto = {
  status: boolean;
  statusCode: number;
  message: string;
  data: LpComment;
};
