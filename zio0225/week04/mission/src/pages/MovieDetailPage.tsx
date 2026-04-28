import { useParams } from 'react-router-dom';
import useCustomFetch from '../hooks/useCustomFetch';
import { MovieDetail, Credits } from '../types/movie';

const MovieDetailPage = () => {
    const { movieId } = useParams<{ movieId: string }>();

    const { data: movie, isLoading: isMovieLoading } = useCustomFetch<MovieDetail>(`/movie/${movieId}`);
    const { data: credits, isLoading: isCreditsLoading } = useCustomFetch<Credits>(`/movie/${movieId}/credits`);

    if (isMovieLoading || isCreditsLoading) return <div className="bg-black min-h-screen text-white p-10 font-bold text-2xl">로딩 중... 🎬</div>;
    if (!movie) return <div className="bg-black min-h-screen text-white p-10">정보 없음</div>;

    return (
        <div className="bg-black min-h-screen text-white">
            <div 
                className="relative h-[500px] w-full bg-cover bg-center"
                style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.1)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
            >
                <div className="absolute inset-0 flex flex-col justify-center px-10 max-w-3xl">
                    <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
                    <p className="text-lg text-gray-300 mb-4">평점 {movie.vote_average.toFixed(1)} | {movie.release_date} | {movie.runtime}분</p>
                    <p className="text-lg leading-relaxed line-clamp-6">{movie.overview}</p>
                </div>
            </div>
            {/* 출연진 렌더링 생략 - 지오님 기존 코드 활용 */}
        </div>
    );
};

export default MovieDetailPage;