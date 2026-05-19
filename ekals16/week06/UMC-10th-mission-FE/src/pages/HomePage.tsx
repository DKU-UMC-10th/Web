import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import ErrorState from "../components/ErrorState";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../enums/common.ts";
import type { PaginationOrder } from "../enums/common.ts";
import formatUploadedAt from "../utils/formatUploadedAt";

const LP_CARD_SKELETON_COUNT = 10;
const LP_NEXT_PAGE_SKELETON_COUNT = 5;

const LpCardSkeleton = () => {
  return (
    <div className="aspect-square overflow-hidden rounded bg-slate-400/80 ring-1 ring-white/10">
      <div className="h-full w-full animate-pulse bg-gradient-to-r from-slate-500/40 via-slate-300/60 to-slate-500/40 bg-[length:200%_100%]" />
    </div>
  );
};

const HomePage = () => {

  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<PaginationOrder>(PAGINATION_ORDER.desc);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLpList({
    search: search.trim() ? search : undefined,
    order,
  });
  const lps = useMemo(
    () => data?.pages.flatMap((page) => page.data.data) ?? [],
    [data],
  );

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "160px" },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {isLoading &&
          Array.from({ length: LP_CARD_SKELETON_COUNT }).map((_, index) => (
            <LpCardSkeleton key={`initial-skeleton-${index}`} />
          ))}

        {lps.map((lp) => (
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

        {isFetchingNextPage &&
          Array.from({ length: LP_NEXT_PAGE_SKELETON_COUNT }).map((_, index) => (
            <LpCardSkeleton key={`next-page-skeleton-${index}`} />
          ))}
      </div>

      <div ref={loadMoreRef} className="flex h-20 items-center justify-center">
        {!hasNextPage && lps.length > 0 && (
          <p className="text-xs text-white/40">No more LPs.</p>
        )}
      </div>

      <Link
        to="/lp/new"
        className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 text-2xl font-bold text-black shadow-lg shadow-pink-500/30 transition hover:scale-105"
      >
        +
      </Link>
    </div>
  )
}

export default HomePage
