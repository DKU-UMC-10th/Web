import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import type { PaginationDto } from "../../types/common";

function useGetLpList({ search, order, limit = 20 }: PaginationDto) {
    return useInfiniteQuery({
        queryKey: ["lps", order],
        queryFn: ({ pageParam }) =>
            getLpList({
                cursor: pageParam,
                search,
                order,
                limit,
            }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => (lastPage.data.hasNext ? lastPage.data.nextCursor : undefined),
        staleTime: 1000 * 30,
        gcTime: 1000 * 60 * 5,
    });
}

export default useGetLpList;
