import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MovieDetail, Credits } from '../types/movie';

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!movieId || movieId === "undefined" || movieId.includes(':')) return;

      try {
        setIsLoading(true);
        const apiKey = import.meta.env.VITE_API_KEY;
        const [detailRes, creditsRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            params: { api_key: apiKey, language: 'ko-KR' }
          }),
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
            params: { api_key: apiKey, language: 'ko-KR' }
          })
        ]);
        setMovie(detailRes.data);
        setCredits(creditsRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovieData();
  }, [movieId]);

  if (isLoading) return <div className="bg-black min-h-screen text-white p-10">로딩 중...</div>;
  if (!movie) return <div className="bg-black min-h-screen text-white p-10">영화 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="bg-black min-h-screen text-white">
      <div 
        className="relative h-[500px] w-full bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.2)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
      >
        <div className="absolute inset-0 flex flex-col justify-center px-10 max-w-3xl">
          <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
          <div className="flex gap-4 text-lg mb-4 text-gray-300">
            <span>평점 {movie.vote_average.toFixed(1)}</span>
            <span>{movie.release_date.split('-')[0]}</span>
            <span>{movie.runtime}분</span>
          </div>
          <p className="text-lg leading-relaxed line-clamp-6">{movie.overview}</p>
        </div>
      </div>
      <div className="px-10 py-12">
        <h2 className="text-3xl font-bold mb-10 border-b border-gray-800 pb-4">감독/출연</h2>
        <div className="flex gap-8 overflow-x-auto pb-6">
          {credits?.cast.slice(0, 15).map((person) => (
            <div key={person.id} className="flex-shrink-0 w-32 text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-3 border-2 border-gray-700">
                <img 
                  src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : 'https://via.placeholder.com/200'} 
                  alt={person.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-bold text-sm truncate">{person.name}</p>
              <p className="text-xs text-gray-400 truncate">{person.character}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;