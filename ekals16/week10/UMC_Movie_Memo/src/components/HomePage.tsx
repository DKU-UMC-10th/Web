import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { MovieGrid } from './MovieGrid'
import { SearchForm } from './SearchForm'
import type { LanguageOption, Movie, SearchResponse } from '../movieTypes'
import { ACCESS_TOKEN, API_BASE, formatReleaseDate, getPosterUrl } from '../tmdb'

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { label: '한국어', value: 'ko-KR' },
  { label: 'English', value: 'en-US' },
  { label: '日本語', value: 'ja-JP' },
]

export function HomePage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('명탐정 코난')
  const [includeAdult, setIncludeAdult] = useState(false)
  const [language, setLanguage] = useState('ko-KR')
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [searched, setSearched] = useState(false)

  const hasToken = Boolean(ACCESS_TOKEN)

  const searchMovies = useCallback(
    async (page = 1) => {
      const trimmedQuery = query.trim()

      if (!trimmedQuery) {
        setErrorMessage('영화 제목을 입력해 주세요.')
        return
      }

      if (!ACCESS_TOKEN) {
        setErrorMessage('TMDB 토큰이 없습니다. .env 파일에 VITE_TMDB_ACCESS_TOKEN을 설정해 주세요.')
        return
      }

      setIsLoading(true)
      setErrorMessage('')

      try {
        const params = new URLSearchParams({
          query: trimmedQuery,
          include_adult: String(includeAdult),
          language,
          page: String(page),
        })

        const response = await fetch(`${API_BASE}/search/movie?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            Accept: 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`TMDB 요청 실패: ${response.status}`)
        }

        const data = (await response.json()) as SearchResponse
        setMovies(data.results)
        setSearched(true)
      } catch (error) {
        const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
        setErrorMessage(message)
        setMovies([])
        setSearched(true)
      } finally {
        setIsLoading(false)
      }
    },
    [includeAdult, language, query],
  )

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      await searchMovies()
    },
    [searchMovies],
  )

  const onMovieSelect = useCallback(
    (movieId: number) => {
      navigate(`/movies/${movieId}`)
    },
    [navigate],
  )

  const onQueryChange = useCallback((value: string) => {
    setQuery(value)
  }, [])

  const onIncludeAdultChange = useCallback((value: boolean) => {
    setIncludeAdult(value)
  }, [])

  const onLanguageChange = useCallback((value: string) => {
    setLanguage(value)
  }, [])

  useEffect(() => {
    void searchMovies()
  }, [])

  return (
    <div className="page">
      <header className="page-header">
        <h1>Movie Memo</h1>
        <p>TMDB 검색 API로 원하는 영화를 빠르게 찾고 기록해 보세요.</p>
      </header>

      <SearchForm
        query={query}
        includeAdult={includeAdult}
        language={language}
        languageOptions={LANGUAGE_OPTIONS}
        isLoading={isLoading}
        hasToken={hasToken}
        errorMessage={errorMessage}
        onQueryChange={onQueryChange}
        onIncludeAdultChange={onIncludeAdultChange}
        onLanguageChange={onLanguageChange}
        onSubmit={onSubmit}
      />

      <MovieGrid
        movies={movies}
        searched={searched}
        isLoading={isLoading}
        onMovieSelect={onMovieSelect}
        formatReleaseDate={formatReleaseDate}
        getPosterUrl={getPosterUrl}
      />
    </div>
  )
}