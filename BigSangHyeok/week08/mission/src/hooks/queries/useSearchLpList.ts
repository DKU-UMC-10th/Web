import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";

type UseSearchLpListParams = {
    query: string;
    order: "asc" | "desc";
    limit?: number;
};

const useSearchLpList = ({ query, order, limit = 20 }: UseSearchLpListParams) => {
    const trimmedQuery = query.trim();

    return useInfiniteQuery({
        queryKey: ["search", trimmedQuery, order],
        queryFn: ({ pageParam }) => {
            console.log("debounce 이후 검색 API 요청", {
                search: trimmedQuery,
                cursor: pageParam,
                order,
            });

            return getLpList({
                cursor: pageParam,
                search: trimmedQuery,
                order,
                limit,
            });
        },
        enabled: trimmedQuery.length > 0,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => (lastPage.data.hasNext ? lastPage.data.nextCursor : undefined),
        staleTime: 0,
        gcTime: 1000 * 60 * 10,
        refetchOnMount: "always",
        refetchOnWindowFocus: false,
    });
};

export default useSearchLpList;
