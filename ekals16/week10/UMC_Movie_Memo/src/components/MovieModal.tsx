import type { MovieDetail } from '../movieTypes'
import { memo } from 'react'

type MovieModalProps = {
  selectedMovieDetail: MovieDetail | null
  isDetailLoading: boolean
  detailError: string
  onClose: () => void
  formatReleaseDate: (dateString: string) => string
  getPosterUrl: (path: string | null) => string
  getBackdropUrl: (path: string | null) => string
}

export const MovieModal = memo(function MovieModal({
  selectedMovieDetail,
  isDetailLoading,
  detailError,
  onClose,
  formatReleaseDate,
  getPosterUrl,
  getBackdropUrl,
}: MovieModalProps) {
  if (!selectedMovieDetail && !isDetailLoading && !detailError) {
    return null
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="영화 상세 정보"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="모달 닫기">
          ×
        </button>

        {isDetailLoading && <p className="modal-state">상세 정보를 불러오는 중입니다...</p>}
        {detailError && <p className="modal-error">{detailError}</p>}

        {!isDetailLoading && selectedMovieDetail && (
          <div className="modal-content">
            <header className="modal-hero">
              {selectedMovieDetail.backdrop_path ? (
                <img
                  className="modal-backdrop"
                  src={getBackdropUrl(selectedMovieDetail.backdrop_path)}
                  alt={`${selectedMovieDetail.title} 배경 이미지`}
                />
              ) : (
                <div className="modal-backdrop-fallback" />
              )}
              <div className="modal-hero-gradient" />
              <div className="modal-hero-copy">
                <h3>{selectedMovieDetail.title}</h3>
                <p className="modal-original-title">{selectedMovieDetail.original_title}</p>
              </div>
            </header>

            <section className="modal-body">
              <aside className="modal-poster-column">
                {selectedMovieDetail.poster_path ? (
                  <img
                    className="modal-poster"
                    src={getPosterUrl(selectedMovieDetail.poster_path)}
                    alt={`${selectedMovieDetail.title} 포스터`}
                  />
                ) : (
                  <div className="modal-poster-empty">NO IMAGE</div>
                )}
              </aside>

              <div className="modal-info-column">
                <div className="modal-score-line">
                  <strong>{selectedMovieDetail.vote_average.toFixed(1)}</strong>
                  <span>({selectedMovieDetail.vote_count.toLocaleString('ko-KR')} 평가)</span>
                </div>

                <div className="modal-info-block">
                  <h4>개봉일</h4>
                  <p>{formatReleaseDate(selectedMovieDetail.release_date)}</p>
                </div>

                <div className="modal-info-block">
                  <h4>인기도</h4>
                  <p>{selectedMovieDetail.popularity.toFixed(1)}</p>
                </div>

                <div className="modal-info-block">
                  <h4>줄거리</h4>
                  <p className="modal-overview">
                    {selectedMovieDetail.overview || '줄거리 정보가 없습니다.'}
                  </p>
                </div>

                {selectedMovieDetail.tagline && (
                  <p className="modal-tagline">"{selectedMovieDetail.tagline}"</p>
                )}

                {selectedMovieDetail.genres.length > 0 && (
                  <div className="genre-row">
                    {selectedMovieDetail.genres.map((genre) => (
                      <span key={genre.id} className="genre-chip">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="modal-actions">
                  {(() => {
                    const imdbUrl = selectedMovieDetail.imdb_id
                      ? `https://www.imdb.com/title/${selectedMovieDetail.imdb_id}/`
                      : `https://www.imdb.com/find?q=${encodeURIComponent(
                          selectedMovieDetail.original_title || selectedMovieDetail.title,
                        )}`

                    return (
                      <a
                        className="imdb-button"
                        href={imdbUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        IMDb에서 검색
                      </a>
                    )
                  })()}
                  <button type="button" className="close-button" onClick={onClose}>
                    닫기
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </section>
    </div>
  )
});
