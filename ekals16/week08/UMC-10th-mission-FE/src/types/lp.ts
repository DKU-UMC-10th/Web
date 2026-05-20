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

export type ResponseLpListDto = {
    status: boolean;
    statusCode: number;
    message: string;
    data: {
        data: Lp[];
        nextCursor: number;
        hasNext: boolean;
    };
};

export type ResponseLpDetailDto = {
    status: boolean;
    statusCode: number;
    message: string;
    data: Lp;
};

export type RequestCreateLpDto = {
    title: string;
    content: string;
    thumbnail?: string;
    tags: string[];
    published: boolean;
};

export type RequestUpdateLpDto = {
    title: string;
    content: string;
    thumbnail?: string;
    tags: string[];
    published: boolean;
};
