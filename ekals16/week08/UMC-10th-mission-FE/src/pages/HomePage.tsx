import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createLp } from "../apis/lp";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import { QUERY_KEY } from "../constants/key";
import { PAGINATION_ORDER } from "../enums/common";
import type { PaginationOrder } from "../enums/common";
import useDebounce from "../hooks/useDebounce";
import useGetLpList from "../hooks/queries/useGetLpList";
import formatUploadedAt from "../utils/formatUploadedAt";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedQuery = useDebounce(search.trim(), 300);
  const [order, setOrder] = useState<PaginationOrder>(PAGINATION_ORDER.desc);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [lpImagePreview, setLpImagePreview] = useState("");

  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLpList({
    search: debouncedQuery || undefined,
    order,
    limit: 20,
  });

  const lpList = data?.pages.flatMap((page) => page.data.data) ?? [];
  const createLpMutation = useMutation({
    mutationFn: createLp,
    onSuccess: async () => {
      resetCreateForm();
      setIsCreateModalOpen(false);
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
  });

  const resetCreateForm = () => {
    setTitle("");
    setContent("");
    setTag("");
    setTags([]);
    setLpImagePreview("");
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleAddTag = () => {
    const nextTag = tag.trim();

    if (!nextTag || tags.includes(nextTag)) {
      return;
    }

    setTags((prevTags) => [...prevTags, nextTag]);
    setTag("");
  };

  const handleRemoveTag = (tagName: string) => {
    setTags((prevTags) => prevTags.filter((prevTag) => prevTag !== tagName));
  };

  const handleChangeLpImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLpImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitCreateLp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextTitle = title.trim();
    const nextContent = content.trim();

    if (!nextTitle || !nextContent) {
      return;
    }

    createLpMutation.mutate({
      title: nextTitle,
      content: nextContent,
      thumbnail: lpImagePreview || undefined,
      tags,
      published: true,
    });
  };

  if (isPending) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="relative">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-3 text-sm text-white/70">
          검색어 입력
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="LP 제목을 입력하세요"
            className="h-9 w-64 rounded border border-white/10 bg-black/60 px-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-pink-400"
          />
        </label>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setOrder(PAGINATION_ORDER.asc)}
            className={
              order === PAGINATION_ORDER.asc
                ? "rounded bg-pink-500/80 px-3 py-1.5 text-black"
                : "rounded bg-white/10 px-3 py-1.5 hover:bg-white/20"
            }
          >
            오래된순
          </button>
          <button
            type="button"
            onClick={() => setOrder(PAGINATION_ORDER.desc)}
            className={
              order === PAGINATION_ORDER.desc
                ? "rounded bg-pink-500/80 px-3 py-1.5 text-black"
                : "rounded bg-white/10 px-3 py-1.5 hover:bg-white/20"
            }
          >
            최신순
          </button>
        </div>
      </div>

      {lpList.length === 0 && !isPending && (
        <p className="mt-6 text-sm text-white/50">
          {debouncedQuery ? "검색 결과가 없습니다." : "등록된 LP가 없습니다."}
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {lpList.map((lp) => (
          <Link
            key={lp.id}
            to={`/lp/${lp.id}`}
            className="group block overflow-hidden rounded bg-white/5 ring-1 ring-white/10 transition hover:translate-y-[-2px] hover:ring-pink-400/60"
          >
            <div className="relative aspect-square overflow-hidden bg-black/60">
              {lp.thumbnail ? (
                <img
                  src={lp.thumbnail}
                  alt={lp.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-white/40">
                  No Image
                </div>
              )}
              <div className="absolute inset-0 flex flex-col justify-end bg-black/65 p-3 opacity-0 transition duration-300 group-hover:opacity-100">
                <h3 className="line-clamp-2 text-sm font-semibold text-white">
                  {lp.title}
                </h3>
                <p className="mt-1 text-xs text-white/75">
                  {formatUploadedAt(lp.createdAt)}
                </p>
                <div className="mt-2 flex items-center justify-end gap-1 text-xs font-semibold text-white">
                  <span aria-hidden="true">♥</span>
                  <span>{lp.likes?.length ?? 0}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {hasNextPage && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:text-white/40"
          >
            {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 text-2xl font-bold text-black shadow-lg shadow-pink-500/30 transition hover:scale-105"
        aria-label="LP 작성 모달 열기"
      >
        +
      </button>

      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={closeCreateModal}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              closeCreateModal();
            }
          }}
          role="presentation"
        >
          <section
            className="relative w-full max-w-sm rounded bg-zinc-900 p-5 text-white shadow-2xl ring-1 ring-white/10"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-lp-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeCreateModal}
              className="absolute right-4 top-4 rounded p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
              aria-label="LP 작성 모달 닫기"
            >
              X
            </button>

            <div className="relative mx-auto mt-4 h-44 w-72">
              {lpImagePreview && (
                <img
                  src={lpImagePreview}
                  alt="선택한 LP 사진 미리보기"
                  className="absolute left-0 top-0 z-10 h-36 w-36 rounded object-cover ring-1 ring-white/15"
                />
              )}
              <label className="absolute right-6 top-0 flex h-36 w-36 cursor-pointer items-center justify-center rounded-full bg-[conic-gradient(from_30deg,#030303,#343434,#050505,#1d1d1d,#030303)] shadow-xl ring-4 ring-black transition hover:scale-105 hover:ring-pink-500/70">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChangeLpImage}
                  className="sr-only"
                />
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xs font-semibold text-zinc-700 shadow-inner">
                  LP
                </span>
              </label>
            </div>

            <h2 id="create-lp-title" className="sr-only">
              LP 작성 모달
            </h2>

            <form className="mt-6 flex flex-col gap-3" onSubmit={handleSubmitCreateLp}>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="LP Name"
                className="h-10 rounded border border-white/15 bg-zinc-800 px-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-pink-400"
              />
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="LP Content"
                rows={3}
                className="resize-none rounded border border-white/15 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-pink-400"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(event) => setTag(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="LP Tag"
                  className="h-10 min-w-0 flex-1 rounded border border-white/15 bg-zinc-800 px-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-pink-400"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="h-10 rounded bg-pink-500 px-4 text-sm font-semibold text-white transition hover:bg-pink-400"
                >
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1 rounded bg-zinc-800 px-2 py-1 text-xs text-white/80 ring-1 ring-white/10"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(item)}
                        className="rounded px-1 font-bold text-white/60 transition hover:bg-white/10 hover:text-pink-400"
                        aria-label={`${item} 태그 제거`}
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {createLpMutation.isError && (
                <p className="text-xs text-red-400">
                  LP 생성에 실패했습니다. 입력값을 확인해주세요.
                </p>
              )}
              <button
                type="submit"
                disabled={
                  createLpMutation.isPending || !title.trim() || !content.trim()
                }
                className="mt-2 h-10 rounded bg-pink-600 text-sm font-semibold text-white transition hover:bg-pink-500 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
              >
                {createLpMutation.isPending ? "Adding..." : "Add LP"}
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default HomePage;
