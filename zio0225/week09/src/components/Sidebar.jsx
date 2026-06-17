import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ isOpen, onClose, onWithdraw }) {
  const navigate = useNavigate();

  const handleMenuClick = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* 1) 배경 어두워지는 딤드(Dimmed) 처리 영역 (z-index 최상위급 격상) */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* 2) Sidebar UI 및 스르륵 열리는 애니메이션 (z-index 최상위급 격상) */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-950 text-white z-[80] shadow-[5px_0_25px_rgba(0,0,0,0.5)] transform transition-transform duration-300 ease-in-out flex flex-col justify-between border-r border-zinc-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* 상단 콘텐츠 영역 */}
        <div>
          <div className="flex justify-between items-center p-6 border-b border-zinc-900">
            <h2 className="text-xl font-bold text-pink-500">돌려돌려LP판</h2>
            <button 
              onClick={onClose} 
              className="text-zinc-400 hover:text-white text-sm transition-colors px-2 py-1 rounded bg-zinc-900"
            >
              ✕ 닫기
            </button>
          </div>

          {/* 메뉴 리스트 */}
          <nav className="p-6">
            <ul className="space-y-2">
              <li 
                className="text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl cursor-pointer transition-all px-4 py-3 flex items-center gap-3" 
                onClick={() => handleMenuClick('/lps')}
              >
                <span>💿</span> LP 목록
              </li>

              <li 
                className="text-pink-400 hover:text-pink-300 hover:bg-zinc-900 rounded-xl cursor-pointer transition-all px-4 py-3 flex items-center gap-3 font-semibold" 
                onClick={() => handleMenuClick('/search')}
              >
                <span>🔍</span> LP 검색
              </li>

              <li 
                className="text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl cursor-pointer transition-all px-4 py-3 flex items-center gap-3" 
                onClick={() => handleMenuClick('/mypage')}
              >
                <span>👤</span> 마이페이지
              </li>
            </ul>
          </nav>
        </div>

        {/* 하단 탈퇴 버튼 */}
        <div className="p-6 border-t border-zinc-900 bg-zinc-950">
          <button 
            onClick={() => {
              onClose();       
              onWithdraw();    
            }}
            className="w-full text-left px-4 py-2 text-sm text-zinc-500 hover:text-red-500 transition-colors font-medium"
          >
            🏃 회원 탈퇴하기
          </button>
        </div>
      </aside>
    </>
  );
}