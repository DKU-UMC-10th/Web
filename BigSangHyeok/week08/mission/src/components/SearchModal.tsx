import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ErrorState, LpCardSkeletonGrid } from "./QueryState";
import useDebounce from "../hooks/useDebounce";
import useSearchLpList from "../hooks/queries/useSearchLpList";
import type { Lp } from "../types/lp";

type SearchModalProps = {
    onClose: () => void;
};

const SearchIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
        <path d="M10.5 18a7.5 7.5 0 1 1 5.3-2.2L21 21" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
);

const SearchModal = ({ onClose }: SearchModalProps) => {
    const [query, setQuery] = useState("");
    const [recentKeywords, setRecentKeywords] = useState<string[]>([]);
    const debouncedQuery = useDebounce(query, 300);
    const trimmedDebouncedQuery = debouncedQuery.trim();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const {
        data,
        isLoading,
        isError,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useSearchLpList({ query: trimmedDebouncedQuery, order: "desc", limit: 20 });
    const lps: Lp[] = data?.pages.flatMap((page) => page.data.data) ?? [];

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        const target = loadMoreRef.current;

        if (!target) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                    void fetchNextPage();
                }
            },
            { rootMargin: "320px" },
        );

        observer.observe(target);

        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextKeyword = query.trim();

        if (!nextKeyword) {
            return;
        }

        setRecentKeywords((prev) => [nextKeyword, ...prev.filter((keyword) => keyword !== nextKeyword)].slice(0, 5));
    };

    return (
        <section className="fixed bottom-0 left-0 right-0 top-20 z-[45] overflow-y-auto bg-[#111111] px-6 py-14 text-white lg:left-60">
            <div className="mx-auto max-w-6xl">
                <div className="mb-10 flex items-center justify-between">
                    <button type="button" onClick={onClose} aria-label="검색 닫기" className="text-3xl leading-none hover:text-[#ff2ea3]">
                        ×
                    </button>
                    <div className="text-sm font-semibold text-white/90" />
                </div>

                <div className="mx-auto max-w-3xl">
                    <form onSubmit={handleSubmit} className="flex items-center gap-3">
                        <label className="flex h-12 min-w-0 flex-1 items-center gap-3 border-b-2 border-[#7d7d7d] text-white focus-within:border-white">
                            <SearchIcon />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="검색어를 입력해주세요"
                                className="h-full min-w-0 flex-1 bg-transparent text-2xl font-bold outline-none placeholder:text-[#777]"
                            />
                        </label>
                        <select className="h-12 rounded-md border border-white/70 bg-[#111111] px-4 text-lg font-semibold outline-none">
                            <option>제목</option>
                        </select>
                    </form>

                    <div className="mt-6 flex items-center gap-3 text-lg font-semibold">
                        <span>최근 검색어</span>
                        <button type="button" onClick={() => setRecentKeywords([])} className="text-sm text-[#777] hover:text-white">
                            모두 지우기
                        </button>
                    </div>
                    {recentKeywords.length > 0 && (
                        <ul className="mt-3 flex flex-wrap gap-2">
                            {recentKeywords.map((keyword) => (
                                <li key={keyword}>
                                    <button type="button" onClick={() => setQuery(keyword)} className="rounded-full bg-[#2f3a4d] px-4 py-1 text-sm font-semibold">
                                        {keyword}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="mt-56">
                    {trimmedDebouncedQuery && isLoading && <LpCardSkeletonGrid count={10} />}
                    {trimmedDebouncedQuery && isError && <ErrorState message="검색 결과를 불러오지 못했습니다." onRetry={() => void refetch()} />}
                    {trimmedDebouncedQuery && !isLoading && !isError && lps.length === 0 && (
                        <p className="py-20 text-center text-xl font-semibold text-[#9ea3b1]">검색 결과가 없습니다.</p>
                    )}
                    {lps.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {lps.map((lp) => (
                                <Link key={lp.id} to={`/lp/${lp.id}`} onClick={onClose} className="aspect-square overflow-hidden bg-[#151515]">
                                    <img src={lp.thumbnail} alt={lp.title} className="h-full w-full object-cover" />
                                </Link>
                            ))}
                        </div>
                    )}
                    {isFetchingNextPage && (
                        <div className="mt-2">
                            <LpCardSkeletonGrid count={10} />
                        </div>
                    )}
                    <div ref={loadMoreRef} className="h-10" />
                </div>
            </div>
        </section>
    );
};

export default SearchModal;
