export const API_BASE = 'https://api.themoviedb.org/3'
export const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'
export const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w780'

export const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN as string | undefined

export function getPosterUrl(path: string | null) {
  return path ? `${IMAGE_BASE}${path}` : ''
}

export function getBackdropUrl(path: string | null) {
  return path ? `${BACKDROP_BASE}${path}` : ''
}

export function formatReleaseDate(dateString: string) {
  if (!dateString) {
    return '개봉일 정보 없음'
  }

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return dateString
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}