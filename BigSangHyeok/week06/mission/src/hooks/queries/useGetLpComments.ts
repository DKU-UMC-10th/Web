import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpComments } from "../../apis/lp";

const useGetLpComments = (lpid: string | undefined, order: "asc" | "desc") => {
    return useInfiniteQuery({
        queryKey: ["lpComments", lpid, order],
        queryFn: ({ pageParam }) =>
            getLpComments(lpid ?? "", {
                cursor: pageParam,
                limit: 10,
                order,
            }),
        enabled: Boolean(lpid),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => (lastPage.data.hasNext ? lastPage.data.nextCursor : undefined),
        staleTime: 1000 * 30,
        gcTime: 1000 * 60 * 5,
    });
};

export default useGetLpComments;
