import { memo } from 'react';

const MovieCard = memo(({ movie, onCardClick }) => {
  console.log(`MovieCard 렌더링됨: ${movie.title} 🎴`);
  
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  return (
    <div 
      onClick={() => onCardClick(movie)}
      style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        textAlign: 'center'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <img src={posterUrl} alt={movie.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
      <div style={{ padding: '12px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {movie.title}
        </h4>
        <span style={{ color: '#ffa500', fontWeight: 'bold', fontSize: '14px' }}>
          ⭐ {movie.vote_average?.toFixed(1)}
        </span>
      </div>
    </div>
  );
});

MovieCard.displayName = 'MovieCard';
export default MovieCard;