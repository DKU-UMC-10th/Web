import { useEffect, useState } from "react";
import axios from "axios";
import type { AxiosRequestConfig } from "axios";

type RequestParams = Record<string, string | number | boolean | null | undefined>;

type UseCustomFetchOptions = {
    params?: RequestParams;
    headers?: AxiosRequestConfig["headers"];
    enabled?: boolean;
};

type UseCustomFetchResult<T> = {
    data: T | null;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
};

const toKey = (value: unknown) => {
    try {
        return JSON.stringify(value ?? {});
    } catch {
        return "";
    }
};

export default function useCustomFetch<T>(
    url: string,
    options: UseCustomFetchOptions = {},
): UseCustomFetchResult<T> {
    const { params, headers, enabled = true } = options;
    const paramsKey = toKey(params);
    const headersKey = toKey(headers);

    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(enabled);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!enabled || !url) {
            setIsLoading(false);
            return;
        }

        let parsedParams: RequestParams | undefined;
        let parsedHeaders: AxiosRequestConfig["headers"] | undefined;

        try {
            parsedParams = paramsKey ? (JSON.parse(paramsKey) as RequestParams) : undefined;
        } catch {
            parsedParams = undefined;
        }

        try {
            parsedHeaders = headersKey ? (JSON.parse(headersKey) as AxiosRequestConfig["headers"]) : undefined;
        } catch {
            parsedHeaders = undefined;
        }

        const controller = new AbortController();

        const fetchData = async () => {
            setIsLoading(true);
            setIsError(false);
            setError(null);

            try {
                const response = await axios.get<T>(url, {
                    params: parsedParams,
                    headers: parsedHeaders,
                    signal: controller.signal,
                });

                setData(response.data);
            } catch (err) {
                if (axios.isCancel(err)) {
                    return;
                }

                setIsError(true);
                setData(null);
                setError(err instanceof Error ? err : new Error("요청 중 오류가 발생했습니다."));
            } finally {
                // 취소된(이전) 요청이 최신 요청의 로딩 상태를 덮어쓰지 않도록 방지한다.
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            controller.abort();
        };
    }, [url, paramsKey, headersKey, enabled]);

    return {
        data,
        isLoading,
        isError,
        error,
    };
}