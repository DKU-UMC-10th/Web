import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyInfo, patchMyInfo } from "../apis/auth";
import { ErrorState, LoadingPanel } from "../components/QueryState";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=ME&background=e5e7eb&color=888";

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
        if (!data?.data) {
            return;
        }

        setName(data.data.name);
        setBio(data.data.bio ?? "");
        setAvatar(data.data.avatar ?? "");
    }, [data]);

    const updateMutation = useMutation({
        mutationFn: () =>
            patchMyInfo({
                name: name.trim(),
                bio: bio.trim(),
                avatar,
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["my-info"] });
            setIsEditing(false);
        },
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        updateMutation.mutate();
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
        <section className="px-4 py-10">
            <div className="mx-auto flex w-full max-w-3xl items-center gap-10 text-[#f2f3f8]">
                <img src={avatar || DEFAULT_AVATAR} alt="" className="h-48 w-48 shrink-0 rounded-full bg-[#d8d8d8] object-cover" />

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="min-w-0 flex-1 space-y-4">
                        <div className="flex items-center gap-6">
                            <input
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                className="h-14 min-w-0 flex-1 rounded-md border border-white bg-black px-4 text-3xl font-bold outline-none"
                            />
                            <button
                                type="submit"
                                disabled={!name.trim() || updateMutation.isPending}
                                aria-label="저장"
                                className="shrink-0 text-5xl font-bold leading-none hover:text-[#ff2ea3] disabled:text-[#7c818f]"
                            >
                                ✓
                            </button>
                        </div>
                        <input
                            value={bio}
                            onChange={(event) => setBio(event.target.value)}
                            placeholder="Bio"
                            className="h-12 w-full rounded-md border border-white bg-black px-4 text-xl outline-none"
                        />
                        <p className="text-xl font-semibold">{data.data.email}</p>
                        {updateMutation.isError && <p className="text-sm text-red-400">프로필 수정에 실패했습니다.</p>}
                    </form>
                ) : (
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-8">
                            <h1 className="text-5xl font-bold">{data.data.name}</h1>
                            <button type="button" onClick={() => setIsEditing(true)} aria-label="프로필 수정" className="text-3xl text-[#a3a7b2] hover:text-white">
                                ⚙
                            </button>
                        </div>
                        <p className="mt-4 text-2xl text-[#a3a7b2]">{data.data.bio || "소개가 없습니다."}</p>
                        <p className="mt-4 text-2xl font-semibold">{data.data.email}</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default MyPage;
