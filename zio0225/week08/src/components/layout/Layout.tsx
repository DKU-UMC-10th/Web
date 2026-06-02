import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query'; 
import { useAuth } from '../../context/AuthContext'; 
import { useSidebar } from '../../hooks/useSidebar'; 
import ConfirmModal from '../common/ConfirmModal'; 
import Sidebar from '../Sidebar'; 
import api from '../../api/axios'; 

const Layout = () => {
  // 미션3 커스텀 훅 연동
  const { isOpen: isSidebarOpen, toggle: toggleSidebar, close: closeSidebar } = useSidebar();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false); 
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  // 회원 탈퇴 Mutation
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
      
      {/* 🛠️ 미션3: 직접 만든 커스텀 사이드바 컴포넌트 장착 */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar} 
        onWithdraw={() => setIsWithdrawModalOpen(true)} 
      />

      {/* --- 헤더 영역 (고정) --- */}
      <header className="w-full flex justify-between items-center p-4 border-b border-zinc-900 bg-black sticky top-0 z-[60]">
        <div className="flex items-center gap-4">
          {/* 🛠️ 이제 화면 크기와 상관없이 항상 노출되는 ☰ 버튼 */}
          <button 
            className="text-zinc-400 hover:text-white transition-colors p-1" 
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

      {/* --- 바디 영역 --- */}
      <div className="flex flex-1">
        {/* ❌ 기존에 박혀있던 고정형 <aside> 태그 영역을 통째로 걷어냈습니다.
          이 자리에 메뉴바가 항상 상주해있었기 때문에 토글 애니메이션이 티가 안 났던 것입니다.
        */}

        {/* --- 메인 콘텐츠 영역 (본문이 전체 화면을 넓게 사용) --- */}
        <main className="flex-1 p-6 overflow-y-auto bg-black">
          <Outlet />
        </main>
      </div>

      {/* --- 플로팅 버튼 --- */}
      <button 
        className="fixed bottom-6 right-6 w-14 h-14 bg-pink-600 text-white rounded-full shadow-lg hover:bg-pink-700 transition-transform hover:scale-110 flex items-center justify-center text-2xl font-bold z-40"
        onClick={() => navigate('/lp/new')}
      >
        +
      </button>

      {/* --- 회원 탈퇴 확인 모달 --- */}
      <ConfirmModal 
        isOpen={isWithdrawModalOpen}
        title="회원 탈퇴"
        message="정말 탈퇴하시겠습니까? 🥊\n모든 데이터가 삭제되며 복구할 수 없습니다."
        confirmText="탈퇴하기"
        onClose={() => setIsWithdrawModalOpen(false)}
        onConfirm={() => withdrawMutation.mutate()}
      />
    </div>
  );
};

export default Layout;