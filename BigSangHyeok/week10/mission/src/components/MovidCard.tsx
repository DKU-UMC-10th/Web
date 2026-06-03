import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import type { Movie } from "../types/movie";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

interface MovieCardProps {
    movie: Movie;
}

const getImageUrl = (path: string | null, size = "w500") => {
    if (!path) return "https://placehold.co/500x750?text=No+Image";
    return `${IMAGE_BASE_URL}/${size}${path}`;
};

const formatDate = (date: string) => {
    if (!date) return "Release date unknown";
    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(date));
};

const MovidCard = memo(({movie}: MovieCardProps) => {
    const posterUrl = useMemo(() => getImageUrl(movie.poster_path), [movie.poster_path]);
    const releaseDate = useMemo(() => formatDate(movie.release_date), [movie.release_date]);
    const rating = useMemo(() => movie.vote_average.toFixed(1), [movie.vote_average]);
    const overview = movie.overview || "No overview available.";

    return (
        <article className="movie-card">
            <Link className="movie-card-button" to={`/movies/${movie.id}`}>
                <span className="rating-badge">{rating}</span>
                <img src={posterUrl} alt={`${movie.title} poster`} loading="lazy" />
                <div className="movie-card-body">
                    <h2>{movie.title}</h2>
                    <p className="release-date">{releaseDate}</p>
                    <p className="overview">{overview}</p>
                </div>
            </Link>
        </article>
    );
});

export default MovidCard;
