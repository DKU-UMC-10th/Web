import { useLocation } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { useGetMovies } from '../hooks/useGetMovies'; // 만든 훅 불러오기

const MoviesPage = () => {
    const location = useLocation();

    // 1. 경로에 따른 카테고리 결정 로직은 그대로 둡니다.
    let category = "popular";
    if (location.pathname.includes("now-playing")) category = "now_playing";
    else if (location.pathname.includes("top-rated")) category = "top_rated";
    else if (location.pathname.includes("up-coming")) category = "upcoming";

    // 2. 한 줄로 데이터 가져오기 끝! 🥊
    const { data: movies, isLoading, isError } = useGetMovies(category);

    if (isLoading) return <div className="...">로딩 중... 🍠</div>;
    if (isError) return <div className="...">에러 발생 ㅡㅡ</div>;

    return (
        <div className="bg-black min-h-screen p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {movies?.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
};

export default MoviesPage;