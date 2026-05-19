import { useInfiniteQuery } from "@tanstack/react-query";

import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { PaginationDto } from "../../types/common";
import type { ResponseLpListDto } from "../../types/lp";

function useGetLpList({ search, order, limit = 20 }: PaginationDto) {
  return useInfiniteQuery<ResponseLpListDto, Error>({
    queryKey: [QUERY_KEY.lps, search, order, limit],
    queryFn: ({ pageParam }) =>
      getLpList({
        cursor: pageParam as number | undefined,
        search,
        order,
        limit,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export default useGetLpList;
