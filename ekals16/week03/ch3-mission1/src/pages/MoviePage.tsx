import { useEffect, useState } from "react"
import axios from "axios";
import type { Movie, MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";

const CATEGORY_TO_API: Record<string, string> = {
    popular: "popular",
    upcoming: "upcoming",
    "now-playing": "now_playing",
    "top-rated": "top_rated",
};

export default function MoviePage() {

    const [movies, setMovies] = useState<Movie[]>([]);
    // 1. 로딩 상태
    const [isPending, setIsPending] = useState(true);
    // 2. 에러 상태
    const[isError, setIsError] = useState(false);
    // 3. 페이지
    const [page, setPage] = useState(1);

    const {category} = useParams<{category: string}>();

    useEffect(() => {
        // async를 바로 붙이면 안되고 fetchMovies라는 함수를 만들어서 그 안에 async를 붙여야 한다.
        const fetchMovies = async () => {
            const apiCategory = category ? CATEGORY_TO_API[category] : undefined;
            if (!apiCategory) {
                setIsError(true);
                setIsPending(false);
                return;
            }

            setIsPending(true);
            setIsError(false);
            
            try {
            // response안에 구조분해할당 해서 data를 바로 꺼내올 수 있다.
            const {data} = await axios.get<MovieResponse>(
                `https://api.themoviedb.org/3/movie/${apiCategory}?language=ko-KR&page=${page}`,
                {
                    // headers도 작성해야 정상적으로 데이터를 받아올 수 있다.
                    headers: {
                        Authorization: 'Bearer ' + import.meta.env.VITE_TMDB_KEY,
                    }
                }
            );
            setMovies(data.results);
            } catch {
                setIsError(true);
            } finally {
                setIsPending(false);
            }

            /*const response = await fetch('https://api.themoviedb.org/3/movie/popular?api_key=' + import.meta.env.VITE_TMDB_KEY);
            const data = await response.json();
            // 또한, fecth를 하게되면 실질적인 데이터 값은 response가 아니라 response.json()이기 때문에, 풀어주는 과정이 필요하다. 
            console.log(data);*/
        }
        fetchMovies();
    }, [page, category]);
    // movies안에 type이 지정이 되어있지 않으므로, type으로 movie.ts를 통해 type 지정해주기

    if (isError) {
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
        {isPending && (
            <div className='flex item-center justify-center h-dvh'>
                <LoadingSpinner />
            </div>
        )}

        {!isPending && ( 

        <div className='p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
        )}
        </>
    );
}