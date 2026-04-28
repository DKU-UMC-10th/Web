import useCustomFetch from '../hooks/useCustomFetch';
import MovieCard from '../components/MovieCard';
import { Movie } from '../types/movie';

interface MovieResponse {
    results: Movie[];
}

const MoviesPage = () => {
    const { data, isLoading, isError } = useCustomFetch<MovieResponse>('/movie/popular');

    if (isLoading) return <div className="bg-black min-h-screen text-white p-10 font-bold text-2xl">로딩 중... 🍿</div>;
    if (isError) return <div className="bg-black min-h-screen text-white p-10">에러 발생!</div>;

    return (
        <div className="bg-black min-h-screen p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {data?.results.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
};

export default MoviesPage;