import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query'; 
import { useAuth } from '../../context/AuthContext'; 
import ConfirmModal from '../common/ConfirmModal'; 
import api from '../../api/axios'; 

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false); 
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // 1. 회원 탈퇴 Mutation (주소: /v1/users)
  const withdrawMutation = useMutation({
    mutationFn: () => api.delete('/v1/users'),
    onSuccess: () => {
      localStorage.clear();
      alert('탈퇴가 완료되었습니다. 그동안 이용해주셔서 감사합니다! 🥊');
      navigate('/login');
    },
    onError: (error) => {
      console.error(error);
      alert('탈퇴 처리 중 에러가 발생했습니다.');
    }
  });

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* --- 헤더 영역 (고정) --- */}
      <header className="w-full flex justify-between items-center p-4 border-b border-zinc-900 bg-black sticky top-0 z-[60]">
        <div className="flex items-center gap-4">
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
              <span className="text-zinc-300 text-sm hidden sm:inline">{user.nickname}님 반갑습니다.</span>
              <button 
                onClick={logout} 
                className="px-4 py-2 bg-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-700 transition-colors text-sm"
              >
                로그아웃
              </button>
            </>
          ) : (
            <button 
              onClick={() => navigate('/login')} 
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-bold"
            >
              로그인
            </button>
          )}
        </div>
      </header>

      {/* --- 바디 영역 (사이드바 + 메인) --- */}
      <div className="flex flex-1">
        {/* --- 사이드바 영역 --- */}
        <aside className={`
          fixed lg:static top-0 left-0 h-[calc(100vh-65px)] w-64 bg-zinc-900 
          transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 
          flex flex-col justify-between border-r border-zinc-800
        `}>
          {/* 상단 메뉴 */}
          <nav className="p-6 flex-1 overflow-y-auto">
            <ul className="space-y-2">
              <li 
                className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl cursor-pointer transition-all px-4 py-3 flex items-center gap-3" 
                onClick={() => { navigate('/lps'); setIsSidebarOpen(false); }}
              >
                <span>💿</span> LP 목록
              </li>
              <li 
                className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl cursor-pointer transition-all px-4 py-3 flex items-center gap-3" 
                onClick={() => { navigate('/mypage'); setIsSidebarOpen(false); }}
              >
                <span>👤</span> 마이페이지
              </li>
            </ul>
          </nav>

          {/* 하단 탈퇴 버튼 (무조건 바닥 고정) 🥊 */}
          <div className="p-6 border-t border-zinc-800 bg-zinc-900">
            <button 
              onClick={() => setIsWithdrawModalOpen(true)}
              className="w-full text-left px-4 py-2 text-sm text-zinc-500 hover:text-red-500 transition-colors font-medium"
            >
              🏃 회원 탈퇴하기
            </button>
          </div>
        </aside>

        {/* --- 메인 콘텐츠 영역 --- */}
        <main className="flex-1 p-6 overflow-y-auto bg-black">
          <Outlet />
        </main>
      </div>

      {/* --- 우측 하단 플로팅 버튼 --- */}
      <button 
        className="fixed bottom-6 right-6 w-14 h-14 bg-pink-600 text-white rounded-full shadow-lg hover:bg-pink-700 transition-transform hover:scale-110 flex items-center justify-center text-2xl font-bold z-40"
        onClick={() => navigate('/lp/new')}
      >
        +
      </button>

      {/* --- 회원 탈퇴 확인 모달 🥊 --- */}
      <ConfirmModal 
        isOpen={isWithdrawModalOpen}
        title="회원 탈퇴"
        message="정말 탈퇴하시겠습니까? 🥊\n모든 데이터가 삭제되며 복구할 수 없습니다."
        confirmText="탈퇴하기"
        onClose={() => setIsWithdrawModalOpen(false)}
        onConfirm={() => withdrawMutation.mutate()}
      />

      {/* 모바일 사이드바 배경 클릭 시 닫기 */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Layout;