import { useInfiniteQuery } from "@tanstack/react-query";

import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { PaginationDto } from "../../types/common";
import type { ResponseLpListDto } from "../../types/lp";

type UseGetLpListParams = PaginationDto & {
  enabled?: boolean;
};

function useGetLpList({
  search,
  order,
  limit = 20,
  enabled = true,
}: UseGetLpListParams) {
  return useInfiniteQuery<ResponseLpListDto, Error>({
    queryKey: [QUERY_KEY.lps, "search", search, order, limit],
    queryFn: ({ pageParam }) =>
      getLpList({
        cursor: typeof pageParam === "number" ? pageParam : undefined,
        search,
        order,
        limit,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
    enabled,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
}

export default useGetLpList;
