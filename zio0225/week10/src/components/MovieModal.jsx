export default function MovieModal({ movie, onClose }) {
  if (!movie) return null;

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
    : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  // IMDb 검색 링크 인코딩 연결 활성화
  const handleImdbSearch = () => {
    const searchUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;
    window.open(searchUrl, '_blank');
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff', width: '90%', maxWidth: '500px', borderRadius: '12px',
        overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', position: 'relative'
      }}>
        {/* 상단 포스터/백드롭 대형 이미지 */}
        <img src={backdropUrl} alt={movie.title} style={{ width: '100%', height: '230px', objectFit: 'cover' }} />
        
        {/* 상세 정보 텍스트 영역 */}
        <div style={{ padding: '20px' }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '22px' }}>{movie.title}</h2>
          <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#666', marginBottom: '15px' }}>
            <span>📅 개봉일: {movie.release_date || 'N/A'}</span>
            <span style={{ color: '#ffa500', fontWeight: 'bold' }}>⭐ 평점: {movie.vote_average?.toFixed(1)}</span>
          </div>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#333', maxHeight: '120px', overflowY: 'auto', marginBottom: '20px' }}>
            {movie.overview || '상세 줄거리 정보가 제공되지 않는 영화입니다.'}
          </p>

          {/* 하단 기능 버튼 제어 영역 */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleImdbSearch} style={{
              flex: 1, padding: '10px', backgroundColor: '#f5c518', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
            }}>
              IMDb에서 검색하기
            </button>
            <button onClick={onClose} style={{
              padding: '10px 20px', backgroundColor: '#eee', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
            }}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}