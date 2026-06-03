import { memo, useMemo } from "react";
import type { Movie } from "../types/movie";
import MovidCard from "./MovidCard";

interface MovieListProps {
    movies: Movie[];
}

const MovieList = memo(({movies}: MovieListProps) => {
    const moviesWithPoster = useMemo(() => {
        return movies.filter((movie) => movie.poster_path);
    }, [movies]);

    if (moviesWithPoster.length === 0) {
        return <p className="status-message">검색 결과가 없습니다.</p>;
    }

    return (
        <section className="movie-grid">
            {moviesWithPoster.map((movie) => (
                <MovidCard key={movie.id} movie={movie} />
            ))}
        </section>
    );
});

export default MovieList;
