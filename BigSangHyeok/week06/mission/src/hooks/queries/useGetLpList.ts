import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";

function useGetLpList({cursor, search, order, limit}:PaginationDto) {
    return useQuery({
        queryKey:["lps", order],
        queryFn:() => 
            getLpList({
                cursor, search, order, limit,
            }),
        staleTime: 1000 * 30,
        gcTime: 1000 * 60 * 5,
    });
}

export default useGetLpList;
