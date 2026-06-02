import type { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import axiosClient from "../apis/axiosClinent";

const useFetch = <T,>(url: string, options?: AxiosRequestConfig, enabled = true) => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!enabled) {
            setData(null);
            setError(null);
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const {data} = await axiosClient.get<T>(url, {
                    ...options,
                    signal: controller.signal,
                });
                setData(data);
            } catch {
                if (!controller.signal.aborted) {
                    setError("데이터를 가져오는 데 문제가 발생했습니다.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        return () => controller.abort();
    }, [url, options, enabled]);

    return {data, error, isLoading};
};

export default useFetch;
