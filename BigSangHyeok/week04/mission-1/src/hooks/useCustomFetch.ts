import { useEffect, useState } from "react";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";

interface UseCustomFetchResult<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
}

export const useCustomFetch = <T,>(
    url: string | null,
    config?: AxiosRequestConfig,
    deps: unknown[] = []
): UseCustomFetchResult<T> => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // URL, config, deps 중 하나가 바뀌면 자동으로 재요청한다.
    useEffect(() => {
        if (!url) {
            setData(null);
            setIsLoading(false);
            setError(null);
            return;
        }

        // 언마운트 뒤 setState 호출을 막기 위한 플래그
        let isMounted = true;

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await axios.get<T>(url, config);
                if (isMounted) {
                    setData(response.data);
                }
            } catch (err) {
                if (isMounted) {
                    const axiosError = err as AxiosError<{ status_message?: string }>;
                    setError(
                        axiosError.response?.data?.status_message ??
                            "요청을 처리하는 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요."
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [url, config, ...deps]);

    return { data, isLoading, error };
};