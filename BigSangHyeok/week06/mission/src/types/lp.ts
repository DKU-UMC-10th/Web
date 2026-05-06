import type { CommonResponse } from "./common";

export type Tag = {
    id: number;
    name: string;
};

export type Likes = {
    id: number;
    userId: number;
    lpId: number;
};

export type LpAuthor = {
    id: number;
    name: string;
    email?: string;
    bio?: string | null;
    avatar?: string | null;
};

export type Lp = {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published: boolean;
    authorId: number;
    createdAt: string;
    updatedAt: string;
    tags: Tag[];
    likes: Likes[];
    author?: LpAuthor;
};

export type ResponseLpListDto = CommonResponse<{
    data: Lp[];
    nextCursor: number;
    hasNext: boolean;
}>;

export type ResponseLpDetailDto = CommonResponse<Lp>;
