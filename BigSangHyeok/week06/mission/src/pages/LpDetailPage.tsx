import { useParams } from "react-router-dom";
import { ErrorState, LoadingPanel } from "../components/QueryState";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import type { Lp } from "../types/lp";

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
    const { data, isLoading, isError, refetch } = useGetLpDetail(lpid);
    const lp = getLp(data);

    if (isLoading) {
        return (
            <section className="px-4 py-10">
                <LoadingPanel />
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
        <section className="px-4 py-10">
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
        </section>
    );
};

export default LpDetailPage;
