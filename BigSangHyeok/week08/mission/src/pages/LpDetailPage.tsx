import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getMyInfo } from "../apis/auth";
import { deleteComment, deleteLp, likeLp, patchComment, patchLp, postComment, unlikeLp, uploadImage } from "../apis/lp";
import { CommentSkeletonList, ErrorState, LpDetailSkeleton } from "../components/QueryState";
import useGetLpComments from "../hooks/queries/useGetLpComments";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import type { Likes, Lp, LpComment, ResponseLpDetailDto, ResponseLpListDto } from "../types/lp";

const EditIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const TrashIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16M9 7V4h6v3m-8 0l1 13h8l1-13M10 11v5M14 11v5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CheckIcon = () => (
    <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ImageIcon = () => (
    <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h16v14H4zM7 16l3.5-4 2.5 3 2-2.2L19 17M8.5 9.5h.01" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
    <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
        <path
            d="M12 20s-7-4.5-9-9.2C1.5 7.1 3.6 4 7 4c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.4 0 5.5 3.1 4 6.8C19 15.5 12 20 12 20z"
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
        />
    </svg>
);

const MoreIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 6h.01M12 12h.01M12 18h.01" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
);

const formatRelativeDate = (value: string) => {
    const diff = Date.now() - new Date(value).getTime();
    const minutes = Math.max(1, Math.floor(diff / 60000));

    if (minutes < 60) {
        return `${minutes} mins ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours} hours ago`;
    }

    return `${Math.floor(hours / 24)} days ago`;
};

const getOptimisticLike = (lpId: number, userId: number): Likes => ({
    id: -Date.now(),
    lpId,
    userId,
});

const toggleLpLike = (targetLp: Lp, userId: number) => {
    const alreadyLiked = targetLp.likes.some((like) => like.userId === userId);

    return {
        ...targetLp,
        likes: alreadyLiked
            ? targetLp.likes.filter((like) => like.userId !== userId)
            : [...targetLp.likes, getOptimisticLike(targetLp.id, userId)],
    };
};

const LpDetailPage = () => {
    const { lpid } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [commentOrder, setCommentOrder] = useState<"asc" | "desc">("desc");
    const [commentContent, setCommentContent] = useState("");
    const [openedCommentId, setOpenedCommentId] = useState<number | null>(null);
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingContent, setEditingContent] = useState("");
    const [isEditingLp, setIsEditingLp] = useState(false);
    const [editingTitle, setEditingTitle] = useState("");
    const [editingThumbnailFile, setEditingThumbnailFile] = useState<File | null>(null);
    const commentLoadMoreRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { data, isLoading, isError, refetch } = useGetLpDetail(lpid);
    const { data: myInfo } = useQuery({
        queryKey: ["my-info"],
        queryFn: getMyInfo,
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
    });
    const {
        data: commentsData,
        isLoading: isCommentsLoading,
        isError: isCommentsError,
        refetch: refetchComments,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetLpComments(lpid, commentOrder);
    const lp = data?.data as Lp | undefined;
    const comments: LpComment[] = commentsData?.pages.flatMap((page) => page.data.data) ?? [];
    const isMyLp = Boolean(myInfo?.data?.id && lp?.authorId === myInfo.data.id);
    const isLiked = Boolean(myInfo?.data?.id && lp?.likes.some((like) => like.userId === myInfo.data.id));
    const editingThumbnailPreview = useMemo(() => {
        if (!editingThumbnailFile) {
            return lp?.thumbnail ?? "";
        }

        return URL.createObjectURL(editingThumbnailFile);
    }, [editingThumbnailFile, lp?.thumbnail]);

    useEffect(() => {
        if (!lp) {
            return;
        }

        setEditingTitle(lp.title);
    }, [lp]);

    useEffect(() => {
        return () => {
            if (editingThumbnailFile && editingThumbnailPreview) {
                URL.revokeObjectURL(editingThumbnailPreview);
            }
        };
    }, [editingThumbnailFile, editingThumbnailPreview]);

    const invalidateComments = async () => {
        await queryClient.invalidateQueries({ queryKey: ["lpComments", lpid] });
    };

    const createCommentMutation = useMutation({
        mutationFn: postComment,
        onSuccess: async () => {
            setCommentContent("");
            await invalidateComments();
        },
    });

    const updateCommentMutation = useMutation({
        mutationFn: patchComment,
        onSuccess: async () => {
            setEditingCommentId(null);
            setEditingContent("");
            await invalidateComments();
        },
    });

    const deleteCommentMutation = useMutation({
        mutationFn: deleteComment,
        onSuccess: invalidateComments,
    });

    const updateLpMutation = useMutation({
        mutationFn: async () => {
            if (!lp || !lpid) {
                throw new Error("LP 정보가 없습니다.");
            }

            const uploadedImage = editingThumbnailFile ? await uploadImage(editingThumbnailFile) : null;

            return patchLp({
                lpid,
                body: {
                    title: editingTitle.trim(),
                    content: lp.content,
                    thumbnail: uploadedImage?.data.imageUrl ?? lp.thumbnail,
                    tags: lp.tags.map((tag) => tag.name),
                    published: lp.published,
                },
            });
        },
        onSuccess: async () => {
            setIsEditingLp(false);
            setEditingThumbnailFile(null);
            await queryClient.invalidateQueries({ queryKey: ["lp", lpid] });
            await queryClient.invalidateQueries({ queryKey: ["lps"] });
        },
    });

    const deleteLpMutation = useMutation({
        mutationFn: deleteLp,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["lps"] });
            navigate("/");
        },
    });

    const likeMutation = useMutation({
        mutationFn: () => (isLiked ? unlikeLp(lpid ?? "") : likeLp(lpid ?? "")),
        onMutate: async () => {
            if (!lpid || !lp || !myInfo?.data?.id) {
                return;
            }

            const userId = myInfo.data.id;

            await queryClient.cancelQueries({ queryKey: ["lp", lpid] });
            await queryClient.cancelQueries({ queryKey: ["lps"] });

            const previousLpDetail = queryClient.getQueryData<ResponseLpDetailDto>(["lp", lpid]);
            const previousLpListQueries = queryClient.getQueriesData<InfiniteData<ResponseLpListDto>>({
                queryKey: ["lps"],
            });

            queryClient.setQueryData<ResponseLpDetailDto>(["lp", lpid], (oldData) => {
                if (!oldData?.data) {
                    return oldData;
                }

                return {
                    ...oldData,
                    data: toggleLpLike(oldData.data, userId),
                };
            });

            queryClient.setQueriesData<InfiniteData<ResponseLpListDto>>({ queryKey: ["lps"] }, (oldData) => {
                if (!oldData) {
                    return oldData;
                }

                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        data: {
                            ...page.data,
                            data: page.data.data.map((pageLp) => (pageLp.id === lp.id ? toggleLpLike(pageLp, userId) : pageLp)),
                        },
                    })),
                };
            });

            return { previousLpDetail, previousLpListQueries };
        },
        onError: (_error, _variables, context) => {
            queryClient.setQueryData(["lp", lpid], context?.previousLpDetail);
            context?.previousLpListQueries.forEach(([queryKey, previousData]) => {
                queryClient.setQueryData(queryKey, previousData);
            });
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: ["lp", lpid] });
            await queryClient.invalidateQueries({ queryKey: ["lps"] });
        },
    });

    useEffect(() => {
        const target = commentLoadMoreRef.current;

        if (!target) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                    void fetchNextPage();
                }
            },
            { rootMargin: "260px" },
        );

        observer.observe(target);

        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const handleCreateComment = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!lpid || !commentContent.trim()) {
            return;
        }

        createCommentMutation.mutate({ lpid, body: { content: commentContent.trim() } });
    };

    const submitCommentEdit = (commentId: number) => {
        if (!lpid || !editingContent.trim()) {
            return;
        }

        updateCommentMutation.mutate({ lpid, commentId, body: { content: editingContent.trim() } });
    };

    if (isLoading) {
        return (
            <section className="px-4 py-10">
                <LpDetailSkeleton />
            </section>
        );
    }

    if (isError || !lp) {
        return (
            <section className="px-4 py-10">
                <ErrorState message="LP 상세 정보를 불러오지 못했습니다." onRetry={() => void refetch()} />
            </section>
        );
    }

    return (
        <section className="space-y-10 px-4 py-10">
            <article className="mx-auto w-full max-w-5xl rounded-[18px] bg-[#282a31] px-10 py-10 text-[#f2f3f8]">
                <header className="grid gap-6 sm:grid-cols-[1fr_auto]">
                    <div className="min-w-0">
                        <div className="flex items-center gap-3">
                            <img
                                src={lp.author?.avatar ?? "https://ui-avatars.com/api/?name=LP&background=e5e7eb&color=777"}
                                alt=""
                                className="h-10 w-10 rounded-full object-cover"
                            />
                            <strong className="text-xl">{lp.author?.name ?? "알 수 없음"}</strong>
                        </div>
                        {isEditingLp ? (
                            <input
                                value={editingTitle}
                                onChange={(event) => setEditingTitle(event.target.value)}
                                className="mt-8 h-14 w-full max-w-3xl rounded-md border border-white bg-[#282a31] px-5 text-3xl font-bold text-white outline-none"
                            />
                        ) : (
                            <h1 className="mt-8 text-3xl font-bold">{lp.title}</h1>
                        )}
                    </div>
                    <div className="flex items-center gap-5 self-start text-white">
                        <span className="mr-8 text-xl font-semibold">{formatRelativeDate(lp.createdAt)}</span>
                        {isMyLp && (
                            <>
                                {isEditingLp && (
                                    <>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={(event) => setEditingThumbnailFile(event.target.files?.[0] ?? null)}
                                            className="sr-only"
                                        />
                                        <button type="button" onClick={() => fileInputRef.current?.click()} aria-label="LP 사진 변경" className="hover:text-[#ff2ea3]">
                                            <ImageIcon />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateLpMutation.mutate()}
                                            disabled={!editingTitle.trim() || updateLpMutation.isPending}
                                            aria-label="LP 수정 저장"
                                            className="hover:text-[#ff2ea3] disabled:text-[#7c818f]"
                                        >
                                            <CheckIcon />
                                        </button>
                                    </>
                                )}
                                {!isEditingLp && (
                                    <button type="button" onClick={() => setIsEditingLp(true)} aria-label="LP 수정" className="hover:text-[#ff2ea3]">
                                        <EditIcon />
                                    </button>
                                )}
                                <button type="button" onClick={() => deleteLpMutation.mutate(String(lp.id))} disabled={deleteLpMutation.isPending} aria-label="LP 삭제" className="hover:text-[#ff2ea3] disabled:text-[#7c818f]">
                                    <TrashIcon />
                                </button>
                            </>
                        )}
                    </div>
                </header>

                <div className="mx-auto mt-10 w-full max-w-3xl overflow-hidden bg-[#24262f]">
                    <img src={editingThumbnailPreview || "https://ui-avatars.com/api/?name=LP&background=222&color=fff"} alt={lp.title} className="aspect-[4/3] w-full object-cover" />
                </div>

                <p className="mx-auto mt-8 max-w-3xl whitespace-pre-line leading-7 text-[#f2f3f8]">{lp.content}</p>

                {lp.tags.length > 0 && (
                    <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap gap-3">
                        {lp.tags.map((tag) => (
                            <li key={tag.id} className="rounded-md border border-[#5c6678] px-3 py-1 text-sm">
                                {tag.name}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="mt-8 flex justify-center">
                    <button
                        type="button"
                        onClick={() => likeMutation.mutate()}
                        disabled={likeMutation.isPending}
                        className={`flex items-center gap-2 text-3xl ${isLiked ? "text-[#ff2ea3]" : "text-[#ff9ccf]"}`}
                        aria-label="좋아요"
                    >
                        <HeartIcon filled={isLiked} />
                        <span className="text-white">{lp.likes.length}</span>
                    </button>
                </div>
            </article>

            <section className="mx-auto w-full max-w-5xl rounded-[18px] bg-[#282a31] px-10 py-8 text-[#f2f3f8]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-2xl font-bold">댓글</h2>
                    <div className="inline-flex self-start overflow-hidden rounded-md border border-white bg-[#282a31] text-lg font-semibold sm:self-auto">
                        <button type="button" onClick={() => setCommentOrder("asc")} className={`px-5 py-2 ${commentOrder === "asc" ? "bg-white text-black" : "text-white"}`}>
                            오래된순
                        </button>
                        <button type="button" onClick={() => setCommentOrder("desc")} className={`px-5 py-2 ${commentOrder === "desc" ? "bg-white text-black" : "text-white"}`}>
                            최신순
                        </button>
                    </div>
                </div>

                <form onSubmit={handleCreateComment} className="mt-6 flex gap-3">
                    <input
                        type="text"
                        value={commentContent}
                        onChange={(event) => setCommentContent(event.target.value)}
                        placeholder="댓글을 입력해주세요"
                        className="h-12 min-w-0 flex-1 rounded-md border border-[#9aa4af] bg-[#282a31] px-4 text-white outline-none placeholder:text-[#9aa4af] focus:border-white"
                    />
                    <button type="submit" disabled={!commentContent.trim() || createCommentMutation.isPending} className="h-12 rounded-md bg-[#9aa4af] px-6 font-semibold text-white disabled:bg-[#3b3f4b]">
                        작성
                    </button>
                </form>

                <div className="mt-8">
                    {isCommentsLoading && <CommentSkeletonList count={10} />}
                    {isCommentsError && <ErrorState message="댓글을 불러오지 못했습니다." onRetry={() => void refetchComments()} />}
                    {!isCommentsLoading && !isCommentsError && (
                        <>
                            <ul className="space-y-8">
                                {comments.map((comment) => {
                                    const isMyComment = myInfo?.data?.id === comment.authorId;
                                    const isEditing = editingCommentId === comment.id;

                                    return (
                                        <li key={comment.id} className="flex gap-4">
                                            <img
                                                src={comment.author.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.name)}&background=cf1b6f&color=fff`}
                                                alt=""
                                                className="h-10 w-10 shrink-0 rounded-full object-cover"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0 flex-1">
                                                        <strong className="text-xl">{comment.author.name}</strong>
                                                        {isEditing ? (
                                                            <input
                                                                value={editingContent}
                                                                onChange={(event) => setEditingContent(event.target.value)}
                                                                className="mt-2 h-12 w-full rounded-md border border-white bg-[#282a31] px-4 text-lg text-white outline-none"
                                                            />
                                                        ) : (
                                                            <p className="mt-1 text-lg text-white">{comment.content}</p>
                                                        )}
                                                    </div>
                                                    {isMyComment && (
                                                        <div className="relative shrink-0">
                                                            {isEditing ? (
                                                                <button type="button" onClick={() => submitCommentEdit(comment.id)} className="text-white hover:text-[#ff2ea3]" aria-label="댓글 수정 저장">
                                                                    <CheckIcon />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    aria-label="댓글 메뉴"
                                                                    onClick={() => setOpenedCommentId((prev) => (prev === comment.id ? null : comment.id))}
                                                                    className="text-white hover:text-[#ff2ea3]"
                                                                >
                                                                    <MoreIcon />
                                                                </button>
                                                            )}
                                                            {openedCommentId === comment.id && !isEditing && (
                                                                <div className="absolute right-0 top-10 z-10 flex overflow-hidden rounded-md bg-black shadow-xl">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setEditingCommentId(comment.id);
                                                                            setEditingContent(comment.content);
                                                                            setOpenedCommentId(null);
                                                                        }}
                                                                        className="px-4 py-3 hover:bg-[#24262f]"
                                                                        aria-label="댓글 수정"
                                                                    >
                                                                        <EditIcon />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => lpid && deleteCommentMutation.mutate({ lpid, commentId: comment.id })}
                                                                        className="px-4 py-3 hover:bg-[#24262f]"
                                                                        aria-label="댓글 삭제"
                                                                    >
                                                                        <TrashIcon />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                            {isFetchingNextPage && (
                                <div className="mt-8">
                                    <CommentSkeletonList count={6} />
                                </div>
                            )}
                            <div ref={commentLoadMoreRef} className="h-10" />
                        </>
                    )}
                </div>
            </section>
        </section>
    );
};

export default LpDetailPage;
