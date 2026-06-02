import { useCallback, useMemo, useState } from "react";
import MovieFilter from "../components/MovieFilter";
import MovieList from "../components/MovieList";
import type { LanguageCode } from "../components/LanguageSelector";
import useFetch from "../hooks/useFetch";
import type { MovieResponse } from "../types/movie";

export default function HomePage() {
    const [keyword, setKeyword] = useState("");
    const [submittedKeyword, setSubmittedKeyword] = useState("");
    const [includeAdult, setIncludeAdult] = useState(false);
    const [language, setLanguage] = useState<LanguageCode>("ko-KR");

    const requestOptions = useMemo(() => ({
        params: {
            query: submittedKeyword,
            include_adult: includeAdult,
            language,
        },
    }), [submittedKeyword, includeAdult, language]);

    const hasSearched = submittedKeyword.length > 0;
    const {data, error, isLoading} = useFetch<MovieResponse>("/search/movie", requestOptions, hasSearched);

    const handleKeywordChange = useCallback((value: string) => {
        setKeyword(value);
    }, []);

    const handleAdultChange = useCallback((value: boolean) => {
        setIncludeAdult(value);
    }, []);

    const handleLanguageChange = useCallback((value: LanguageCode) => {
        setLanguage(value);
    }, []);

    const handleSubmit = useCallback(() => {
        const nextKeyword = keyword.trim();
        if (!nextKeyword) return;
        setSubmittedKeyword(nextKeyword);
    }, [keyword]);

    return (
        <main className="container">
            <MovieFilter
                keyword={keyword}
                includeAdult={includeAdult}
                language={language}
                onKeywordChange={handleKeywordChange}
                onAdultChange={handleAdultChange}
                onLanguageChange={handleLanguageChange}
                onSubmit={handleSubmit}
            />

            {error && <p className="status-message error-message">{error}</p>}
            {hasSearched && (
                isLoading ? (
                    <p className="status-message">로딩중입니다...</p>
                ) : (
                    <MovieList movies={data?.results || []} />
                )
            )}
        </main>
    );
}
