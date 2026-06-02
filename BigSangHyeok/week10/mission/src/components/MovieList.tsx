import { memo, useCallback, useMemo, useState } from "react";
import type { Movie } from "../types/movie";
import MovidCard from "./MovidCard";

interface MovieListProps {
    movies: Movie[];
}

const MovieList = memo(({movies}: MovieListProps) => {
    console.log("MovieList 렌더링");

    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const moviesWithPoster = useMemo(() => {
        console.log("포스터가 있는 영화 목록 계산");
        return movies.filter((movie) => movie.poster_path);
    }, [movies]);

    const handleSelectMovie = useCallback((movie: Movie) => {
        setSelectedMovie(movie);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedMovie(null);
    }, []);

    if (moviesWithPoster.length === 0) {
        return <p className="status-message">검색 결과가 없습니다.</p>;
    }

    return (
        <>
            <section className="movie-grid">
                {moviesWithPoster.map((movie) => (
                    <MovidCard
                        key={movie.id}
                        movie={movie}
                        onSelect={handleSelectMovie}
                    />
                ))}
            </section>

            {selectedMovie && (
                <MovidCard
                    movie={selectedMovie}
                    variant="modal"
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
});

export default MovieList;
