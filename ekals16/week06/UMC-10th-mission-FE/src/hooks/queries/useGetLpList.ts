import { useQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import type { PaginationDto } from "../../types/common";
import type { Lp, ResponseLpListDto } from "../../types/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpList({cursor, search, order, limit }: PaginationDto) {
    return useQuery<ResponseLpListDto, Error, Lp[]>({
        queryKey: [QUERY_KEY.lps, search, order, cursor, limit],
        queryFn: () => getLpList({cursor, search, order, limit}),
        staleTime: 1000 * 60 * 5, // 5분
        gcTime: 1000 * 60 * 10, // 10분
        // enabled: Boolean(search), // search가 있을 때만 쿼리 실행
        select: (data) => data.data.data,
    });
}

export default useGetLpList;