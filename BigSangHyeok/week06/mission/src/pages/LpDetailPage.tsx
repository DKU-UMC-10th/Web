import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { CommentSkeletonList, ErrorState, LpDetailSkeleton } from "../components/QueryState";
import useGetLpComments from "../hooks/queries/useGetLpComments";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import type { Lp, LpComment } from "../types/lp";

const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
};

const getLp = (response: unknown): Lp | null => {
    const data = (response as { data?: unknown } | undefined)?.data;

    if (data && typeof data === "object" && "id" in data) {
        return data as Lp;
    }

    return null;
};

const LpDetailPage = () => {
    const { lpid } = useParams();
    const [commentOrder, setCommentOrder] = useState<"asc" | "desc">("desc");
    const commentLoadMoreRef = useRef<HTMLDivElement | null>(null);
    const { data, isLoading, isError, refetch } = useGetLpDetail(lpid);
    const {
        data: commentsData,
        isLoading: isCommentsLoading,
        isError: isCommentsError,
        refetch: refetchComments,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetLpComments(lpid, commentOrder);
    const lp = getLp(data);
    const comments: LpComment[] = commentsData?.pages.flatMap((page) => page.data.data) ?? [];

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
            <article className="mx-auto w-full max-w-4xl rounded-md bg-[#282932] px-6 py-8 text-[#f2f3f8] sm:px-10">
                <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <img
                                src={lp.author?.avatar ?? "https://ui-avatars.com/api/?name=LP&background=65d6a6&color=fff"}
                                alt=""
                                className="h-10 w-10 rounded-full object-cover"
                            />
                            <strong className="text-xl">{lp.author?.name ?? "알 수 없음"}</strong>
                        </div>
                        <h1 className="mt-8 text-3xl font-bold">{lp.title}</h1>
                    </div>
                    <div className="flex items-center gap-5 text-sm text-[#d8dbe4]">
                        <span>{formatDate(lp.createdAt)}</span>
                        <button type="button" className="text-2xl" aria-label="LP 수정">
                            ✎
                        </button>
                        <button type="button" className="text-2xl" aria-label="LP 삭제">
                            🗑
                        </button>
                    </div>
                </header>

                <div className="mx-auto mt-10 aspect-square w-full max-w-xl rounded-md bg-[#24262f] p-4 shadow-2xl">
                    <img src={lp.thumbnail} alt={lp.title} className="h-full w-full rounded-full object-cover" />
                </div>

                <p className="mx-auto mt-10 max-w-2xl whitespace-pre-line leading-7 text-[#f2f3f8]">{lp.content}</p>

                {lp.tags.length > 0 && (
                    <ul className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-3">
                        {lp.tags.map((tag) => (
                            <li key={tag.id} className="rounded-full bg-[#3b465a] px-4 py-1 text-sm">
                                # {tag.name}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="mt-10 flex justify-center">
                    <button type="button" className="flex items-center gap-2 text-3xl text-[#ff6b94]" aria-label="좋아요">
                        ♥ <span className="text-white">{lp.likes.length}</span>
                    </button>
                </div>
            </article>

            <section className="mx-auto w-full max-w-4xl rounded-md bg-[#282932] px-6 py-8 text-[#f2f3f8] sm:px-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-2xl font-bold">댓글</h2>
                    <div className="inline-flex self-start overflow-hidden rounded-md border border-white bg-[#282932] text-lg font-semibold sm:self-auto">
                        <button
                            type="button"
                            onClick={() => setCommentOrder("asc")}
                            className={`px-5 py-2 ${commentOrder === "asc" ? "bg-white text-black" : "text-white"}`}
                        >
                            오래된순
                        </button>
                        <button
                            type="button"
                            onClick={() => setCommentOrder("desc")}
                            className={`px-5 py-2 ${commentOrder === "desc" ? "bg-white text-black" : "text-white"}`}
                        >
                            최신순
                        </button>
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="댓글을 입력해주세요"
                            className="h-12 w-full rounded-md border border-[#9aa4af] bg-[#282932] px-4 text-white outline-none placeholder:text-[#9aa4af] focus:border-white"
                        />
                        <p className="mt-2 text-sm text-[#9aa4af]">댓글 작성 기능은 추후 API 연결 예정입니다.</p>
                    </div>
                    <button type="button" className="h-12 rounded-md bg-[#9aa4af] px-6 font-semibold text-white">
                        작성
                    </button>
                </div>

                <div className="mt-8">
                    {isCommentsLoading && <CommentSkeletonList count={10} />}
                    {isCommentsError && (
                        <ErrorState message="댓글을 불러오지 못했습니다." onRetry={() => void refetchComments()} />
                    )}
                    {!isCommentsLoading && !isCommentsError && (
                        <>
                            <ul className="space-y-8">
                                {comments.map((comment) => (
                                    <li key={comment.id} className="flex gap-4">
                                        <img
                                            src={comment.author.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.name)}&background=cf1b6f&color=fff`}
                                            alt=""
                                            className="h-10 w-10 shrink-0 rounded-full object-cover"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <strong className="text-xl">{comment.author.name}</strong>
                                                    <p className="mt-1 text-lg text-white">{comment.content}</p>
                                                </div>
                                                <button type="button" aria-label="댓글 메뉴" className="text-3xl leading-none text-white">
                                                    ⋮
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
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
