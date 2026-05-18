import type { CursorBasedResponse } from "./common";

export type Tag = {
    id: number;
    name: string;
}

export type Likes = {
    id: number;
    userId: number;
    lpId: number;
}

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
    author?: {
        id: number;
        name: string;
        email: string;
        bio: string | null;
        avatar: string | null;
        createdAt: string;
        updatedAt: string;
    };
}

export type ResponseLpListDto = CursorBasedResponse<{
    data: Lp[];
}>;

export type ResponseLpDetailDto = {
    status: boolean;
    statusCode: number;
    message: string;
    data: Lp;
};
