import { useInfiniteQuery } from "@tanstack/react-query";

import { getLpComments } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { PaginationDto } from "../../types/common";
import type { ResponseLpCommentsDto } from "../../types/comment";

type UseGetLpCommentsParams = PaginationDto & {
  lpid?: string;
};

function useGetLpComments({
  lpid,
  order,
  limit = 10,
}: UseGetLpCommentsParams) {
  return useInfiniteQuery<ResponseLpCommentsDto, Error>({
    queryKey: [QUERY_KEY.lpComments, lpid, order, limit],
    queryFn: ({ pageParam }) =>
      getLpComments(lpid as string, {
        cursor: pageParam as number | undefined,
        order,
        limit,
      }),
    enabled: Boolean(lpid),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
}

export default useGetLpComments;
