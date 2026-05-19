import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ErrorState, LpCardSkeletonGrid } from "../components/QueryState";
import useThrottle from "../hooks/useThrottle";
import useGetLpList from "../hooks/queries/useGetLpList";
import type { Lp } from "../types/lp";

const formatDate = (value: string) => {
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

const HomePage = () => {
    const [sort, setSort] = useState<"asc" | "desc">("desc");
    const [scrollY, setScrollY] = useState(0);
    const throttledScrollY = useThrottle(scrollY, 500);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const {
        data,
        isLoading,
        isError,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetLpList({ order: sort, limit: 20 });
    const lps: Lp[] = data?.pages.flatMap((page) => page.data.data) ?? [];
    const showInitialSkeleton = isLoading;
    const showBottomSkeleton = isFetchingNextPage && !isLoading;

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

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        console.log("throttled scroll event", {
            scrollY: Math.round(throttledScrollY),
            checkedAt: new Date().toLocaleTimeString(),
        });
    }, [throttledScrollY]);

    return (
        <section className="min-h-[calc(100dvh-5rem)] border-t border-[#1f2a3d] bg-black px-4 py-10 sm:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex justify-end">
                    <div className="inline-flex overflow-hidden rounded-md border border-white bg-black text-lg font-semibold">
                        <button
                            type="button"
                            onClick={() => setSort("asc")}
                            className={`px-5 py-2 ${sort === "asc" ? "bg-white text-black" : "text-white"}`}
                        >
                            오래된순
                        </button>
                        <button
                            type="button"
                            onClick={() => setSort("desc")}
                            className={`px-5 py-2 ${sort === "desc" ? "bg-white text-black" : "text-white"}`}
                        >
                            최신순
                        </button>
                    </div>
                </div>

                {showInitialSkeleton && <LpCardSkeletonGrid count={20} />}
                {isError && <ErrorState message="LP 목록을 불러오지 못했습니다." onRetry={() => void refetch()} />}
                {!isLoading && !isError && (
                    <>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {lps.map((lp) => (
                                <Link key={lp.id} to={`/lp/${lp.id}`} className="group relative aspect-square overflow-hidden bg-[#151515]">
                                    <img
                                        src={lp.thumbnail}
                                        alt={lp.title}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 flex flex-col justify-end bg-black/65 p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                        <strong className="line-clamp-2 text-2xl font-bold text-white">{lp.title}</strong>
                                        <div className="mt-2 flex items-center justify-between text-lg font-semibold text-white">
                                            <span>{formatDate(lp.createdAt)}</span>
                                            <span>♥ {lp.likes.length}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {showBottomSkeleton && (
                            <div className="mt-2">
                                <LpCardSkeletonGrid count={10} />
                            </div>
                        )}
                        <div ref={loadMoreRef} className="h-10" />
                    </>
                )}
            </div>
        </section>
    );
};

export default HomePage;
