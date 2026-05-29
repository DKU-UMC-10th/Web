import { useQuery } from "@tanstack/react-query";

import { getCommentList } from "../../apis/comment";
import { QUERY_KEY } from "../../constants/key";
import type { PaginationOrder } from "../../enums/common";
import type { LpComment, ResponseCommentListDto } from "../../types/comment";

function useGetCommentList({
  lpId,
  order,
}: {
  lpId?: string;
  order?: PaginationOrder;
}) {
  return useQuery<ResponseCommentListDto, Error, LpComment[]>({
    queryKey: [QUERY_KEY.comments, lpId, order],
    queryFn: () => getCommentList({ lpId: lpId as string, order }),
    enabled: Boolean(lpId),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    select: (data) => data.data.data,
  });
}

export default useGetCommentList;
