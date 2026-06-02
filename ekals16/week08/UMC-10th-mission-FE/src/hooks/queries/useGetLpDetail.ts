import { useQuery } from "@tanstack/react-query";

import { getLpDetail } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { Lp, ResponseLpDetailDto } from "../../types/lp";

function useGetLpDetail(lpid?: string) {
  return useQuery<ResponseLpDetailDto, Error, Lp>({
    queryKey: [QUERY_KEY.lp, lpid],
    queryFn: () => getLpDetail(lpid as string),
    enabled: Boolean(lpid),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    select: (data) => data.data,
  });
}

export default useGetLpDetail;
