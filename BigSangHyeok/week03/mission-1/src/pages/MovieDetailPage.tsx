import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { Cast, CreditsResponse, MovieDetails } from "../types/movie";

const imageBase = "https://image.tmdb.org/t/p";

const MovieDetailPage = () => {
    // URL의 동적 파라미터(movieId)를 읽어 해당 영화 상세를 조회한다.
    const { movieId } = useParams<{ movieId: string }>();
    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [cast, setCast] = useState<Cast[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!movieId) {
            setIsError(true);
            return;
        }

        const fetchMovieDetails = async () => {
            setIsPending(true);
            setIsError(false);

            try {
                // 상세 정보와 크레딧을 병렬 요청해 로딩 시간을 줄인다.
                const [movieRes, creditRes] = await Promise.all([
                    axios.get<MovieDetails>(
                        `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
                        {
                            headers: {
                                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                            },
                        }
                    ),
                    axios.get<CreditsResponse>(
                        `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
                        {
                            headers: {
                                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                            },
                        }
                    ),
                ]);

                setMovie(movieRes.data);
                setCast(creditRes.data.cast.slice(0, 20));
            } catch {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        fetchMovieDetails();
    }, [movieId]);

    if (isPending) {
        return (
            <div className='flex min-h-[70vh] items-center justify-center'>
                <LoadingSpinner />
            </div>
        );
    }

    if (isError || !movie) {
        return (
            <div className='mx-auto mt-12 max-w-5xl rounded-xl border border-red-200 bg-red-50 p-6 text-center'>
                <p className='text-lg font-semibold text-red-600'>영화 상세 정보를 불러오지 못했습니다.</p>
                <Link to='/movies/popular' className='mt-4 inline-block text-sm font-medium text-red-500 underline'>
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
    // 장르 배열을 화면 표시에 맞는 문자열로 변환한다.
    const genresText = movie.genres.map((genre) => genre.name).join(" · ");

    return (
        <div className='mx-auto w-full max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8'>
            <div
                className='relative overflow-hidden rounded-2xl border border-white/20 bg-black text-white'
                style={{
                    backgroundImage: backdropUrl
                        ? `linear-gradient(90deg, rgba(0, 0, 0, 0.92) 38%, rgba(0, 0, 0, 0.35)), url(${backdropUrl})`
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
                            <span className='rounded-full bg-[#dda5e3] px-3 py-1 font-semibold text-black'>평점 {vote}</span>
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

            <section className='mt-10'>
                <h2 className='text-3xl font-black tracking-tight text-zinc-900'>감독/출연</h2>
                <div className='mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8'>
                    {cast.map((person) => {
                        const profileUrl = person.profile_path
                            ? `${imageBase}/w185${person.profile_path}`
                            : "";

                        return (
                            <article key={person.id} className='rounded-xl p-2 text-center'>
                                <div className='mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-zinc-200 bg-zinc-100'>
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