import { memo } from 'react'
import type { Movie } from '../movieTypes'

type MovieGridProps = {
  movies: Movie[]
  searched: boolean
  isLoading: boolean
  onMovieSelect: (movieId: number) => void
  formatReleaseDate: (dateString: string) => string
  getPosterUrl: (path: string | null) => string
}

const MovieCard = ({
  movie,
  onMovieSelect,
  formatReleaseDate,
  getPosterUrl,
}: {
  movie: Movie
  onMovieSelect: (movieId: number) => void
  formatReleaseDate: (dateString: string) => string
  getPosterUrl: (path: string | null) => string
}) => {
  const score = Number.isFinite(movie.vote_average) ? movie.vote_average.toFixed(1) : '0.0'

  return (
    <article className="movie-card">
      <button
        type="button"
        className="poster-button"
        onClick={() => onMovieSelect(movie.id)}
        aria-label={`${movie.title} 상세 보기`}
      >
        <div className="poster-wrap">
          {movie.poster_path ? (
            <img src={getPosterUrl(movie.poster_path)} alt={`${movie.title} 포스터`} loading="lazy" />
          ) : (
            <div className="poster-fallback">NO IMAGE</div>
          )}
          <span className="rating-badge">{score}</span>
        </div>
      </button>

      <div className="movie-content">
        <h2 title={movie.title}>{movie.title}</h2>
        <p className="release-date">{formatReleaseDate(movie.release_date)}</p>
        <p className="overview">{movie.overview || '줄거리 정보가 없습니다.'}</p>
      </div>
    </article>
  )
}

export const MovieGrid = memo(function MovieGrid({
  movies,
  searched,
  isLoading,
  onMovieSelect,
  formatReleaseDate,
  getPosterUrl,
}: MovieGridProps) {
  return (
    <section className="movie-grid" aria-live="polite">
      {searched && !isLoading && movies.length === 0 && (
        <p className="empty-text">검색 결과가 없습니다. 다른 키워드로 검색해 보세요.</p>
      )}

      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onMovieSelect={onMovieSelect}
          formatReleaseDate={formatReleaseDate}
          getPosterUrl={getPosterUrl}
        />
      ))}
    </section>
  )
});
