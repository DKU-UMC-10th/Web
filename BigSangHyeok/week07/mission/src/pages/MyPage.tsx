import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyInfo, patchMyInfo } from "../apis/auth";
import { ErrorState, LoadingPanel } from "../components/QueryState";
import type { RequestUpdateUserDto, ResponseMyInfoDto } from "../types/auth";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=ME&background=e5e7eb&color=888";

const CheckIcon = () => (
    <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const GearIcon = () => (
    <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
        <path
            d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM19.4 15a8 8 0 0 0 .1-1l2-1.5-2-3.5-2.4 1a8.2 8.2 0 0 0-1.7-1L15 6.5h-4L10.6 9a8.2 8.2 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a8 8 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a8.2 8.2 0 0 0 1.7 1l.4 2.5h4l.4-2.5a8.2 8.2 0 0 0 1.7-1l2.4 1 2-3.5-2.1-1.5z"
            fill="currentColor"
        />
    </svg>
);

const MyPage = () => {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [avatar, setAvatar] = useState("");
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["my-info"],
        queryFn: getMyInfo,
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (!data?.data || isEditing) {
            return;
        }

        setName(data.data.name);
        setBio(data.data.bio ?? "");
        setAvatar(data.data.avatar ?? "");
    }, [data, isEditing]);

    const updateMutation = useMutation({
        mutationFn: (body: RequestUpdateUserDto) => patchMyInfo(body),
        onMutate: async (body) => {
            await queryClient.cancelQueries({ queryKey: ["my-info"] });

            const previousMyInfoQueries = queryClient.getQueriesData<ResponseMyInfoDto>({
                queryKey: ["my-info"],
            });

            queryClient.setQueriesData<ResponseMyInfoDto>({ queryKey: ["my-info"] }, (oldData) => {
                if (!oldData?.data) {
                    return oldData;
                }

                return {
                    ...oldData,
                    data: {
                        ...oldData.data,
                        name: body.name ?? oldData.data.name,
                        bio: body.bio ?? oldData.data.bio,
                        avatar: body.avatar ?? oldData.data.avatar,
                    },
                };
            });

            setIsEditing(false);

            return { previousMyInfoQueries };
        },
        onError: (_error, _body, context) => {
            context?.previousMyInfoQueries.forEach(([queryKey, previousData]) => {
                queryClient.setQueryData(queryKey, previousData);
            });
            setIsEditing(true);
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: ["my-info"] });
        },
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        updateMutation.mutate({
            name: name.trim(),
            bio: bio.trim(),
            avatar,
        });
    };

    if (isLoading) {
        return (
            <section className="px-4 py-10">
                <LoadingPanel />
            </section>
        );
    }

    if (isError || !data?.data) {
        return (
            <section className="px-4 py-10">
                <ErrorState message="내 정보를 불러오지 못했습니다." onRetry={() => void refetch()} />
            </section>
        );
    }

    return (
        <section className="px-4 py-16">
            <div className="mx-auto flex w-full max-w-[760px] items-center gap-7 text-white">
                <img src={avatar || DEFAULT_AVATAR} alt="" className="h-44 w-44 shrink-0 rounded-full bg-[#d8d8d8] object-cover" />

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="min-w-0 flex-1">
                        <div className="flex items-center gap-5">
                            <input
                                autoFocus
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                className="h-14 w-[300px] rounded-md border border-white bg-black px-3 text-3xl font-bold leading-none text-white outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]"
                            />
                            <button
                                type="submit"
                                disabled={!name.trim() || updateMutation.isPending}
                                aria-label="저장"
                                className="flex h-14 w-10 items-center justify-center text-white hover:text-[#ff2ea3] disabled:text-[#7c818f]"
                            >
                                <CheckIcon />
                            </button>
                        </div>
                        <input
                            value={bio}
                            onChange={(event) => setBio(event.target.value)}
                            placeholder="Bio"
                            className="mt-3 h-11 w-[340px] rounded-md border border-white bg-black px-3 text-xl text-white outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]"
                        />
                        <p className="mt-4 text-xl font-semibold">{data.data.email}</p>
                        {updateMutation.isError && <p className="mt-2 text-sm text-red-400">프로필 수정에 실패해서 이전 정보로 되돌렸습니다.</p>}
                    </form>
                ) : (
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-24">
                            <h1 className="text-5xl font-bold leading-tight">{data.data.name}</h1>
                            <button type="button" onClick={() => setIsEditing(true)} aria-label="프로필 수정" className="text-white hover:text-[#ff2ea3]">
                                <GearIcon />
                            </button>
                        </div>
                        <p className="mt-2 text-2xl">{data.data.bio || "소개가 없습니다."}</p>
                        <p className="mt-3 text-xl font-semibold">{data.data.email}</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default MyPage;
