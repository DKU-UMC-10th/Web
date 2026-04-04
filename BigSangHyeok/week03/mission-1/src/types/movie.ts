export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  // 필요하다면 추가 필드도 정의 가능
};

export type MovieResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

// /movie/{movie_id} 응답에서 상세 페이지가 사용하는 핵심 필드들
export type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  runtime: number | null;
  genres: { id: number; name: string }[];
  tagline: string;
};

// /movie/{movie_id}/credits 의 cast 항목
export type Cast = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

// /movie/{movie_id}/credits 의 crew 항목
export type Crew = {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
};

// 상세 페이지에서 credits API 응답을 타입 안전하게 다루기 위한 구조
export type CreditsResponse = {
  cast: Cast[];
  crew: Crew[];
};