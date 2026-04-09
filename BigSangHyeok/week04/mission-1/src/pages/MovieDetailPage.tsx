import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { Cast, CreditsResponse, MovieDetails } from "../types/movie";
import { useCustomFetch } from "../hooks/useCustomFetch";

const imageBase = "https://image.tmdb.org/t/p";

const MovieDetailPage = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const requestConfig = useMemo(
        () => ({
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
        }),
        []
    );

    const movieUrl = movieId
        ? `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`
        : null;

    const creditsUrl = movieId
        ? `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`
        : null;

    // 상세 정보 요청
    const {
        data: movie,
        isLoading: movieLoading,
        error: movieError,
    } = useCustomFetch<MovieDetails>(movieUrl, requestConfig, [movieId]);

    // 출연진 요청
    const {
        data: credits,
        isLoading: creditsLoading,
        error: creditsError,
    } = useCustomFetch<CreditsResponse>(creditsUrl, requestConfig, [movieId]);

    // 두 요청 상태를 합쳐 페이지 단일 상태로 처리
    const isLoading = movieLoading || creditsLoading;
    const error = movieError || creditsError;
    const cast: Cast[] = credits?.cast.slice(0, 20) ?? [];

    if (!movieId) {
        return (
            <div className='mx-auto mt-12 max-w-xl rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center'>
                <p className='text-lg font-semibold text-rose-600'>영화 ID가 없어 상세 정보를 조회할 수 없습니다.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className='flex min-h-[70vh] flex-col items-center justify-center gap-3'>
                <LoadingSpinner />
                <p className='text-sm font-medium text-zinc-500'>영화 상세 정보를 불러오는 중입니다...</p>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className='mx-auto mt-12 max-w-2xl rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center'>
                <p className='text-lg font-semibold text-rose-600'>영화 상세 정보를 불러오지 못했어요.</p>
                <p className='mt-2 text-sm text-rose-500'>{error ?? "잠시 후 다시 시도해 주세요."}</p>
                <Link to='/movies/popular' className='mt-4 inline-block text-sm font-medium text-rose-500 underline'>
                    인기 영화 페이지로 돌아가기
                </Link>
            </div>
        );
    }

    const backdropUrl = movie.backdrop_path
        ? `${imageBase}/w1280${movie.backdrop_path}`
        : "";
    const posterUrl = movie.poster_path
        ? `${imageBase}/w500${movie.poster_path}`
        : "";
    const vote = movie.vote_average.toFixed(1);
    const runtimeText = movie.runtime ? `${movie.runtime}분` : "상영시간 정보 없음";
    const genresText = movie.genres.map((genre) => genre.name).join(" · ");

    return (
        <div className='relative mx-auto w-full max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8'>
            <div className='pointer-events-none absolute inset-0 -z-10 overflow-hidden'>
                <div className='absolute -left-24 top-16 h-56 w-56 rounded-full bg-orange-200/40 blur-3xl' />
                <div className='absolute right-0 top-0 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl' />
            </div>

            <div
                className='relative overflow-hidden rounded-3xl border border-white/20 bg-black text-white shadow-2xl'
                style={{
                    backgroundImage: backdropUrl
                        ? `linear-gradient(105deg, rgba(0, 0, 0, 0.95) 32%, rgba(0, 0, 0, 0.42)), url(${backdropUrl})`
                        : "linear-gradient(90deg, rgba(0, 0, 0, 0.95), rgba(25, 25, 25, 0.95))",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className='grid min-h-80 gap-6 p-6 sm:p-8 md:grid-cols-[220px_1fr] md:gap-8'>
                    <div className='w-full max-w-56 overflow-hidden rounded-xl border border-white/20'>
                        {posterUrl ? (
                            <img
                                src={posterUrl}
                                alt={`${movie.title} 포스터`}
                                className='h-full w-full object-cover'
                            />
                        ) : (
                            <div className='flex h-80 items-center justify-center bg-zinc-800 text-sm text-zinc-300'>
                                포스터 없음
                            </div>
                        )}
                    </div>

                    <div className='self-center'>
                        <h1 className='text-3xl font-extrabold tracking-tight sm:text-4xl'>{movie.title}</h1>
                        {movie.tagline && <p className='mt-2 text-lg italic text-zinc-200'>{movie.tagline}</p>}

                        <div className='mt-4 flex flex-wrap items-center gap-2 text-sm text-zinc-200'>
                            <span className='rounded-full bg-amber-200 px-3 py-1 font-semibold text-zinc-900'>평점 {vote}</span>
                            <span>{movie.release_date}</span>
                            <span>·</span>
                            <span>{runtimeText}</span>
                            {genresText && (
                                <>
                                    <span>·</span>
                                    <span>{genresText}</span>
                                </>
                            )}
                        </div>

                        <p className='mt-5 max-w-3xl whitespace-pre-line text-sm leading-7 text-zinc-100 sm:text-base'>
                            {movie.overview || "줄거리 정보가 없습니다."}
                        </p>
                    </div>
                </div>
            </div>

            <section className='mt-10 rounded-3xl border border-zinc-100 bg-white/80 p-6 backdrop-blur'>
                <h2 className='text-3xl font-black tracking-tight text-zinc-900'>감독/출연</h2>
                <div className='mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8'>
                    {cast.map((person) => {
                        const profileUrl = person.profile_path
                            ? `${imageBase}/w185${person.profile_path}`
                            : "";

                        return (
                            <article key={person.id} className='rounded-xl bg-zinc-50 p-2 text-center transition-colors hover:bg-zinc-100'>
                                <div className='mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-zinc-200 bg-zinc-100 shadow-sm'>
                                    {profileUrl ? (
                                        <img
                                            src={profileUrl}
                                            alt={person.name}
                                            className='h-full w-full object-cover'
                                        />
                                    ) : (
                                        <div className='flex h-full w-full items-center justify-center text-xs text-zinc-500'>
                                            이미지 없음
                                        </div>
                                    )}
                                </div>
                                <p className='mt-2 truncate text-sm font-semibold text-zinc-900'>{person.name}</p>
                                <p className='truncate text-xs text-zinc-500'>{person.character || "배역 정보 없음"}</p>
                            </article>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default MovieDetailPage;