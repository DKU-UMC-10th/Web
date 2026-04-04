import { useState } from "react"
import type { Movie, MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import useCustomFetch from "../hooks/useCustomFetch";

const CATEGORY_TO_API: Record<string, string> = {
    popular: "popular",
    upcoming: "upcoming",
    "now-playing": "now_playing",
    "top-rated": "top_rated",
};

export default function MoviePage() {

    // 페이지
    const [page, setPage] = useState(1);

    const {category} = useParams<{category: string}>();
    const apiCategory = category ? CATEGORY_TO_API[category] : undefined;

    const { data, isLoading, isError } = useCustomFetch<MovieResponse>(
        apiCategory ? `https://api.themoviedb.org/3/movie/${apiCategory}` : "",
        {
            params: {
                language: "ko-KR",
                page,
            },
            headers: {
                Authorization: "Bearer " + import.meta.env.VITE_TMDB_KEY,
            },
            enabled: Boolean(apiCategory),
        },
    );

    const movies: Movie[] = data?.results ?? [];

    if (!apiCategory || isError) {
        return <div>
            <span className='text-red-500 text-2xl'>에러가 발생했습니다.</span>
        </div>
    }

    return (
        <>
        <div className='flex items-center justify-center gap-6 mt-5'>
            <button
            className='bg[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
            hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300
            cursor-pointer disabled:cursor-not-allowed'
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
        >{'<'}
        </button>
        <span>{page} 페이지</span>
        <button
            className='bg[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
            hover:bg-[#b2dab1] transition-all duration-200
            cursor-pointer '
            onClick={() => setPage((prev) => prev + 1)}
        >{'>'}
        </button>
        </div>
        {isLoading && (
            <div className='flex item-center justify-center h-dvh'>
                <LoadingSpinner />
            </div>
        )}

        {!isLoading && ( 

        <div className='p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
        )}
        </>
    );
}