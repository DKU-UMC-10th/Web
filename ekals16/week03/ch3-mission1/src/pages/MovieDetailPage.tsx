import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { MovieCreditsResponse, MovieDetail } from "../types/movie";

const PROFILE_BASE_URL = "https://image.tmdb.org/t/p/w185";

const MovieDetailPage = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [credits, setCredits] = useState<MovieCreditsResponse | null>(null);
    const [isPending, setIsPending] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchMovieDetail = async () => {
            if (!movieId) {
                setIsError(true);
                setIsPending(false);
                return;
            }

            setIsPending(true);
            setIsError(false);

            try {
                const headers = {
                    Authorization: "Bearer " + import.meta.env.VITE_TMDB_KEY,
                };

                const [movieResponse, creditsResponse] = await Promise.all([
                    axios.get<MovieDetail>(
                        `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
                        { headers },
                    ),
                    axios.get<MovieCreditsResponse>(
                        `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
                        { headers },
                    ),
                ]);

                setMovie(movieResponse.data);
                setCredits(creditsResponse.data);
            } catch {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        fetchMovieDetail();
    }, [movieId]);

    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (isError || !movie || !credits) {
        return (
            <div className="p-10 text-red-500 text-xl">
                영화 상세 정보를 불러오지 못했습니다.
            </div>
        );
    }

    const director = credits.crew.find((person) => person.job === "Director");
    const topCast = credits.cast.slice(0, 16);

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="relative">
                {movie.backdrop_path && (
                    <img
                        src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
                        alt={`${movie.title} 배경 이미지`}
                        className="h-[360px] w-full object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-slate-950" />
            </div>

            <div className="mx-auto -mt-16 max-w-6xl px-6 pb-10 pt-8 relative">
                <h1 className="text-3xl font-bold">{movie.title}</h1>
                {!!movie.tagline && <p className="mt-2 text-base text-gray-300">{movie.tagline}</p>}
                <p className="mt-2 text-sm text-gray-300">
                    평점 {movie.vote_average.toFixed(1)} | 개봉일 {movie.release_date} | {movie.runtime}분
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                        <span key={genre.id} className="rounded-full bg-white/10 px-3 py-1 text-xs">
                            {genre.name}
                        </span>
                    ))}
                </div>
                <p className="mt-6 leading-relaxed text-gray-100">{movie.overview}</p>

                <section className="mt-10">
                    <h2 className="text-2xl font-semibold">감독/출연</h2>

                    {director && (
                        <div className="mt-4 flex items-center gap-4 rounded-xl bg-white/5 p-3">
                            {director.profile_path ? (
                                <img
                                    src={`${PROFILE_BASE_URL}${director.profile_path}`}
                                    alt={`${director.name} 프로필 이미지`}
                                    className="h-14 w-14 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-700 text-lg font-bold">
                                    {director.name.charAt(0)}
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-gray-300">감독</p>
                                <p className="font-semibold">{director.name}</p>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {topCast.map((person) => (
                            <div key={`${person.id}-${person.character}`} className="text-center">
                                {person.profile_path ? (
                                    <img
                                        src={`${PROFILE_BASE_URL}${person.profile_path}`}
                                        alt={`${person.name} 프로필 이미지`}
                                        className="mx-auto h-20 w-20 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-700 text-lg font-bold">
                                        {person.name.charAt(0)}
                                    </div>
                                )}
                                <p className="mt-2 text-sm font-medium leading-tight">{person.name}</p>
                                <p className="text-xs leading-tight text-gray-400">{person.character || "역할 정보 없음"}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MovieDetailPage;