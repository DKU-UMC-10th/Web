export type Movie = {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export type MovieResponse = {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export type MovieGenre = {
    id: number;
    name: string;
}

export type MovieCollection = {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
}

export type MovieProductionCompany = {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
}

export type MovieProductionCountry = {
    iso_3166_1: string;
    name: string;
}

export type MovieSpokenLanguage = {
    english_name: string;
    iso_639_1: string;
    name: string;
}

export type MovieDetail = {
    adult: boolean;
    id: number;
    imdb_id: string | null;
    title: string;
    original_title: string;
    original_language: string;
    overview: string;
    backdrop_path: string | null;
    poster_path: string | null;
    release_date: string;
    belongs_to_collection: MovieCollection | null;
    budget: number;
    homepage: string;
    origin_country: string[];
    popularity: number;
    production_companies: MovieProductionCompany[];
    production_countries: MovieProductionCountry[];
    revenue: number;
    vote_average: number;
    vote_count: number;
    status: string;
    tagline: string;
    video: boolean;
    runtime: number;
    genres: MovieGenre[];
    spoken_languages: MovieSpokenLanguage[];
}

export type MovieCreditCast = {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

export type MovieCreditCrew = {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
}

export type MovieCreditsResponse = {
    id: number;
    cast: MovieCreditCast[];
    crew: MovieCreditCrew[];
}