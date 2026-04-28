import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // 1. 경로를 감지하기 위해 추가
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import { Movie } from '../types/movie';

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation(); // 2. 현재 URL 경로(pathname)를 가져옵니다.

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const apiKey = import.meta.env.VITE_API_KEY;
        
        // 3. 경로에 따라 TMDB API 엔드포인트를 결정합니다.
        // 예: /movies/now-playing -> now_playing
        let category = "popular"; 
        if (location.pathname.includes("now-playing")) category = "now_playing";
        else if (location.pathname.includes("top-rated")) category = "top_rated";
        else if (location.pathname.includes("up-coming")) category = "upcoming";

        const response = await axios.get(`https://api.themoviedb.org/3/movie/${category}`, {
          params: { api_key: apiKey, language: 'ko-KR', page: 1 }
        });
        
        setMovies(response.data.results);
      } catch (error) {
        console.error("영화 목록 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [location.pathname]); // 4. 경로가 바뀔 때마다(메뉴 클릭 시) 다시 실행됩니다.

  if (isLoading) return <div className="bg-black min-h-screen text-white p-10 flex items-center justify-center font-bold">목록 불러오는 중...</div>;

  return (
    <div className="bg-black min-h-screen p-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MoviesPage;