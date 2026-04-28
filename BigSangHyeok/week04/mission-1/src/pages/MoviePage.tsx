import { useMemo, useState } from "react";
import { type MovieResponse } from '../types/movie';
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import { useCustomFetch } from "../hooks/useCustomFetch";

export default function MoviePage(){
    const [page, setPage] = useState(1);

    const {category} = useParams<{
        category : string;
    }>();

    // category/page가 바뀌면 요청 URL도 함께 바뀐다.
    const endpoint = category
        ? `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`
        : null;

    const requestConfig = useMemo(
        () => ({
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
        }),
        []
    );

    // 공통 훅으로 목록 데이터/로딩/에러를 한 번에 관리한다.
    const { data, isLoading, error } = useCustomFetch<MovieResponse>(
        endpoint,
        requestConfig,
        [category, page]
    );

    if (!category) {
        return (
            <div className='mx-auto mt-12 max-w-xl rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center'>
                <p className='text-lg font-semibold text-rose-600'>카테고리 정보가 없어 영화를 불러올 수 없습니다.</p>
            </div>
        );
    }

    if (error){
        return (
            <div className='mx-auto mt-12 max-w-2xl rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center'>
                <p className='text-lg font-semibold text-rose-600'>영화 목록을 불러오지 못했어요.</p>
                <p className='mt-2 text-sm text-rose-500'>{error}</p>
            </div>
        );
    }

    return (
        <div className='mx-auto w-full max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8'>
            <div className = 'mb-6 flex items-center justify-center gap-6'>
                <button 
                className='rounded-xl bg-zinc-900 px-6 py-3 text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300'
                disabled= {page === 1} 
                onClick = {() => setPage((prev) => prev - 1)}>
                    {`<`}</button>
                <span className='rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700'>{page}페이지</span>
                <button
                className='cursor-pointer rounded-xl bg-zinc-900 px-6 py-3 text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-700'
                onClick = {() => setPage((prev) => prev + 1)}>
                    {`>`}</button>
            </div>

            {isLoading && 
            <div className = 'flex min-h-[55vh] flex-col items-center justify-center gap-3'>
                <LoadingSpinner />
                <p className='text-sm font-medium text-zinc-500'>영화 목록을 불러오는 중입니다...</p>
            </div>}

            {/* 로딩이 끝나면 현재 페이지의 영화 목록을 카드로 렌더링 */}
            {!isLoading &&
            <div className='p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4
                lg:grid-cols-5 xl:grid-cols-6'>
            {data?.results.map((movie)=>(
                <MovieCard key = {movie.id} movie = {movie}/>
            ))}
            </div>
            }   
        </div>
    )
}