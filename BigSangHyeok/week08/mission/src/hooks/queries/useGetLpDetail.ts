import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";

const useGetLpDetail = (lpid: string | undefined) => {
    return useQuery({
        queryKey: ["lp", lpid],
        queryFn: () => getLpDetail(lpid ?? ""),
        enabled: Boolean(lpid),
        staleTime: 1000 * 30,
        gcTime: 1000 * 60 * 5,
    });
};

export default useGetLpDetail;
