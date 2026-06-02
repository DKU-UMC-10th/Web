import { memo, useMemo } from "react";
import type { Movie } from "../types/movie";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

interface MovieCardProps {
    movie: Movie;
    variant?: "card" | "modal";
    onSelect?: (movie: Movie) => void;
    onClose?: () => void;
}

const getImageUrl = (path: string | null, size = "w500") => {
    if (!path) return "https://placehold.co/500x750?text=No+Image";
    return `${IMAGE_BASE_URL}/${size}${path}`;
};

const formatDate = (date: string) => {
    if (!date) return "개봉일 정보 없음";
    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(date));
};

const MovidCard = memo(({movie, variant = "card", onSelect, onClose}: MovieCardProps) => {
    console.log(`MovidCard 렌더링: ${movie.title}`);

    const posterUrl = useMemo(() => getImageUrl(movie.poster_path), [movie.poster_path]);
    const backdropUrl = useMemo(
        () => getImageUrl(movie.backdrop_path || movie.poster_path, "w1280"),
        [movie.backdrop_path, movie.poster_path],
    );
    const releaseDate = useMemo(() => formatDate(movie.release_date), [movie.release_date]);
    const rating = useMemo(() => movie.vote_average.toFixed(1), [movie.vote_average]);
    const popularityWidth = useMemo(
        () => `${Math.min(Math.max(movie.popularity / 8, 4), 100)}%`,
        [movie.popularity],
    );
    const overview = movie.overview || "등록된 줄거리가 없습니다.";
    const imdbUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;

    if (variant === "modal") {
        return (
            <div className="modal-backdrop" role="presentation" onClick={onClose}>
                <article
                    className="movie-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${movie.title} 상세 정보`}
                    onClick={(event) => event.stopPropagation()}
                >
                    <button className="modal-close" type="button" onClick={onClose} aria-label="닫기">
                        ×
                    </button>

                    <header className="modal-hero" style={{backgroundImage: `url(${backdropUrl})`}}>
                        <div className="modal-hero-text">
                            <h2>{movie.title}</h2>
                            <p>{movie.original_title}</p>
                        </div>
                    </header>

                    <div className="modal-content">
                        <img className="modal-poster" src={posterUrl} alt={`${movie.title} 포스터`} />

                        <div className="modal-details">
                            <p className="modal-rating">
                                <strong>{rating}</strong>
                                <span>({movie.vote_count.toLocaleString()} 평가)</span>
                            </p>

                            <div className="detail-block">
                                <h3>개봉일</h3>
                                <p>{releaseDate}</p>
                            </div>

                            <div className="detail-block">
                                <h3>인기도</h3>
                                <div className="popularity-bar" aria-label={`인기도 ${movie.popularity}`}>
                                    <span style={{width: popularityWidth}} />
                                </div>
                            </div>

                            <div className="detail-block">
                                <h3>줄거리</h3>
                                <p className="modal-overview">{overview}</p>
                            </div>

                            <div className="modal-actions">
                                <a href={imdbUrl} target="_blank" rel="noreferrer">
                                    IMDb에서 검색
                                </a>
                                <button type="button" onClick={onClose}>닫기</button>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        );
    }

    return (
        <article className="movie-card" onClick={() => onSelect?.(movie)}>
            <button className="movie-card-button" type="button">
                <span className="rating-badge">{rating}</span>
                <img src={posterUrl} alt={`${movie.title} 포스터`} loading="lazy" />
                <div className="movie-card-body">
                    <h2>{movie.title}</h2>
                    <p className="release-date">{releaseDate}</p>
                    <p className="overview">{overview}</p>
                </div>
            </button>
        </article>
    );
});

export default MovidCard;
