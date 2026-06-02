import type { CommonResponse } from "./common";

export type LpCommentAuthor = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LpComment = {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author?: LpCommentAuthor;
};

export type ResponseLpCommentsDto = CommonResponse<{
  data: LpComment[];
  nextCursor: number;
  hasNext: boolean;
}>;
