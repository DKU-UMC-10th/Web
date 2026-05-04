import { Link } from 'react-router-dom';
import { Movie } from '../types/movie';

const MovieCard = ({ movie }: { movie: Movie }) => {
    return (
        <Link to={`/movie/${movie.id}`} className="group">
            <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
                <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                    alt={movie.title}
                    className="w-full h-auto object-cover"
                />
            </div>
            <div className="mt-2 text-white">
                <p className="font-bold text-sm truncate">{movie.title}</p>
                <p className="text-xs text-gray-400">{movie.release_date}</p>
            </div>
        </Link>
    );
};

export default MovieCard;