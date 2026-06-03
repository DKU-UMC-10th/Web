import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import type { MovieDetail } from '../movieTypes'
import { ACCESS_TOKEN, API_BASE, formatReleaseDate, getPosterUrl } from '../tmdb'

export function MovieDetailPage() {
  const { movieId } = useParams()
  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const loadMovieDetail = async () => {
      if (!movieId || Number.isNaN(Number(movieId))) {
        setErrorMessage('올바른 영화 ID가 아닙니다.')
        setIsLoading(false)
        return
      }

      if (!ACCESS_TOKEN) {
        setErrorMessage('TMDB 토큰이 없습니다. .env 파일에 VITE_TMDB_ACCESS_TOKEN을 설정해 주세요.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await fetch(`${API_BASE}/movie/${movieId}?language=ko-KR`, {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            Accept: 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`상세 정보 요청 실패: ${response.status}`)
        }

        const data = (await response.json()) as MovieDetail
        setMovieDetail(data)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        const message = error instanceof Error ? error.message : '상세 정보를 불러오지 못했습니다.'
        setErrorMessage(message)
        setMovieDetail(null)
      } finally {
        setIsLoading(false)
      }
    }

    void loadMovieDetail()

    return () => {
      controller.abort()
    }
  }, [movieId])

  return (
    <div className="page detail-page">
      <header className="page-header">
        <h1>Movie Detail</h1>
        <p>
          <Link className="back-link" to="/">
            ← 검색으로 돌아가기
          </Link>
        </p>
      </header>

      <section className="detail-card" aria-live="polite">
        {isLoading && <p className="detail-state">상세 페이지를 불러오는 중입니다...</p>}
        {errorMessage && <p className="detail-error">{errorMessage}</p>}

        {!isLoading && !errorMessage && movieDetail && (
          <>
            <p className="detail-path">/movies/{movieDetail.id}</p>
            <div className="detail-layout">
              <div className="detail-poster">
                {movieDetail.poster_path ? (
                  <img src={getPosterUrl(movieDetail.poster_path)} alt={movieDetail.title} />
                ) : (
                  <div className="detail-poster-empty">NO IMAGE</div>
                )}
              </div>

              <div className="detail-info">
                <h2>{movieDetail.title}</h2>
                <p className="detail-original">{movieDetail.original_title}</p>
                <p className="detail-meta">
                  <span>{formatReleaseDate(movieDetail.release_date)}</span>
                  <span>평점 {movieDetail.vote_average.toFixed(1)}</span>
                  <span>투표 {movieDetail.vote_count.toLocaleString('ko-KR')}</span>
                </p>
                <p className="detail-overview">{movieDetail.overview || '줄거리 정보가 없습니다.'}</p>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  )
}