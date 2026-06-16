import { memo } from 'react';
import MovieCard from './MovieCard';

const MovieList = memo(({ movies, onCardClick }) => {
  console.log('MovieList 판판 전체 렌더링됨! 🎬');

  if (movies.length === 0) {
    return <p style={{ marginTop: '4px', color: '#666' }}>검색 결과가 없습니다. 영화를 검색해 보세요! 🍠</p>;
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: '20px',
      width: '100%',
      maxWidth: '1000px',
      padding: '20px 0'
    }}>
      {movies.map((movie) => (
        <MovieCard 
          key={movie.id} 
          movie={movie} 
          onCardClick={onCardClick} 
        />
      ))}
    </div>
  );
});

MovieList.displayName = 'MovieList';
export default MovieList;