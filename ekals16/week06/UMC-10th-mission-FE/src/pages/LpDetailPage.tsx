import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import { PAGINATION_ORDER } from "../enums/common";
import type { PaginationOrder } from "../enums/common";
import useGetLpComments from "../hooks/queries/useGetLpComments";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import formatUploadedAt from "../utils/formatUploadedAt";

const COMMENT_INITIAL_SKELETON_COUNT = 8;
const COMMENT_NEXT_PAGE_SKELETON_COUNT = 4;

const CommentSkeleton = () => {
  return (
    <div className="flex gap-3">
      <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-slate-400/80" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-24 animate-pulse rounded bg-slate-400/80" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-400/70" />
      </div>
    </div>
  );
};

const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const { data: lp, isPending, isError, refetch } = useGetLpDetail(lpid);
  const [commentOrder, setCommentOrder] = useState<PaginationOrder>(
    PAGINATION_ORDER.desc,
  );
  const [commentContent, setCommentContent] = useState("");
  const commentLoadMoreRef = useRef<HTMLDivElement | null>(null);
  const {
    data: commentData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    refetch: refetchComments,
    fetchNextPage: fetchNextCommentsPage,
    hasNextPage: hasNextCommentsPage,
    isFetchingNextPage: isFetchingNextCommentsPage,
  } = useGetLpComments({
    lpid,
    order: commentOrder,
  });
  const comments = useMemo(
    () => commentData?.pages.flatMap((page) => page.data.data) ?? [],
    [commentData],
  );
  const isCommentSubmitDisabled = commentContent.trim().length === 0;

  useEffect(() => {
    const target = commentLoadMoreRef.current;

    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          hasNextCommentsPage &&
          !isFetchingNextCommentsPage
        ) {
          fetchNextCommentsPage();
        }
      },
      { rootMargin: "160px" },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [
    fetchNextCommentsPage,
    hasNextCommentsPage,
    isFetchingNextCommentsPage,
  ]);

  if (isPending) {
    return <LoadingState />;
  }

  if (isError || !lp) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const authorName = lp.author?.name ?? `User ${lp.authorId}`;
  const authorAvatar = lp.author?.avatar;
  const uploadedAt = formatUploadedAt(lp.createdAt);
  const likeCount = lp.likes?.length ?? 0;

  return (
    <section className="mx-auto max-w-4xl rounded bg-zinc-900 px-5 py-6 text-white ring-1 ring-white/10 sm:px-10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {authorAvatar ? (
            <img
              src={authorAvatar}
              alt={authorName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-200 text-sm font-bold text-zinc-900">
              {authorName.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold">{authorName}</p>
            <p className="text-xs text-white/50">{uploadedAt}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Edit LP"
            className="rounded p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            ✎
          </button>
          <button
            type="button"
            aria-label="Delete LP"
            className="rounded p-2 text-white/70 transition hover:bg-white/10 hover:text-red-300"
          >
            🗑
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-300">
              Title
            </p>
            <h1 className="mt-2 text-2xl font-bold text-white">{lp.title}</h1>
          </div>
          <Link
            to="/"
            className="rounded bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
          >
            Back
          </Link>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="relative aspect-square w-full max-w-sm rounded bg-zinc-800 p-5 shadow-xl shadow-black/40">
            <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-black bg-black">
              {lp.thumbnail ? (
                <img
                  src={lp.thumbnail}
                  alt={lp.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-white/40">
                  No Image
                </div>
              )}
              <div className="absolute inset-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/30 bg-white shadow-inner" />
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-300">
            Content
          </p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/80">
            {lp.content || "No content."}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {lp.tags?.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full bg-slate-600 px-3 py-1 text-xs font-semibold text-white/90"
            >
              # {tag.name}
            </span>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="flex items-center gap-2 rounded-full px-4 py-2 text-lg font-semibold text-white transition hover:bg-white/10"
          >
            <span className="text-3xl text-pink-400">♥</span>
            <span>{likeCount}</span>
          </button>
        </div>
      </div>

      <div className="mt-10 border-t border-white/10 pt-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-white">댓글</h2>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setCommentOrder(PAGINATION_ORDER.asc)}
              className={
                commentOrder === PAGINATION_ORDER.asc
                  ? "rounded bg-white px-3 py-1.5 font-semibold text-black"
                  : "rounded border border-white/30 px-3 py-1.5 text-white transition hover:bg-white/10"
              }
            >
              오래된순
            </button>
            <button
              type="button"
              onClick={() => setCommentOrder(PAGINATION_ORDER.desc)}
              className={
                commentOrder === PAGINATION_ORDER.desc
                  ? "rounded bg-white px-3 py-1.5 font-semibold text-black"
                  : "rounded border border-white/30 px-3 py-1.5 text-white transition hover:bg-white/10"
              }
            >
              최신순
            </button>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={commentContent}
            onChange={(event) => setCommentContent(event.target.value)}
            placeholder="댓글을 입력해주세요."
            className="h-10 flex-1 rounded border border-white/20 bg-zinc-800 px-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-pink-400"
          />
          <button
            type="button"
            disabled={isCommentSubmitDisabled}
            className={
              isCommentSubmitDisabled
                ? "h-10 rounded bg-slate-500 px-4 text-sm font-semibold text-white/70"
                : "h-10 rounded bg-pink-500 px-4 text-sm font-semibold text-white transition hover:bg-pink-400"
            }
          >
            작성
          </button>
        </div>
        <p className="mt-2 text-xs text-white/45">
          댓글 작성 기능은 UI만 제공되며, 내용을 입력하면 작성 버튼이 활성화됩니다.
        </p>

        <div className="mt-6 flex flex-col gap-5">
          {isCommentsLoading &&
            Array.from({ length: COMMENT_INITIAL_SKELETON_COUNT }).map((_, index) => (
              <CommentSkeleton key={`comment-skeleton-${index}`} />
            ))}

          {isCommentsError && (
            <div className="flex items-center justify-between rounded bg-red-500/10 px-4 py-3 text-sm text-red-200">
              <span>댓글을 불러오지 못했습니다.</span>
              <button
                type="button"
                onClick={() => refetchComments()}
                className="rounded bg-red-400 px-3 py-1 text-xs font-semibold text-black"
              >
                Retry
              </button>
            </div>
          )}

          {comments.map((comment) => {
            const commentAuthorName =
              comment.author?.name ?? `User ${comment.authorId}`;
            const commentAuthorAvatar = comment.author?.avatar;

            return (
              <article key={comment.id} className="flex gap-3">
                {commentAuthorAvatar ? (
                  <img
                    src={commentAuthorAvatar}
                    alt={commentAuthorName}
                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-500 text-xs font-bold text-white">
                    {commentAuthorName.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-white">
                      {commentAuthorName}
                    </p>
                    <span className="text-xs text-white/40">
                      {formatUploadedAt(comment.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-white/80">
                    {comment.content}
                  </p>
                </div>
              </article>
            );
          })}

          {isFetchingNextCommentsPage &&
            Array.from({ length: COMMENT_NEXT_PAGE_SKELETON_COUNT }).map((_, index) => (
              <CommentSkeleton key={`next-comment-skeleton-${index}`} />
            ))}
        </div>

        <div
          ref={commentLoadMoreRef}
          className="flex h-16 items-center justify-center"
        >
          {!hasNextCommentsPage && comments.length > 0 && (
            <p className="text-xs text-white/40">더 이상 댓글이 없습니다.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default LpDetailPage;
