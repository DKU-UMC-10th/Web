import { Link } from 'react-router-dom';
import { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <Link to={`/movies/${movie.id}`} className="block h-full">
      <div className="group relative bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all hover:scale-105 h-full">
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
          alt={movie.title}
          className="w-full h-72 object-cover"
        />
        <div className="p-4">
          <h3 className="text-white font-bold truncate text-sm">{movie.title}</h3>
          <p className="text-gray-400 text-xs mt-1">{movie.release_date}</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;