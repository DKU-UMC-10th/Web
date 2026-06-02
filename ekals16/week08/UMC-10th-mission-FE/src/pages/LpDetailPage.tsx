import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getMyInfo } from "../apis/auth";
import { createComment, deleteComment, updateComment } from "../apis/comment";
import { deleteLp, likeLp, unlikeLp, updateLp } from "../apis/lp";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import { QUERY_KEY } from "../constants/key";
import { PAGINATION_ORDER } from "../enums/common";
import type { PaginationOrder } from "../enums/common";
import useGetCommentList from "../hooks/queries/useGetCommentList";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import type { LpComment } from "../types/comment";
import type { ResponseLpDetailDto } from "../types/lp";
import formatUploadedAt from "../utils/formatUploadedAt";

const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [commentOrder, setCommentOrder] = useState<PaginationOrder>(
    PAGINATION_ORDER.desc,
  );
  const [commentContent, setCommentContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [openedMenuCommentId, setOpenedMenuCommentId] = useState<number | null>(
    null,
  );
  const [isEditingLp, setIsEditingLp] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editThumbnail, setEditThumbnail] = useState("");
  const [editTag, setEditTag] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);

  const { data: lp, isPending, isError, refetch } = useGetLpDetail(lpid);
  const {
    data: comments,
    isPending: isCommentPending,
    isError: isCommentError,
  } = useGetCommentList({
    lpId: lpid,
    order: commentOrder,
  });
  const { data: myInfo } = useQuery({
    queryKey: ["me"],
    queryFn: getMyInfo,
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (!lp) {
      return;
    }

    setEditTitle(lp.title);
    setEditContent(lp.content ?? "");
    setEditThumbnail(lp.thumbnail ?? "");
    setEditTags(lp.tags?.map((tag) => tag.name) ?? []);
  }, [lp]);

  const invalidateLpDetail = async () => {
    await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lp, lpid] });
    await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
  };

  const invalidateCommentList = async () => {
    await queryClient.invalidateQueries({
      queryKey: [QUERY_KEY.comments, lpid],
    });
  };

  const updateLpMutation = useMutation({
    mutationFn: updateLp,
    onSuccess: async () => {
      setIsEditingLp(false);
      setEditTag("");
      await invalidateLpDetail();
    },
  });

  const deleteLpMutation = useMutation({
    mutationFn: deleteLp,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
      navigate("/", { replace: true });
    },
  });

  const likeLpMutation = useMutation({
    mutationFn: likeLp,
    onMutate: async (nextLpId) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.lp, nextLpId] });
      const previousLpDetail = queryClient.getQueryData<ResponseLpDetailDto>([
        QUERY_KEY.lp,
        nextLpId,
      ]);

      if (previousLpDetail && myId) {
        queryClient.setQueryData<ResponseLpDetailDto>(
          [QUERY_KEY.lp, nextLpId],
          {
            ...previousLpDetail,
            data: {
              ...previousLpDetail.data,
              likes: previousLpDetail.data.likes.some(
                (like) => like.userId === myId,
              )
                ? previousLpDetail.data.likes
                : [
                    ...previousLpDetail.data.likes,
                    {
                      id: Date.now(),
                      userId: myId,
                      lpId: Number(nextLpId),
                    },
                  ],
            },
          },
        );
      }

      return { previousLpDetail };
    },
    onError: (_error, nextLpId, context) => {
      if (context?.previousLpDetail) {
        queryClient.setQueryData(
          [QUERY_KEY.lp, nextLpId],
          context.previousLpDetail,
        );
      }
    },
    onSettled: invalidateLpDetail,
  });

  const unlikeLpMutation = useMutation({
    mutationFn: unlikeLp,
    onMutate: async (nextLpId) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.lp, nextLpId] });
      const previousLpDetail = queryClient.getQueryData<ResponseLpDetailDto>([
        QUERY_KEY.lp,
        nextLpId,
      ]);

      if (previousLpDetail && myId) {
        queryClient.setQueryData<ResponseLpDetailDto>(
          [QUERY_KEY.lp, nextLpId],
          {
            ...previousLpDetail,
            data: {
              ...previousLpDetail.data,
              likes: previousLpDetail.data.likes.filter(
                (like) => like.userId !== myId,
              ),
            },
          },
        );
      }

      return { previousLpDetail };
    },
    onError: (_error, nextLpId, context) => {
      if (context?.previousLpDetail) {
        queryClient.setQueryData(
          [QUERY_KEY.lp, nextLpId],
          context.previousLpDetail,
        );
      }
    },
    onSettled: invalidateLpDetail,
  });

  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: async () => {
      setCommentContent("");
      await invalidateCommentList();
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: async () => {
      setEditingCommentId(null);
      setEditingContent("");
      await invalidateCommentList();
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async () => {
      setOpenedMenuCommentId(null);
      await invalidateCommentList();
    },
  });

  const handleChangeEditThumbnail = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setEditThumbnail(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddEditTag = () => {
    const nextTag = editTag.trim();

    if (!nextTag || editTags.includes(nextTag)) {
      return;
    }

    setEditTags((prevTags) => [...prevTags, nextTag]);
    setEditTag("");
  };

  const handleCancelLpEdit = () => {
    if (!lp) {
      return;
    }

    setIsEditingLp(false);
    setEditTitle(lp.title);
    setEditContent(lp.content ?? "");
    setEditThumbnail(lp.thumbnail ?? "");
    setEditTag("");
    setEditTags(lp.tags?.map((tag) => tag.name) ?? []);
  };

  const handleSubmitLpEdit = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!lpid || !editTitle.trim()) {
      return;
    }

    updateLpMutation.mutate({
      lpid,
      updateLpDto: {
        title: editTitle.trim(),
        content: editContent.trim(),
        thumbnail: editThumbnail || undefined,
        tags: editTags,
        published: lp?.published ?? true,
      },
    });
  };

  const handleDeleteLp = () => {
    if (!lpid || !window.confirm("정말 이 LP를 삭제하시겠습니까?")) {
      return;
    }

    deleteLpMutation.mutate(lpid);
  };

  const handleSubmitComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextContent = commentContent.trim();

    if (!lpid || !nextContent) {
      return;
    }

    createCommentMutation.mutate({
      lpId: lpid,
      content: nextContent,
    });
  };

  const handleStartCommentEdit = (comment: LpComment) => {
    setOpenedMenuCommentId(null);
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleSubmitCommentEdit = (commentId: number) => {
    const nextContent = editingContent.trim();

    if (!lpid || !nextContent) {
      return;
    }

    updateCommentMutation.mutate({
      lpId: lpid,
      commentId,
      content: nextContent,
    });
  };

  const handleDeleteComment = (commentId: number) => {
    if (!lpid) {
      return;
    }

    deleteCommentMutation.mutate({
      lpId: lpid,
      commentId,
    });
  };

  if (isPending) {
    return <LoadingState />;
  }

  if (isError || !lp) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const authorName = lp.author?.name ?? `User ${lp.authorId}`;
  const authorAvatar = lp.author?.avatar;
  const uploadedAt = formatUploadedAt(lp.createdAt);
  const myId = myInfo?.data.id;
  const likeCount = lp.likes?.length ?? 0;
  const isMineLp = lp.authorId === myId || lp.author?.id === myId;
  const isLikedByMe = Boolean(
    myId && lp.likes?.some((like) => like.userId === myId),
  );

  const handleToggleLike = () => {
    if (!lpid || likeLpMutation.isPending || unlikeLpMutation.isPending) {
      return;
    }

    if (isLikedByMe) {
      unlikeLpMutation.mutate(lpid);
      return;
    }

    likeLpMutation.mutate(lpid);
  };

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
          {isMineLp && isEditingLp && (
            <label className="cursor-pointer rounded p-2 text-white/70 transition hover:bg-white/10 hover:text-white">
              <input
                type="file"
                accept="image/*"
                onChange={handleChangeEditThumbnail}
                className="sr-only"
              />
              <span aria-hidden="true">▣</span>
              <span className="sr-only">LP 이미지 수정</span>
            </label>
          )}
          {isMineLp && (
            <>
              {isEditingLp ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleSubmitLpEdit()}
                    disabled={updateLpMutation.isPending || !editTitle.trim()}
                    aria-label="LP 수정 저장"
                    className="rounded p-2 text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:text-white/30"
                  >
                    ✓
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelLpEdit}
                    aria-label="LP 수정 취소"
                    className="rounded p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    X
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingLp(true)}
                  aria-label="LP 수정"
                  className="rounded p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  수정
                </button>
              )}
              <button
                type="button"
                onClick={handleDeleteLp}
                disabled={deleteLpMutation.isPending}
                aria-label="LP 삭제"
                className="rounded p-2 text-white/70 transition hover:bg-white/10 hover:text-red-300 disabled:cursor-not-allowed disabled:text-white/30"
              >
                삭제
              </button>
            </>
          )}
          <Link
            to="/"
            className="rounded bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
          >
            Back
          </Link>
        </div>
      </div>

      <form className="mt-8" onSubmit={handleSubmitLpEdit}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-300">
            Title
          </p>
          {isEditingLp ? (
            <input
              value={editTitle}
              onChange={(event) => setEditTitle(event.target.value)}
              placeholder="LP 제목"
              className="mt-2 h-10 w-full rounded border border-white/30 bg-zinc-950 px-3 text-xl font-bold text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-pink-400"
            />
          ) : (
            <h1 className="mt-2 text-2xl font-bold text-white">{lp.title}</h1>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <label
            className={
              isEditingLp
                ? "relative aspect-square w-full max-w-sm cursor-pointer rounded bg-zinc-800 p-5 shadow-xl shadow-black/40 transition hover:ring-2 hover:ring-pink-400/70"
                : "relative aspect-square w-full max-w-sm rounded bg-zinc-800 p-5 shadow-xl shadow-black/40"
            }
          >
            {isEditingLp && (
              <input
                type="file"
                accept="image/*"
                onChange={handleChangeEditThumbnail}
                className="sr-only"
              />
            )}
            <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-black bg-black">
              {(isEditingLp ? editThumbnail : lp.thumbnail) ? (
                <img
                  src={isEditingLp ? editThumbnail : lp.thumbnail}
                  alt={isEditingLp ? "수정할 LP 이미지 미리보기" : lp.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-white/40">
                  No Image
                </div>
              )}
              <div className="absolute inset-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/30 bg-white shadow-inner" />
              {isEditingLp && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-semibold text-white opacity-0 transition hover:opacity-100">
                  이미지 변경
                </div>
              )}
            </div>
          </label>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-300">
            Content
          </p>
          {isEditingLp ? (
            <textarea
              value={editContent}
              onChange={(event) => setEditContent(event.target.value)}
              placeholder="LP 내용"
              rows={4}
              className="mt-3 w-full resize-none rounded border border-white/20 bg-zinc-950 px-4 py-3 text-sm leading-6 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-pink-400"
            />
          ) : (
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/80">
              {lp.content || "No content."}
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {isEditingLp
            ? editTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded bg-zinc-800 px-2 py-1 text-xs text-white/80 ring-1 ring-white/10"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() =>
                      setEditTags((prevTags) =>
                        prevTags.filter((prevTag) => prevTag !== tag),
                      )
                    }
                    className="rounded px-1 font-bold text-white/60 transition hover:bg-white/10 hover:text-pink-400"
                    aria-label={`${tag} 태그 삭제`}
                  >
                    x
                  </button>
                </span>
              ))
            : lp.tags?.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-slate-600 px-3 py-1 text-xs font-semibold text-white/90"
                >
                  # {tag.name}
                </span>
              ))}
        </div>

        {isEditingLp && (
          <div className="mt-3 flex gap-2">
            <input
              value={editTag}
              onChange={(event) => setEditTag(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleAddEditTag();
                }
              }}
              placeholder="LP Tag"
              className="h-10 min-w-0 flex-1 rounded border border-white/20 bg-zinc-950 px-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-pink-400"
            />
            <button
              type="button"
              onClick={handleAddEditTag}
              className="h-10 rounded bg-pink-500 px-4 text-sm font-semibold text-white transition hover:bg-pink-400"
            >
              Add
            </button>
          </div>
        )}

        {updateLpMutation.isError && (
          <p className="mt-3 text-xs text-red-400">LP 수정에 실패했습니다.</p>
        )}
      </form>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={handleToggleLike}
          disabled={likeLpMutation.isPending || unlikeLpMutation.isPending}
          className={
            isLikedByMe
              ? "flex items-center gap-2 rounded-full bg-pink-500/20 px-4 py-2 text-lg font-semibold text-pink-300 transition hover:bg-pink-500/30 disabled:cursor-not-allowed"
              : "flex items-center gap-2 rounded-full px-4 py-2 text-lg font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed"
          }
        >
          <span className="text-3xl">♥</span>
          <span>{likeCount}</span>
        </button>
      </div>

      <div className="mt-10 rounded bg-zinc-800 p-4 ring-1 ring-white/10">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-white">댓글</h2>
          <div className="flex rounded border border-white/30 text-xs">
            <button
              type="button"
              onClick={() => setCommentOrder(PAGINATION_ORDER.asc)}
              className={
                commentOrder === PAGINATION_ORDER.asc
                  ? "bg-white px-3 py-1.5 font-semibold text-zinc-900"
                  : "px-3 py-1.5 text-white/80 hover:bg-white/10"
              }
            >
              오래된순
            </button>
            <button
              type="button"
              onClick={() => setCommentOrder(PAGINATION_ORDER.desc)}
              className={
                commentOrder === PAGINATION_ORDER.desc
                  ? "bg-white px-3 py-1.5 font-semibold text-zinc-900"
                  : "px-3 py-1.5 text-white/80 hover:bg-white/10"
              }
            >
              최신순
            </button>
          </div>
        </div>

        <form className="mt-4 flex gap-2" onSubmit={handleSubmitComment}>
          <input
            value={commentContent}
            onChange={(event) => setCommentContent(event.target.value)}
            placeholder="댓글을 입력해주세요"
            className="h-10 min-w-0 flex-1 rounded border border-white/20 bg-zinc-900 px-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-pink-400"
          />
          <button
            type="submit"
            disabled={createCommentMutation.isPending || !commentContent.trim()}
            className="h-10 rounded bg-slate-400 px-4 text-sm font-semibold text-white transition hover:bg-pink-500 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
          >
            작성
          </button>
        </form>

        {createCommentMutation.isError && (
          <p className="mt-2 text-xs text-red-400">
            댓글 작성에 실패했습니다.
          </p>
        )}

        <div className="mt-5 space-y-4">
          {isCommentPending && (
            <p className="text-sm text-white/50">댓글을 불러오는 중입니다.</p>
          )}
          {isCommentError && (
            <p className="text-sm text-red-400">
              댓글 목록을 불러오지 못했습니다.
            </p>
          )}
          {!isCommentPending && !isCommentError && comments?.length === 0 && (
            <p className="text-sm text-white/50">아직 댓글이 없습니다.</p>
          )}
          {comments?.map((comment) => {
            const commentAuthorName =
              comment.author?.name ?? `User ${comment.authorId}`;
            const isMineComment =
              comment.authorId === myId || comment.author?.id === myId;
            const isEditingComment = editingCommentId === comment.id;

            return (
              <div
                key={comment.id}
                className="relative flex gap-3 rounded bg-zinc-800/60 py-2 pr-10"
              >
                {comment.author?.avatar ? (
                  <img
                    src={comment.author.avatar}
                    alt={commentAuthorName}
                    className="mt-1 h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-zinc-700">
                    {commentAuthorName.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">
                    {commentAuthorName}
                  </p>
                  {isEditingComment ? (
                    <div className="mt-1 flex gap-2">
                      <input
                        value={editingContent}
                        onChange={(event) =>
                          setEditingContent(event.target.value)
                        }
                        className="h-9 min-w-0 flex-1 rounded border border-white/30 bg-zinc-900 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-pink-400"
                      />
                      <button
                        type="button"
                        onClick={() => handleSubmitCommentEdit(comment.id)}
                        disabled={
                          updateCommentMutation.isPending ||
                          !editingContent.trim()
                        }
                        className="rounded px-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:text-white/30"
                        aria-label="댓글 수정 완료"
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <p className="mt-1 whitespace-pre-wrap text-sm text-white/80">
                      {comment.content}
                    </p>
                  )}
                </div>

                {isMineComment && !isEditingComment && (
                  <div className="absolute right-1 top-2">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenedMenuCommentId((prevId) =>
                          prevId === comment.id ? null : comment.id,
                        )
                      }
                      className="rounded px-2 py-1 text-lg leading-none text-white/70 hover:bg-white/10 hover:text-white"
                      aria-label="댓글 메뉴 열기"
                    >
                      ...
                    </button>
                    {openedMenuCommentId === comment.id && (
                      <div className="absolute right-0 top-8 z-10 flex min-w-24 overflow-hidden rounded bg-black text-xs shadow-lg ring-1 ring-white/10">
                        <button
                          type="button"
                          onClick={() => handleStartCommentEdit(comment)}
                          className="whitespace-nowrap px-3 py-2 text-white hover:bg-white/10"
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={deleteCommentMutation.isPending}
                          className="whitespace-nowrap px-3 py-2 text-red-300 hover:bg-white/10 disabled:text-white/30"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LpDetailPage;
