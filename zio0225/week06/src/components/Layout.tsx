import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 지오님의 AuthContext 활용 ㅡㅡ

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth(); // 로그인 상태 및 닉네임 가져오기 🥊
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* --- 헤더 영역 --- */}
      <header className="w-full flex justify-between items-center p-4 border-b border-zinc-900 bg-black">
        <div className="flex items-center gap-4">
          {/* 🍔 SVG 버거 버튼 (모바일용) */}
          <button 
            className="lg:hidden text-zinc-400 hover:text-white transition-colors" 
            onClick={toggleSidebar}
          >
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.95 11.95h32m-32 12h32m-32 12h32" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 
            className="text-xl font-bold text-pink-500 cursor-pointer hover:text-pink-400 transition-colors" 
            onClick={() => navigate('/')}
          >
            돌려돌려LP판
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-zinc-300">{user.nickname}님 반갑습니다.</span>
              <button 
                onClick={logout} 
                className="px-4 py-2 bg-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigate('/login')} 
                className="px-4 py-2 bg-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                로그인
              </button>
              <button 
                onClick={() => navigate('/signup')} 
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </header>

      <div className="flex">
        {/* --- 사이드바 영역 --- */}
        <aside className={`fixed lg:static top-0 left-0 h-full w-64 bg-zinc-900 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-50`}>
          <nav className="p-6">
            <ul className="space-y-4">
              <li 
                className="text-zinc-300 hover:text-pink-500 cursor-pointer transition-colors py-2" 
                onClick={() => { navigate('/lps'); setIsSidebarOpen(false); }}
              >
                LP 목록
              </li>
              <li 
                className="text-zinc-300 hover:text-pink-500 cursor-pointer transition-colors py-2" 
                onClick={() => { navigate('/mypage'); setIsSidebarOpen(false); }}
              >
                마이페이지
              </li>
            </ul>
          </nav>
        </aside>

        {/* --- 메인 영역 (페이지들이 갈아끼워지는 곳) --- */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* --- 우측 하단 플로팅 버튼 (+) ㅡㅡ --- */}
      <button 
        className="fixed bottom-6 right-6 w-14 h-14 bg-pink-600 text-white rounded-full shadow-lg hover:bg-pink-700 transition-colors flex items-center justify-center text-2xl font-bold z-40"
        onClick={() => navigate('/lp/new')}
      >
        +
      </button>

      {/* 사이드바 열렸을 때 배경 클릭하면 닫히게 🥊 */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Layout;