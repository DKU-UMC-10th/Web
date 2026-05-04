import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="flex items-center gap-10">
        <Link to="/" className="text-red-600 font-black text-2xl tracking-tighter">
          YOUTUBE_MOVIE
        </Link>
        
        <div className="flex gap-8 text-gray-500 font-semibold text-sm">
          <Link to="/" className="hover:text-green-500 transition-colors">홈</Link>
          <Link to="/movies/popular" className="hover:text-green-500 transition-colors">인기 영화</Link>
          <Link to="/movies/now-playing" className="hover:text-green-500 transition-colors">상영 중</Link>
          <Link to="/movies/top-rated" className="hover:text-green-500 transition-colors">평점 높은</Link>
          <Link to="/movies/up-coming" className="hover:text-green-500 transition-colors">개봉 예정</Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-600 text-sm font-bold hover:text-black">로그인</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-600 transition-all shadow-sm">
          회원가입
        </button>
      </div>
    </nav>
  );
};

export default Navbar;