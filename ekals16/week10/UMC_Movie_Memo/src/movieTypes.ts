export type LanguageOption = {
  label: string
  value: string
}

export type Movie = {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  release_date: string
  vote_average: number
}

export type SearchResponse = {
  page: number
  total_pages: number
  total_results: number
  results: Movie[]
}

export type MovieDetail = {
  id: number
  title: string
  original_title: string
  imdb_id: string | null
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  genres: Array<{ id: number; name: string }>
  runtime: number | null
  tagline: string
}
