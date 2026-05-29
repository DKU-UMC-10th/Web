import { useState, useCallback } from 'react';
import axios from 'axios';
import SearchForm from './components/SearchForm';
import MovieList from './components/MovieList';
import MovieModal from './components/MovieModal';

export default function App() {
  const [title, setTitle] = useState('');
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState('ko-KR');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // 📡 TMDB API 비동기 조회 엔진
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('영화 제목을 입력해 주세요!');

    // 💡 [여기 추가!] 토큰이 .env.local에서 제대로 넘어오는지 브라우저 콘솔(F12)에 찍어봅니다.
    console.log('--- 🔑 현재 환경변수에서 불러온 토큰 ---');
    console.log(import.meta.env.VITE_TMDB_TOKEN);
    console.log('--------------------------------------');

    try {
      const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          query: title,
          include_adult: includeAdult,
          language: language,
          page: 1
        },
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
          accept: 'application/json'
        }
      });
      setMovies(response.data.results || []);
    } catch (error) {
      console.error('TMDB 호출 오류:', error);
      alert('영화 데이터를 가져오는 데 실패했습니다. 토큰을 확인해 주세요.');
    }
  };

  // 🎯 useCallback으로 카드 클릭 함수 주소 고정 (MovieCard 리렌더링 방어용)
  const handleCardClick = useCallback((movie) => {
    setSelectedMovie(movie);
  }, []);

  // 🎯 useCallback으로 모달 닫기 함수 주소 고정
  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  return (
    <div style={{
      backgroundColor: '#f1f2f6', minHeight: '100vh', padding: '4px 20px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif'
    }}>
      <h1 style={{ margin: '30px 0', color: '#2f3542' }}>🎬 UMC 영화 검색 센터 🚀</h1>
      
      {/* 검색 상단 바 컴포넌트 */}
      <SearchForm 
        title={title} setTitle={setTitle}
        includeAdult={includeAdult} setIncludeAdult={setIncludeAdult}
        language={language} setLanguage={setLanguage}
        onSubmit={handleSearchSubmit}
      />

      {/* 결과 그리드 목록 컴포넌트 */}
      <MovieList movies={movies} onCardClick={handleCardClick} />

      {/* 영화 상세 보기 모달 포탈 */}
      <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
    </div>
  );
}