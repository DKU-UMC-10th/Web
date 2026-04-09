import type { CommonResponse } from "./common";

export type RequestSignupDto= {
    name: string;
    email: string;
    bio?: string;
    avatar?: string;
    password: string;
};

export type ResponseSignupDto = CommonResponse<{
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;

export type RequestSigninDto = {
    email: string;
    password: string;

};

export type SignupFormValues = {
    email: string;
    password: string;
    passwordCheck: string;
    nickname: string;
};

export type LoginFormValues = {
    email: string;
    password: string;
};

export type AuthTokenStorage = {
    accessToken: string;
    refreshToken: string;
};

export type ResponseSigninDto = CommonResponse<{
    id: number;
    name: string;
    accessToken: string;
    refreshToken: string;
}>;

export type ResponseMyInfoDto = CommonResponse<{
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
